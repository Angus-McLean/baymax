(function () {
	angular.module('bots.TimeTracker')
		.constant('TimeTrackerConfig',
			{
				"name" : "TimeTracker",
				"api.ai" : {
					"authentication" : {
						"clientToken" : "aea4699a14b4481a9e230d2d9d76e628",
						"developerToken" : "0e359095d1b8435d9e779733e33eb00a"
					}
				},
				"app" : {
					"directive_name" : "time-tracker",
					"object_name" : "TimeTrackerObject"
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
