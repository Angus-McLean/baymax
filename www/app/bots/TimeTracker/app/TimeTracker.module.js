(function () {
	angular.module('bots.TimeTracker', [
		'app.data',
		'ionic'
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
					templateUrl: 'app/bots/TimeTracker/app/views/main.view.html',
					controller: 'TimeTracker.mainCtrl',
					controllerAs: 'vm'
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
