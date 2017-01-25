(function () {
	angular.module('bots.TimeTracker')
		.constant('TimeTrackerConfig',
			{
				"name" : "TimeTracker",
				"api.ai" : {
					"authentication" : {
						"clientToken" : "98347ed543334713bb73bbc6badbecff",
						"developerToken" : "bcb3f332d4fe43c7950bbc7f8fd6420d"
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
