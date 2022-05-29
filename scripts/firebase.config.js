var firebaseConfig = {
      apiKey: 'AIzaSyDmcVajIFpddtyioote4Dr-cEzZZ1LLMn0',
      authDomain: 'arundhati-engage.firebaseapp.com',
      projectId: 'arundhati-engage',
      storageBucket: 'arundhati-engage.appspot.com',
      messagingSenderId: '142204044501',
      appId: '1:142204044501:web:de010da96a956b8b6b4e5c',
      measurementId: 'G-EBHP1JMRK7',
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth()
  export const db = firebase.firestore()