import { auth } from './firebase.config.js'
import { goToLoginScreen } from './utils/redirect.js';

function redirectToLoginIfUserIsNotLoggedIn() {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            //redirect to login screen if not logged in
            goToLoginScreen()
        }
    });
}

export { redirectToLoginIfUserIsNotLoggedIn }