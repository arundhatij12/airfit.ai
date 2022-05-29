import { timer, pauseTimer } from '../utils/usePrimaryTimer.js';
import { playAudio, stopAudio } from '../utils/useAudio.js';
import { hideElement, showElement } from '../utils/domFunctions.js';
import { goToFeedback } from '../utils/redirect.js';
import { redirectToLoginIfUserIsNotLoggedIn } from '../redirectToLoginIfNotLoggedIn.js'

//input and output video
const video6 = document.getElementsByClassName('input_video6')[0];
const out6 = document.getElementsByClassName('output6')[0];

//get interaction buttons DOM reference
const startDanceBtn = document.getElementById('start-dance')
const stopDanceBtn = document.getElementById('stop-dance')
const goToFeedbackBtn = document.getElementById('go-to-feedback')

const audioRef = document.getElementById('dance_mirror_song')
audioRef.loop = true //enable song on loop 

//get DOM timer elements
const hrRef = document.getElementById('hour')
const minRef = document.getElementById('minute')
const secRef = document.getElementById('second')

const WIDTH = 900;
const HEIGHT = 700;

//body segmentation arguments
const opacity = 1;
const blur = 0;
const flipHorizontal = true;

let isDancing = false;
let startTrainingTimerId = null;

//event listeners
startDanceBtn.addEventListener('click', startDanceFn)
stopDanceBtn.addEventListener('click', stopDanceFn)
goToFeedbackBtn.addEventListener('click', goToFeedback)

redirectToLoginIfUserIsNotLoggedIn() //on page load check if user logged in

//start dance function definition
function startDanceFn() {
  isDancing = true
  playAudio(audioRef)
  hideElement(startDanceBtn)
  showElement(stopDanceBtn)

  //run timer
  if (isDancing) {
    startTrainingTimerId = setInterval(() => {
      timer(hrRef, minRef, secRef)
    }, 1000);
  }
}

//stop dancing function definition
function stopDanceFn() {
  isDancing = false
  stopAudio(audioRef)
  showElement(startDanceBtn)
  hideElement(stopDanceBtn)
  pauseTimer(startTrainingTimerId)
}


async function runBodyPartSegment() {
  //loading the bodypix model
  const net = await bodyPix.load();

  //make detections
  const personSegmentation = await net.segmentPersonParts(video6);

  //draw detections
  const coloredParts = bodyPix.toColoredPartMask(personSegmentation);
  bodyPix.drawMask(out6, video6, coloredParts, opacity, blur, flipHorizontal);
};

//call detectBodyPart when video element has loaded data
const camera = new Camera(video6, {
  onFrame: async () => {
    await runBodyPartSegment(); //once camera loaded start running body segmentation model
  },
  width: WIDTH,
  height: HEIGHT,
});
camera.start();
