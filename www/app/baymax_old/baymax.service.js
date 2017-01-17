(function () {
  angular
    .module('app.baymax')
    .service('Baymax', BaymaxService)

    BaymaxService.$inject = ['$q', 'Recognition', 'apiAIService', 'Middlewares', 'ContextStack'];

    function BaymaxService ($q, Recognition, apiAIService, Middlewares, ContextStack) {
      var _self = this;

      // initialize speech Baymax plugin
      Recognition.initialize();

      // attach to event listeners
      Recognition.on('result', function (event) {
        console.log('Received Recognition Event', event);
        Middlewares.run(event.results[0][0].transcript, {}, ContextStack);
      });

      // wrap events with $q

      return {
        speechAssist : function () {
          // start speech recognition segment
          Recognition.start();

          return Recognition;
        },
        textAssist : function (requestStr) {
          // start speech recognition segment
          Middlewares.run(requestStr, {}, ContextStack);
        },
        speechStop : function () {

        }
      };
    }

})()
