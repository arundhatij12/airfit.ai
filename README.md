
# Airfit.ai
**airfit.ai** is a prototype of a fitness tracking system that uses facial recognition, pose estimation, body segmentation, selfie segmentation , holistic estimation, and control your gym experience with fluid hand gestures. FORGET THE BUTTONS

used all mediapipe in javacript libraries. 

# Live Demo
 -https://youtu.be/aLBFp2tRoGI (Allow camera access)


## Table of content
  - [Features](#features)
  - [TechStack](#techstack)
  
## Features
- **Pose estimation**
   - Use your left hand (index keypoint) to **gesture around the START, REST and END** workout sessions to perform these actions
   - Use you Right hand to do bicep curl press.
   - **Correct pose and will be highlighted by green line indicator as you exercise** .
   - Similarly REST will stop training timer and start rest timer, during this time if you pose correctly it won't be counted or highlighted.
   - End workout with gesture REST similarly and **get your Workout stats instantly** in the bottom Stats card.
   - Firebase Firestore **database updates** the last workout session and shows stats including **streak** if you workout on consecutive days.
   - exercise with a **Virtual gym background**

- **Air piano** Keyless , Touchless keyless Air Piano
  - Use right or left hand index finger to gesture on a tile and get the respective piano tune
  - Estimates hand keypoints, use index finger only
  -  **piano tile prototype which is gesture based ,touchless and keyless**

-**Dance Mirror**
   - Start the music and timer and get grooving with your **colored body part segmented mirror**
   - **Seamless, fast and detects head to toe**
   - timer to stop and resume dance and music

- **Gesture controlled & face expression controlled Feedback**
   - hover your left or right hand to give positive and negative feedback
   - make a happy or suprised expression for positive feedback, sad, angry or disgusted for negative 

- **INTERACTIVE**
   - used sounds for more interactivity

- **Authentication**
  - Login or Register.
  - Get login errors
  - Auth check in meet to **prevent unauthorized** users from using our app.
<br></br>


1. Front End / Client Side / Facial recognition libraries used
   - HTML 
   - Bulma CSS
   - Mediapipe in javascript Libraries
   - for keyless Air Piano -> https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/hands.js
   - for colored dance mirror->  https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2 & https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0
   - for feedback -> https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.1/holistic.js and face api for expression detection
   - For workout->  https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/pose.js 
   - For virtual background-> https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js
2. BackEnd :
    - Firebase Firestore Database for  Data management **workout stats and streak**
    - Firebase Authentication for Sign In / Register /Test login
    - Netlify - deployment.
