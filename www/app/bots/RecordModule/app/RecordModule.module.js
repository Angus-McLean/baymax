(function () {
	angular.module('bots.RecordModule', ['app.data'])
		.run(RecordModuleRun);

	RecordModuleRun.$inject = ['$http','apiAIService', 'HomeworkModuleConfig'];

	function RecordModuleRun($http, apiAIService, HomeworkModuleConfig) {

		apiAIService.registerModule('RecordModule', HomeworkModuleConfig);

	}
})();
