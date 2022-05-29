import { auth } from './firebase.config.js'
import { goToLoginScreen } from './utils/redirect.js';

//getting log out btn reference on navbar DOM
const authBtn = document.getElementById('auth')

//attaching event listener
authBtn.addEventListener('click', logout)

function logout() {
    auth.signOut().then(() => {
        //once user is signed out redirect to home page
        goToLoginScreen()
    });
}

export { logout }