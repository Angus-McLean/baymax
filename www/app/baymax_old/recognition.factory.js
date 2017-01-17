(function () {
  angular
    .module('app.baymax')
    .factory('Recognition', RecognitionFactory)

    RecognitionFactory.$inject = ['$q', '$ionicPlatform'];

    function RecognitionFactory ($q, $ionicPlatform) {
      // initialize speech Recognition plugin
      //function noop(){};
      var _SpeechRecognition = (window.SpeechRecognition) ? new SpeechRecognition() : {loaded:false};

      $ionicPlatform.ready(function() {
        if(_SpeechRecognition.loaded === false) {
          // to test if in browser or on device
          var temp = (window.cordova)?new SpeechRecognition() : {};
          angular.extend(temp, _SpeechRecognition);
          _SpeechRecognition = temp;
          _SpeechRecognition.loaded = true;
        }
      })

      class Recognition extends window.EventEmitter {
        constructor () {
          super();
        }
      }

      Recognition.prototype.initialize = function ($scope) {
        let _self = this;
        _SpeechRecognition.onaudiostart = (...args)=>{_self.emit('audiostart', ...args)};
        _SpeechRecognition.onsoundstart = (...args)=>{_self.emit('soundstart', ...args)};
        _SpeechRecognition.onspeechstart = (...args)=>{_self.emit('speechstart', ...args)};
        _SpeechRecognition.onspeechend = (...args)=>{_self.emit('speechend', ...args)};
        _SpeechRecognition.onsoundend = (...args)=>{_self.emit('soundend', ...args)};
        _SpeechRecognition.onaudioend = (...args)=>{_self.emit('audioend', ...args)};
        _SpeechRecognition.onresult = (...args)=>{_self.emit('result', ...args)};
        _SpeechRecognition.onnomatch = (...args)=>{_self.emit('nomatch', ...args)};
        _SpeechRecognition.onerror = (...args)=>{_self.emit('error', ...args)};
        _SpeechRecognition.onstart = (...args)=>{_self.emit('start', ...args)};
        _SpeechRecognition.onend = (...args)=>{_self.emit('end', ...args)};

      };

      Recognition.prototype.start = (...args)=>{_SpeechRecognition.start(...args)};

      return new Recognition();
    }

})()
