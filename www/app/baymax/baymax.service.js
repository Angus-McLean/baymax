(function () {
  angular
    .module('app.baymax')
    .service('Baymax', BaymaxService)

    BaymaxService.$inject = ['$q', 'Recognition', 'apiAIService', 'Middlewares'];

    function BaymaxService ($q, Recognition, apiAIService, Middlewares) {
      var _self = this;

      // initialize speech Baymax plugin
      Recognition.initialize();

      // attach to event listeners
      Recognition.on('result', function (event) {
        console.log('Received Recognition Event', event);
        Middlewares.run(event.results[0][0].transcript, {}, []);
      });

      // wrap events with $q

      return {
        speechAssist : function () {
          // start speech recognition segment
          Recognition.start();

          return Recognition;
        },
        textAssist : function () {
          // start speech recognition segment
          Middlewares.run('make a note to walk the dog later', {}, []);
        },
        speechStop : function () {

        }
      };
    }

})()
