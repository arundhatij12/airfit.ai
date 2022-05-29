import { playAudio, stopAudio } from '../utils/useAudio.js'
import { toggleBtnText, removeBorder } from '../utils/domFunctions.js'
import { redirectToLoginIfUserIsNotLoggedIn } from '../redirectToLoginIfNotLoggedIn.js'

const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];
const controlsElement3 = document.getElementsByClassName('control3')[0];
const canvasCtx3 = out3.getContext('2d');

const gesture = document.getElementById('gesture');
const positiveFeedback = document.getElementById('positive_feedback');
const negativeFeedback = document.getElementById('negative_feedback');
const positiveAudioFeedback = document.getElementById('positive_feedback_audio');
const negativeAudioFeedback = document.getElementById('negative_feedback_audio');
const faceExpBtn = document.getElementById('face_expression_btn')

const fpsControl = new FPS();
redirectToLoginIfUserIsNotLoggedIn() //on page load check if user logged in

const WIDTH = 900;
const HEIGHT = 700;
const LINE_WIDTH = 2;
const RADIUS = 8;

let faceDetectionActive = false

//INDEX_FINGER_TIP key
const INDEX_FINGER_TIP = 8;

//feedback messages
const POSITIVE_FEEDBACK = 'Yayy! Glad u had fun with this';
const NEGATIVE_FEEDBACK = "Give me another shot! I won't disappoint";

//style for connecting line and keypoints
const handLandmarkStyles = {
  rightHandLandmarksStyle: {
    color: '#FF7F50',
    fillColor: '#CCCCFF',
    lineWidth: LINE_WIDTH,
    radius: RADIUS,
  },
  rightHandConnectorStyle: { color: '#6495ED' },
  leftHandLandmarksStyle: {
    color: '#FF0000',
    fillColor: '#00FF00',
    lineWidth: LINE_WIDTH,
    radius: RADIUS,
  },
  leftHandConnectorStyle: { color: '#DE3163' },
};


faceExpBtn.addEventListener('click', useFaceDetection)

function useFaceDetection() {
  //toggle the active state of variable
  faceDetectionActive = !faceDetectionActive;

  //toggle btn for the face expression btn based on state of the variable
  faceDetectionActive ? toggleBtnText(faceExpBtn, 'Stop Using Face Expressions to Give Feedback') : toggleBtnText(faceExpBtn, 'Use Face Expressions to Give Feedback');
}

function positiveFeedbackReceived() {
  // stop negative feedback sound and play positive feedback sound , 
  // add border around positive image and remove border from negative image
  //  and set DOM element to show positive feedback message
  stopAudio(negativeAudioFeedback);
  playAudio(positiveAudioFeedback);
  positiveFeedback.style.border = '5px solid green';
  removeBorder(negativeFeedback);
  gesture.innerHTML = POSITIVE_FEEDBACK
}

function negativeFeedbackReceived() {
  // stop positive feedback sound and play negative feedback sound , 
  // add border around negative image and remove border from positive image
  //  and set DOM element to show negative feedback message
  stopAudio(positiveAudioFeedback);
  playAudio(negativeAudioFeedback);
  negativeFeedback.style.border = '5px solid red';
  removeBorder(positiveFeedback);
  gesture.innerHTML = NEGATIVE_FEEDBACK
}

function getFeedbackHandGesture(landmarks, key) {

  //get x,y coordinates of index finger tip wrt the canvas width and height, from the results on model we only get 0 to 1 (normalized)
  const indexFingerTipActualCoordinates = [landmarks[key].x * WIDTH, landmarks[key].y * HEIGHT];

  //defining coordinate range for negative and positive feedback 
  const positiveFeedbackSection = indexFingerTipActualCoordinates[0] < WIDTH / 2 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;
  const negativeFeedbackSection = indexFingerTipActualCoordinates[0] > WIDTH / 2 && indexFingerTipActualCoordinates[1] < HEIGHT / 2;

  //based on above conditions met , give positive or negative feedback
  if (positiveFeedbackSection) {
    positiveFeedbackReceived()
  } else if (negativeFeedbackSection) {
    negativeFeedbackReceived()
  }

}

async function detectFace() {
  //make detections from face api with face landmarks and face expressions detections too 
  const faceDetection = await faceapi.detectAllFaces(video3, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

  //set positive and negative face expression condition based on confidence score of 90%
  const positiveFaceExpressions = faceDetection[0].expressions.happy > 0.9 || faceDetection[0].expressions.surprised > 0.9
  const negativeFaceExpressions = faceDetection[0].expressions.disgusted > 0.9 || faceDetection[0].expressions.sad > 0.9

  //if face detected and either condition met,call the respective functions
  if (faceDetection[0] && positiveFaceExpressions) {
    positiveFeedbackReceived()
  }
  if (faceDetection[0] && negativeFaceExpressions) {
    negativeFeedbackReceived()
  }
}

//when mediapipe holistic library returns results 
function onResultsHolistic(results) {
  fpsControl.tick();
  canvasCtx3.save();
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);
  canvasCtx3.drawImage(results.image, 0, 0, out3.width, out3.height);
  canvasCtx3.lineWidth = 5;

  //results contain either hand keypoints
  if (results.rightHandLandmarks || results.leftHandLandmarks) {
    if (results.rightHandLandmarks) {

      //if right hand landmark returned then pass keypoint coordinates and keypoint index
      getFeedbackHandGesture(results.rightHandLandmarks, INDEX_FINGER_TIP);
    }

    if (results.leftHandLandmarks) {

      //if left hand landmark returned then pass keypoint coordinates and keypoint index
      getFeedbackHandGesture(results.leftHandLandmarks, INDEX_FINGER_TIP);
    }
  }

  //detect facial expressions when give feedback with face expressions active 
  faceDetectionActive && detectFace()

  //connecting hand landmarks(keypoints) via connectors(lines)
  drawConnectors(canvasCtx3, results.rightHandLandmarks, HAND_CONNECTIONS, handLandmarkStyles.rightHandConnectorStyle);
  drawLandmarks(canvasCtx3, results.rightHandLandmarks, handLandmarkStyles.rightHandLandmarksStyle);
  drawConnectors(canvasCtx3, results.leftHandLandmarks, HAND_CONNECTIONS, handLandmarkStyles.leftHandConnectorStyle);
  drawLandmarks(canvasCtx3, results.leftHandLandmarks, handLandmarkStyles.leftHandLandmarksStyle);

  //restores the most recently saved canvas state
  canvasCtx3.restore();
}

const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/${file}`;
  },
});
holistic.onResults(onResultsHolistic);

const camera = new Camera(video3, {
  onFrame: async () => {
    await holistic.send({ image: video3 });
  },
  width: WIDTH,
  height: HEIGHT,
});

//once add face api models are loaded , camera starts
Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('/models'), faceapi.nets.faceLandmark68Net.loadFromUri('/models'), faceapi.nets.faceRecognitionNet.loadFromUri('/models'), faceapi.nets.faceExpressionNet.loadFromUri('/models')]).then(
  camera.start()
);

//setting mediapipe control element arguments
new ControlPanel(controlsElement3, {
  selfieMode: true,
  upperBodyOnly: true,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})
  .add([
    new StaticText({ title: 'MediaPipe Holistic' }),
    fpsControl,
    new Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
    new Toggle({ title: 'Upper-body Only', field: 'upperBodyOnly' }),
    new Toggle({ title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
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
    video3.classList.toggle('selfie', options.selfieMode);
    holistic.setOptions(options);
  });
