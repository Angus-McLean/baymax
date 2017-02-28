(function () {
	angular.module('bots.TimeTracker', [
		'app.data',
		'ionic',
		'ionic.contrib.drawer.vertical',
		'angular-timeline',
		'angular.chips'
	])
		.run(bootstrap)
		.config(configRoutes)

	configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
	bootstrap.$inject = ['$http','Baymax', 'TimeTracker', 'TimeTrackerConfig'];

	function configRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app.TimeTracker', {
			url : '/TimeTracker',
			views: {
				'mainContent': {
					templateUrl: 'app/bots/TimeTracker/app/views/main_plain.view.html',
					controller: 'TimeTracker.mainCtrl',
					controllerAs: 'vm'
				},
				'rightMenu': {
					templateUrl: 'app/bots/TimeTracker/app/views/rightMenu.view.html'
				}
			}
		});
	}

	function bootstrap($http, Baymax, TimeTracker, TimeTrackerConfig) {

		var botData = TimeTrackerConfig;

		Baymax.registerModule(botData);

		// registerMiddleware
		Baymax.registerMiddleware('_Process', function (baymaxReqObj, next) {
			if(baymaxReqObj.destinationModule === 'TimeTracker') {
				TimeTracker.process(baymaxReqObj)
					.then(()=>next());
			} else {
				next();
			}
		});

	}
})();
