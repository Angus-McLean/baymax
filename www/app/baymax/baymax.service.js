(function () {
  angular
    .module('app.baymax')
	.factory('Baymax', BaymaxService);

	BaymaxService.$inject = ['Runner', 'Middlewares', 'apiAIService', 'Context', 'Recognition'];

	function BaymaxService(Runner, Middlewares, apiAIService, Context, Recognition) {
		var self = {
			modules : {}
		};

    // initialize speech Baymax plugin
    Recognition.initialize();

    // attach to event listeners
    Recognition.on('result', function (event) {
      console.log('Received Recognition Event', event);
      Baymax.textAssist(event.results[0][0].transcript);
    });

		var Baymax = {
			registerModule : function (moduleJson) {
				self.modules[moduleJson.name] = moduleJson;
				apiAIService.registerModule(moduleJson.name, moduleJson);
			},
			registerMiddleware : Middlewares.registerMiddleware,

			speechAssist : function () {
				// start speech recognition segment
				Recognition.start();

				return Recognition;
			},
			textAssist : function (requestStr) {
				// start speech recognition segment
				Runner.startAtStage('TextRecieve', {
					query : requestStr
				});
			},
			speechStop : function () {

			}
		};

		Baymax.context = Context;

    window.Baymax = Baymax;

		return Baymax
	}
})();
