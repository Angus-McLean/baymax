(function () {
  angular
    .module('app.baymax')
	.factory('Baymax', BaymaxService);

	BaymaxService.$inject = ['Runner', 'Middlewares', 'apiAIService', 'Context'];

	function BaymaxService(Runner, Middlewares, apiAIService, Context) {
		var self = {
			modules : {}
		};

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

		return Baymax
	}
})();
