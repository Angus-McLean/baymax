(function () {
	angular.module('bots.RecordModule')
		.constant('RecordModuleConfig',
			{
				"name" : "RecordModule",
				"api.ai" : {
					"authentication" : {
						"clientToken" : "5d956c56a3574c669020efd6456945d2",
						"developerToken" : "c94ea1a6d12847b6ad2f0386c1dddaa8"
					}
				},
				"dependencies" : [
					"RecordModule"
				],
				"scripts" : {
					"install" : "./install/install.js"
				},
				"main" : "index.js"
			}
		);
})();
