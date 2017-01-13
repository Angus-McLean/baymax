(function () {
	angular.module('bots.RecordModule', ['app.data'])
		.run(RecordModuleRun);

	RecordModuleRun.$inject = ['$http','apiAIService'];

	function RecordModuleRun($http, apiAIService) {
		$http.get('/app/bots/RecordModule/bot.json').then(function (resp) {
			apiAIService.registerModule('RecordModule', resp.data);
		});
	}
})();
