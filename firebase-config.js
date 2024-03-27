var firebaseConfig = {
    apiKey: "AIzaSyA91NQ3PIkgY_Ihj1dAgEzQLKTFnQmuZVI",
    authDomain: "reservquent.firebaseapp.com",
    databaseURL: "https://reservquent-default-rtdb.firebaseio.com",
    projectId: "reservquent",
    storageBucket: "reservquent.appspot.com",
    messagingSenderId: "135119553812",
    appId: "1:135119553812:web:7cab36e09b044587382e01"
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }