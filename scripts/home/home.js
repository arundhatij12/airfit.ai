import { auth, db } from '../firebase.config.js'
import { goToWorkOut } from '../utils/redirect.js'
import { redirectToLoginIfUserIsNotLoggedIn } from '../redirectToLoginIfNotLoggedIn.js';

const startWorkoutBtn = document.getElementById('start_workout')
const streak = document.getElementById('display_streak')
const name = document.getElementById('name')

let userId;

redirectToLoginIfUserIsNotLoggedIn() //on page load check if user logged in

startWorkoutBtn.addEventListener('click', goToWorkOut)

function getUserData() {

    // listen for auth status changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            userId = user.uid; //if user logged in or registered then set user id as uid of user allotted while signing up
            db.collection('users')
                .doc(userId) //search document with the docId as userID
                .get() //get data
                .then((doc) => {
                    streak.innerHTML = doc.data().streak ?? 0 //get streak from database and show on DOM , if new user then streak won't be present as a field in database so set as 0
                    name.innerHTML = 'Welcome ' + doc.data().full_name //get name from database
                })
        }
    })
}


getUserData()
