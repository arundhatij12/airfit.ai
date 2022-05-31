
# Airfit.ai - FORGET THE BUTTONS
**airfit.ai** is a prototype of a next generation fitness tracking system, touchless air piano and more that uses facial recognition, pose estimation, body segmentation, selfie segmentation , holistic estimation, and control your gym experience with fluid hand gestures. FORGET THE BUTTONS, truly.

 **seamless, fast and accurate detections** 
 
used all mediapipe in javacript libraries && tensorflow.js pretrained Models. 

![Cover](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/airfit.png)

# Live Demo
 -https://youtu.be/aLBFp2tRoGI 

# Live Link
 -https://airfitai.netlify.app/ (Allow camera access & if u don't get database data on homepage or workout page then check for any firebase CORS blocked issue in console - if yes then use incognito mode in browser)
 
 # Project Documentation
 - https://docs.google.com/presentation/d/1cuawugNffs0e8bxs8DmYHO4PB675CFfyq9BlGEIqvkk/edit?usp=sharing
 
## Table of content
  - [ProjectFlow](#projectflow)
  - [Features](#features)
  - [TechStack](#techstack)
  - [LocalSetup](#localsetup)


## ProjectFlow

![ProjectFlow](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/project%20flow.png)
  
## Features
- **Pose estimation**
   - Use your left hand (index keypoint) to **gesture around the START, REST and END** workout sessions to perform these actions. NOTE -> **Hover vertically up towards the button and avoid hovering horizontally on all the buttons at once to give 1 second to the timer to start or another action to take place**
   - Use you Right hand to do **bicep curl press**.
   - **Correct pose and will be highlighted by green line indicator as you exercise** This is based on the angle between your right shoulder, right    elbow and right wrist and position change on hand.
   - At all other times the connecing line of detected keypoints will be **white** 
   - Similarly REST will pause training timer and start rest timer, during this time even if you pose correctly it won't be counted or highlighted.
   - End workout with gesture REST similarly and **get your Workout stats instantly** in the bottom stats card.
   - Firebase Firestore **database updates** the last workout session and shows stats including **streak** if you workout on consecutive days.
   - option to switch to **Virtual gym background** for working out, everything works as above.
 
![WorkOutCurl](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/workout_correct_pose.png) 
![WorkOutNoCurl](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/workout_no_curl.png) 
![VirtualBackground](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/virtual%20bg.png)
![WorkoutStatsFromDatabase](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/workout%20stats.png)

- **Air piano** Keyless, Touchless keyless Air Piano
  - Use right or left hand index finger to hover on a piano tile and get the respective piano tune
  - Estimates hand keypoints, use index finger only.
  -  **next gen piano tile prototype which is gesture-based ,touchless and keyless**

![AirPiano](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/air%20piano.png)

- **Dance Mirror**
  - Start the music and timer and get grooving with your **colored Full-body part segmented mirror**
  - **Seamless, fast and detects head to toe**
  - timer and option to stop and resume dance and music.

![DanceMirror](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/Dance%20mirror.png)

- **Gesture controlled & face expression controlled Feedback**
  - hover your left or right hand to give positive and negative feedback. 
  - Feedback sounds integrated.
  - make a happy or suprised expression for positive feedback, sad, angry or disgusted for negative 

![Feedback_hand](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/FEEDBACK_HAND.png)
![Feedback_face](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/feedback_FACE.png)

- **INTERACTIVE**
  - used sounds for more interactivity

- **Authentication**
  - Login or Register.
  - Get login errors on the go if you try logging in/ registering with bad formatted email or password. or registering with already being used email.
  - **Auth check on all pages first** to **prevent unauthorized** users from using any feature of our app.

![Auth_errors_displayed](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/login%20error.png)

<br></br>


## TechStack

![TechStack](https://github.com/arundhatij12/airfit.ai/blob/master/assets/images/tech%20stack.png)

- **Front End / Client Side / Facial recognition libraries used**
   - HTML 
   - Bulma CSS
   - Mediapipe in javascript Libraries
   - for keyless Air Piano -> https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/hands.js
   - for colored dance mirror->  https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2 & https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0
   - for feedback -> https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/holistic.js and face api for expression detection
   - For workout->  https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/pose.js 
   - For virtual background-> https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js
  
- **BackEnd**
    - Firebase Firestore Database for  Data management **workout stats and streak**
    - Firebase Authentication for Sign In / Register /Test login
    - Netlify - deployment.


## LocalSetup 

1 .Clone the repository using the command : git clone https://github.com/arundhatij12/airfit.ai.git
2. Open index.html

You're good to go!
    
