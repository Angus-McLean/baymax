(function (context) {

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
    SpeechRecognition : context.SpeechRecognition,
    http : {
      requireProxy : false,
      proxyAddress : ''
    }
  };

  (context||context).BAYMAX_CONFIG = (context.cordova) ? PROD_CONFIG : DEV_CONFIG;
})(window)
