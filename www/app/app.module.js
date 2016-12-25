

angular
  .module('app', [
    'ionic',
    'app.core',
    'app.baymax',
    'app.bots'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.cordova) {
      const DEV_CONFIG = {
        env : 'DEV',
        SpeechRecognition : function(){},
        http : {
          requireProxy : true,
          proxyAddress : 'http://localhost:8080'
        }
      };

      const PROD_CONFIG = {
        env : 'PROD',
        SpeechRecognition : window.SpeechRecognition,
        http : {
          requireProxy : false,
          proxyAddress : ''
        }
      };

      window.BAYMAX_CONFIG = (window.cordova) ? PROD_CONFIG : DEV_CONFIG;
    }
  });
});
