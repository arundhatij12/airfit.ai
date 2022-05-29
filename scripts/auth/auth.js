import { auth, db } from '../firebase.config.js'
import { displayNone, displayBlock } from '../utils/domFunctions.js';
import { goToHomePg } from '../utils/redirect.js';

//getting DOM elements
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');
const testLoginBtn = document.getElementById('test_login');
const inputName = document.getElementById('name_field');

const emailRef = document.getElementById('email');
const passwordRef = document.getElementById('password');
const fullNameRef = document.getElementById('full_name');

const emailErrorRef = document.getElementById('email_error');
const passwordErrorRef = document.getElementById('password_error');
const nameErrorRef = document.getElementById('name_error');

const TEST_EMAIL = 'test@test.com';
const TEST_PSWD = 'test123';

//attach event listeners
loginBtn.addEventListener('click', login);
registerBtn.addEventListener('click', register);
testLoginBtn.addEventListener('click', testLogin);

let emailError = '';
let passwordError = '';
let fullNameError = '';

function clearErrors() {
  emailError = '';
  passwordError = '';
  fullNameError = '';
}

function loadingBtn(element) {
  element.classList.add('is-loading'); //add this  bulma class to the DOM element
}

function testLogin() {
  emailRef.value = TEST_EMAIL; //fill email input
  passwordRef.value = TEST_PSWD; //fill password input

  //hide the test Login btn once test credentials are filled
  displayNone(testLoginBtn)
}


//   register/sign-up function
function register() {
  clearErrors();
  displayBlock(inputName) //show name field in case user is registering
  displayNone(testLoginBtn)  // hide test login Btn for register

  // Get all  input field values
  const email = emailRef.value;
  const password = passwordRef.value;
  const full_name = fullNameRef.value;

  if (full_name.length > 0) {
    displayNone(nameErrorRef); //hide name error below name field
    //use firebase auth
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(function (credentials) {
        loadingBtn(registerBtn); //make the btn have a loading spinner
        db.collection('users')
          .doc(credentials.user.uid) //create a document with user user uid instead of default auto id
          .set({ //set the below fields in the document
            full_name: full_name,
            email: email,
          })
          .then(() => {
            //redirecting to pose screen
            alert('User Created');
            goToHomePg() //redirect to home page
          });
      })
      .catch((err) => {
        switch (err.code) {
          case 'auth/email-already-in-use':
          case 'auth/invalid-email':
            emailError = err.message; //
            emailErrorRef.innerHTML = emailError; //render error message on DOM
            break;
          case 'auth/weak-password':
            passwordError = err.message;
            passwordErrorRef.innerHTML = passwordError; //render error message on DOM
            break;
        }
      });
  } else if (full_name.length === 0) {
    nameErrorRef.innerHTML = 'Enter name'; //if name input is empty on register show this error message
  }
}

// Set up our login function CHNAGE THIS AS BAOVE
function login() {
  clearErrors();
  displayNone(inputName) //for login we don't want user to enter name , it's already a field in the database
  displayBlock(testLoginBtn) //show test login option 

  // Get all  input field values
  const email = emailRef.value;
  const password = passwordRef.value;

  //firebase auth function for signing in using email and password
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function () {
      loadingBtn(loginBtn);  //make the login button loading
      alert('User Logged In');
      //once sign in successful , redirect to pose screen
      goToHomePg()
    })
    .catch((err) => {
      switch (err.code) {
        case 'auth/invalid-email':
        case 'auth/user-disabled':
        case 'auth/user-not-found':
          emailError = err.message;
          emailErrorRef.innerHTML = emailError; //render error message on DOM
          break;
        case 'auth/wrong-password':
          passwordError = err.message;
          passwordErrorRef.innerHTML = passwordError; //render error message on DOM
          break;
      }
    });
}
