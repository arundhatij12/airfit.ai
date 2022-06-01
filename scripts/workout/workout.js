import { playAudio } from '../utils/useAudio.js';
import { timer, pauseTimer, resetTimer, } from '../utils/usePrimaryTimer.js';
import { timer2, resetTimer2 } from '../utils/useSecondaryTimer.js';
import { selfieSegmentation } from '../background/background.js'
import { goToLoginScreen, goToAirPiano } from '../utils/redirect.js';
import { toggleBtnText } from '../utils/domFunctions.js'
import { getDayOfYear, convertTimeIntoSeconds, convertTimeFromSeconds, calculateJointAngle } from '../utils/conversions.js'
import { auth, db } from '../firebase.config.js'
import { redirectToLoginIfUserIsNotLoggedIn } from '../redirectToLoginIfNotLoggedIn.js'

const video5 = document.getElementsByClassName('workout_input_video')[0];
const out5 = document.getElementsByClassName('workout_output')[0];
const controlsElement5 = document.getElementsByClassName('control5')[0];
const canvasCtx5 = out5.getContext('2d');

const statSets = document.getElementById('stat_sets');
const statReps = document.getElementById('stat_reps');
const statTrainingTime = document.getElementById('stat_training_time');
const statRestTime = document.getElementById('stat_rest_time');

const streak = document.getElementById('streak')
const name = document.getElementById('name')

//get reference for audio sounds
const restSound = document.getElementById('rest_sound');
const startSound = document.getElementById('start_sound');
const endSound = document.getElementById('end_sound');

//get DOM timer elements reference
const trainingTimeHr = document.getElementById('training_time_hour');
const trainingTimeMin = document.getElementById('training_time_minute');
const trainingTimeSec = document.getElementById('training_time_second');
const restTimeHr = document.getElementById('rest_time_hour');
const restTimeMin = document.getElementById('rest_time_minute');
const restTimeSec = document.getElementById('rest_time_second');

//other DOM btns
const virtualBgBtn = document.getElementById('virtual');
const goToAirPianoBtn = document.getElementById('go-to-air-piano')

const setRef = document.getElementById('set');
const repRef = document.getElementById('reps');
const positionRef = document.getElementById('position');

const WIDTH = 900;
const HEIGHT = 700;

const fpsControl = new FPS();

let count = 0;
let reps = 0;
let set = 0;
let position = 'none';

let fullName;
let isVirtualBgActive = false;
let correctPoseHighlight = false;

let training_time_hour = 0;
let training_time_minute = 0;
let training_time_second = 0;
let rest_time_hour = 0;
let rest_time_minute = 0;
let rest_time_second = 0;

let firebaseUserId;
let streakCount;
let dateTracker;
let workOutDoneToday;
let stat_sets;
let stat_reps;
let stat_training_time;
let stat_rest_time;

let startTrainingTimerId = null;
let startRestTimerId = null;

let isTrainingTimerRunning = false;
let isRestTimerRunning = false;

function resetStats() {
  count = 0;
  reps = 0
  set = 0
  position = 'none'
}

redirectToLoginIfUserIsNotLoggedIn() //on page load check if user logged in, if not redirect to login pg

// listen for auth status changes
auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection('users').onSnapshot(   //get a snapshot of the contents of database
      () => {
        getUser(user); //when user is logged in call getUser function with user object passed as a parameter
      },
      (err) => console.log(err.message)
    );
  } else {
    //redirect to login screen if not logged in
    goToLoginScreen()

  }
});

//get document for that  user from the database collection
function getUser(user) {
  if (user) {
    firebaseUserId = user.uid;
    db.collection('users')
      .doc(firebaseUserId) //query database for document with that user id
      .get()  //get data from database
      .then((doc) => {
        //set stats data by getting these fields from the document from database for that user 
        stat_sets = doc.data().sets;
        stat_reps = doc.data().reps;
        stat_training_time = doc.data().training_time;
        stat_rest_time = doc.data().rest_time;
        dateTracker = doc.data().date
        streakCount = doc.data().streak
        workOutDoneToday = doc.data().workout_done_today
        fullName = doc.data().full_name

        //displaying it on DOM (incase of a new user document won't contain sets/reps/tt/rt fields so those will be undefined and fallback value 0 will be rendered on DOM)
        statSets.innerHTML = stat_sets ?? 0;
        statReps.innerHTML = stat_reps ?? 0;
        statTrainingTime.innerHTML = convertTimeFromSeconds(stat_training_time ?? 0);
        statRestTime.innerHTML = convertTimeFromSeconds(stat_rest_time ?? 0);
        streak.innerHTML = streakCount ?? 0
        name.innerHTML = fullName + " " + 'Your latest stats'
      });
  }
}

//event listeners
virtualBgBtn.addEventListener('click', useVirtualBg);
goToAirPianoBtn.addEventListener('click', goToAirPiano)


function useVirtualBg() {
  //toggle virtual background state
  isVirtualBgActive = !isVirtualBgActive;

  //toggle button for the virtual bg btn based on state of background
  isVirtualBgActive ? toggleBtnText(virtualBgBtn, 'Remove Virtual Background') : toggleBtnText(virtualBgBtn, 'Use Virtual Background')
}

//call the start training timer  ( when ur left hand gestures on START on canvas  )
function startTrainingTimer() {
  isRestTimerRunning = false; //when training timer running ,  rest timer should not run
  
  if (!isTrainingTimerRunning && !isRestTimerRunning) {
    
    startTrainingTimerId = setInterval(() => {
      const trainingTime = timer(trainingTimeHr, trainingTimeMin, trainingTimeSec);

      //updating the training time to be used to calculate stats
      training_time_hour = trainingTime[0]
      training_time_minute = trainingTime[1]
      training_time_second = trainingTime[2]
    }, 1000);
    isTrainingTimerRunning = true; //training timer running flag being set to true
    pauseTimer(startRestTimerId);  //pause the rest timer when training timer is running
  }
}

//pause training timer will start rest timer / starting rest timer will pause training timer
function startRestTimer() {
  isTrainingTimerRunning = false;  //when rest timer running, training timer should not run
  if (!isRestTimerRunning) {
    startRestTimerId = setInterval(() => {
      const restTime = timer2(restTimeHr, restTimeMin, restTimeSec);

      //updating the rest time to be used to calculate stats
      rest_time_hour = restTime[0];
      rest_time_minute = restTime[1];
      rest_time_second = restTime[2];
    }, 1000);
    isRestTimerRunning = true;   //rest timer running flag being set to true
    pauseTimer(startTrainingTimerId);    //pause the training timer when rest timer is running
  }
}

function calculateStreak() {
  //do nothing to streak if it's the same day or if you workout again 
  if (getDayOfYear() === dateTracker || (getDayOfYear() === dateTracker + 1 && workOutDoneToday)) {
    return streakCount = streakCount
  }

  //streak increased by 1 if workout done on consecutive days
  if (getDayOfYear() === dateTracker + 1) {
    return streakCount = streakCount + 1
  }

  //in all other cases reset streak to 0
  return 0
}


//when reset btn gestured upon
function reset() {
  if (confirm('You sure you want to reset?')) {
    //adding a new document (row) to firebase database so that it gets added to total stats before resetting the stat parameters for new session
    db.collection('users')
      .doc(firebaseUserId)
      .update({ //updating stat related fields once user gestures on end workout
        reps: count,
        sets: set,
        streak: calculateStreak(), 
        workout_done_today: true,  //work out done today flag true if you end/reset workout
        training_time: convertTimeIntoSeconds(training_time_hour, training_time_minute, training_time_second),  //storing training time in seconds into database
        rest_time: convertTimeIntoSeconds(rest_time_hour, rest_time_minute, rest_time_second),  //storing rest time in seconds into database
        date: dateTracker ?? getDayOfYear(), //if user is new , then use current day of the year to start keeping a date tracker
      })
      .then(() => {
        //reset to default state/initial state
        resetStats()       
        set = 0
        reps = 0
        position = 'none'
        
        //render reset state on DOM 
        setRef.innerHTML = set;
        repRef.innerHTML = reps;
        positionRef.innerHTML = position;

        //no timers should run when reset 
        isTrainingTimerRunning = false;
        isRestTimerRunning = false;
      });

    //cancelling both timer ids
    pauseTimer(startTrainingTimerId);
    pauseTimer(startRestTimerId);

    //resetting both timers
    resetTimer(trainingTimeHr, trainingTimeMin, trainingTimeSec);
    resetTimer2(restTimeHr, restTimeMin, restTimeSec)
  }
}

function curlCounter(angle) {
  reps = count % 10;  //count stores total number of repetitions while reps is wrt to the set , say count is 12 , then reps will be 2 for set 2.

  //calculation of position and pose based on angle 
  if (angle > 160) {
    position = 'down';
    correctPoseHighlight = false;  // this is not correct pose so connecting line won't be highlighted as green but remain default white
  } else if (angle < 30 && position === 'down') {
    correctPoseHighlight = true;  //this is correct pose and connecting line color will change from white to GREEN
    position = 'up';
    count = count + 1; //correct pose so count increases by 1
  }

  //display above on DOM
  setRef.innerHTML = set;
  repRef.innerHTML = reps;
  positionRef.innerHTML = position;

  //update set by 1 after every 10 reps
  if (count > 0) {
    for (var i = 1; i < 10; i++) {
      if (count > (i - 1) * 10 && count < i * 10) {
        set = i;
      }
    }
  }
}

function pressActionBtn(landmark) {
  //converting normalized into actual x-y coordinates of Your left hand index finger
  const rightIndexGestureControlActual = [landmark.x * WIDTH, landmark.y * HEIGHT];

  //conditions checking what area does your left hand index finger fall in
  const startSection = rightIndexGestureControlActual[0] > 0 && rightIndexGestureControlActual[0] < WIDTH / 3 && rightIndexGestureControlActual[1] < HEIGHT / 4;
  const restSection = rightIndexGestureControlActual[0] > WIDTH / 3 && rightIndexGestureControlActual[0] < WIDTH / 1.5 && rightIndexGestureControlActual[1] < HEIGHT / 4;
  const resetSection = rightIndexGestureControlActual[0] > WIDTH / 1.5 && rightIndexGestureControlActual[0] < WIDTH && rightIndexGestureControlActual[1] < HEIGHT / 4;

  //actions to perform based on met conditions from above
  if (startSection) {
    playAudio(startSound);
    startTrainingTimer();
  } else if (restSection) {
    playAudio(restSound);
    startRestTimer();
  } else if (resetSection) {
    playAudio(endSound);
    reset();
  }
}

function onResultsPose(results) {
  fpsControl.tick();
  canvasCtx5.save();
  canvasCtx5.clearRect(0, 0, out5.width, out5.height);
  canvasCtx5.drawImage(results.image, 0, 0, out5.width, out5.height);

  //getting x-y, coordinates for your right shoulder, elbow and wrist. the camera is lateral so left keypoints is written
  const shoulders = [results.poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER].x, results.poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER].y];
  const elbow = [results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW].x, results.poseLandmarks[POSE_LANDMARKS.LEFT_ELBOW].y];
  const wrist = [results.poseLandmarks[POSE_LANDMARKS.LEFT_WRIST].x, results.poseLandmarks[POSE_LANDMARKS.LEFT_WRIST].y];

  //passing the coordinates of right index finger for gesture control
  pressActionBtn(results.poseLandmarks[POSE_LANDMARKS.RIGHT_INDEX]);

  function getArmAngle() {
    return calculateJointAngle(shoulders, elbow, wrist);
  }

  //only start counting repetitions when start timer has started
  isTrainingTimerRunning && curlCounter(getArmAngle());

  //connecting all the landmarks or keypoints via the line
  drawConnectors(canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, { color: '#fffff0' });

  //when pose is correct then change the connector line color
  correctPoseHighlight &&
    drawConnectors(canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, {
      color: '#66ff00',
    });

  //displaying right side joints with circles
  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_LEFT).map((index) => results.poseLandmarks[index]),
    { color: '#CCCCFF', fillColor: '#40E0D0' }
  );

  //displaying left side joints with circles
  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_RIGHT).map((index) => results.poseLandmarks[index]),
    { color: '#CCCCFF', fillColor: '#ff007f' }
  );

  //displaying neutral joints with circle , in this case it's the nose only
  drawLandmarks(
    canvasCtx5,
    Object.values(POSE_LANDMARKS_NEUTRAL).map((index) => results.poseLandmarks[index]),
    { color: '#CCCCFF', fillColor: '#417950' }
  );

  //restores the most recently saved canvas state
  canvasCtx5.restore();
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
  },
});

pose.onResults(onResultsPose);

const camera = new Camera(video5, {
  onFrame: async () => {
    await pose.send({ image: video5 }); //when camera loaded then send your input video to the pose estimator 
    isVirtualBgActive && (await selfieSegmentation.send({ image: video5 })); //use virtual bg only when btn clicked
  },
  width: WIDTH,
  height: HEIGHT,
});
camera.start();

//setting mediapipe control element arguments
new ControlPanel(controlsElement5, {
  selfieMode: true,
  upperBodyOnly: false,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
})
  .add([
    new StaticText({ title: 'MediaPipe Pose' }),
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
    video5.classList.toggle('selfie', options.selfieMode);
    pose.setOptions(options);
  });


export { out5, canvasCtx5 }
