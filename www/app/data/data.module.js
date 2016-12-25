(function (context) {
  var config = {
    apiKey: "AIzaSyCL-mBcaSr-uk2wdcj3cSC9uIZ1bwPvsKY",
    authDomain: "baymax-d1cba.firebaseapp.com",
    databaseURL: "https://baymax-d1cba.firebaseio.com",
    storageBucket: "baymax-d1cba.appspot.com",
    messagingSenderId: "613222814762"
  };

  firebase.initializeApp(config);

  angular
    .module('app.data', [
      'firebase'
    ])


})(window)
