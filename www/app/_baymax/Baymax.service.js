(function () {
  angular
    .module('app.baymax')
	.factory('Baymax', BaymaxService);

	BaymaxService.$inject = ['Runner', 'Middlewares', 'apiAIService'];

	function BaymaxService(Runner, Middlewares, apiAIService) {
		var self = {
			modules : {}
		};

		return {
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
	}
})();
