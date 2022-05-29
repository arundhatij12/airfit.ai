import { goToColorMirror } from '../utils/redirect.js';
import { playAudio } from '../utils/useAudio.js';
import { redirectToLoginIfUserIsNotLoggedIn } from '../redirectToLoginIfNotLoggedIn.js'

//video and canvas Ref
const airPianoInputVideoRef = document.getElementsByClassName('air_piano_input_video')[0];
const airPianoOutputVideoRef = document.getElementsByClassName('air_piano_output_video')[0];
const airPianoControlRef = document.getElementsByClassName('airPianoControl')[0];
const airPianoCanvas = airPianoOutputVideoRef.getContext('2d');

//getting piano audio DOM references
const piano_tile_1 = document.getElementById('piano_1');
const piano_tile_2 = document.getElementById('piano_2');
const piano_tile_3 = document.getElementById('piano_3');
const piano_tile_4 = document.getElementById('piano_4');
const piano_tile_5 = document.getElementById('piano_5');
const piano_tile_6 = document.getElementById('piano_6');

redirectToLoginIfUserIsNotLoggedIn() //on page load check if user logged in

//redirect to color mirror pg btn reference
const goToColorMirrorBtn = document.getElementById('go-to-color-mirror')

const fpsControl = new FPS();
const WIDTH = 640;
const HEIGHT = 480;
const RADIUS = 4;

//INDEX_FINGER_TIP key
const INDEX_FINGER_TIP = 8;

//event listener for redirect to color mirror btn 
goToColorMirrorBtn.addEventListener('click', goToColorMirror)


function playPianoTile(landmarks, key) {
  //get actual coordinates of index finger wrt the canvas width and height
  const indexFingerTipActualCoordinates = [landmarks[0][key].x * WIDTH, landmarks[0][key].y * HEIGHT];

  //calculating each piano tile section condition
  const firstTile = indexFingerTipActualCoordinates[0] > 0 && indexFingerTipActualCoordinates[0] < WIDTH / 6 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const secondTile = indexFingerTipActualCoordinates[0] > WIDTH / 6 && indexFingerTipActualCoordinates[0] < WIDTH / 3 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const thirdTile = indexFingerTipActualCoordinates[0] > WIDTH / 3 && indexFingerTipActualCoordinates[0] < WIDTH / 2 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const fourthTile = indexFingerTipActualCoordinates[0] > WIDTH / 2 && indexFingerTipActualCoordinates[0] < WIDTH / 1.5 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const fifthTile = indexFingerTipActualCoordinates[0] > WIDTH / 1.5 && indexFingerTipActualCoordinates[0] < WIDTH / 1.2 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const sixthTile = indexFingerTipActualCoordinates[0] > WIDTH / 1.2 && indexFingerTipActualCoordinates[0] < WIDTH && indexFingerTipActualCoordinates[1] < HEIGHT / 2;

  //play audio based on above met conditions
  if (firstTile) {
    playAudio(piano_tile_1);
  }
  if (secondTile) {
    playAudio(piano_tile_2);
  }
  if (thirdTile) {
    playAudio(piano_tile_3);
  }
  if (fourthTile) {
    playAudio(piano_tile_4);
  }
  if (fifthTile) {
    playAudio(piano_tile_5);
  }
  if (sixthTile) {
    playAudio(piano_tile_6);
  }

}

//on detecting at least one hand
function onResultsHands(results) {
  fpsControl.tick();

  //save the canvas blank state
  airPianoCanvas.save();
  airPianoCanvas.clearRect(0, 0, airPianoOutputVideoRef.width, airPianoOutputVideoRef.height);
  airPianoCanvas.drawImage(results.image, 0, 0, airPianoOutputVideoRef.width, airPianoOutputVideoRef.height);

  //draw the piano tiles on canvas
  airPianoCanvas.fillRect(0, 0, WIDTH / 6, HEIGHT / 2);
  airPianoCanvas.clearRect(WIDTH / 6, 0, WIDTH / 6, HEIGHT / 2);
  airPianoCanvas.fillRect(WIDTH / 3, 0, WIDTH / 6, HEIGHT / 2);
  airPianoCanvas.clearRect(WIDTH / 2, 0, WIDTH / 6, HEIGHT / 2);
  airPianoCanvas.fillRect(WIDTH / 1.5, 0, WIDTH / 6, HEIGHT / 2);
  airPianoCanvas.clearRect(WIDTH / 1.2, 0, WIDTH / 6, HEIGHT / 2);


  if (results.multiHandLandmarks && results.multiHandedness) {
    //if hand keypoints are detected
    if (results.multiHandLandmarks.length > 0) {

      //if confidence score of either hand detection is greater than 0.95
      if (results.multiHandedness.filter((item) => item.score > 0.95)) {

        //pass coordinates of index finger keypoint of either hand
        playPianoTile(results.multiHandLandmarks, INDEX_FINGER_TIP);
      }

      //connect all the detected hand keypoints (21 keypoints if full hand in frame)
      for (let index = 0; index < results.multiHandLandmarks.length; index++) {
        const classification = results.multiHandedness[index];
        const isRightHand = classification.label === 'Right';
        const landmarks = results.multiHandLandmarks[index];

        //draw connecting lines on canvas
        drawConnectors(airPianoCanvas, landmarks, HAND_CONNECTIONS, { color: isRightHand ? 'red' : 'aqua' }),
          //draw keypoints on canvas
          drawLandmarks(airPianoCanvas, landmarks, {
            color: isRightHand ? 'lime' : 'yellow',
            fillColor: isRightHand ? 'white' : 'black',
            radius: RADIUS,
          });
      }
    }

    //restore the canvas blank state
    airPianoCanvas.restore();
  }
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
  },
});
hands.onResults(onResultsHands);

const camera = new Camera(airPianoInputVideoRef, {
  onFrame: async () => {
    await hands.send({ image: airPianoInputVideoRef }); //once in frame call the hands detection model
  },
  width: WIDTH,
  height: HEIGHT,
});
camera.start();

//setting mediapipe control element arguments
new ControlPanel(airPianoControlRef, {
  selfieMode: true,
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})
  .add([
    new StaticText({ title: 'MediaPipe Hands' }),
    fpsControl,
    new Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new Slider({ title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1 }),
    new Slider({
      title: 'Min Detection Confidence',
      field: 'minDetectionConfidence',
      range: [0, 1],
      step: 0.01,
    }),
    new Slider({
      title: 'Min Tracking Confidence',
      field: 'minTrackingConfidence',
      range: [0, 1],
      step: 0.01,
    }),
  ])
  .on((options) => {
    airPianoInputVideoRef.classList.toggle('selfie', options.selfieMode);
    hands.setOptions(options);
  });
