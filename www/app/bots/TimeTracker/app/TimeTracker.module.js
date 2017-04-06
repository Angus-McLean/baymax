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
		// $urlRouterProvider.when('/TimeTracker', '/TimeTracker/index');
		$stateProvider
		// .state('app.TimeTracker', {
		// 	url : '/TimeTracker',
		// 	// abstract : 'app.TimeTracker.index',
		// 	// abstract : true,
		// 	// resolve : {},
		// 	template : '<ui-view/>',
		// 	// defaultChild : 'app.TimeTracker.index'
		// 	// views : {
		// 	// 	'rightMenu': {
		// 	// 		templateUrl: 'app/bots/TimeTracker/app/views/rightMenu.view.html'
		// 	// 	},
		// 	// 	'mainContent': {
		// 	// 		// templateUrl: 'app/bots/TimeTracker/app/views/default.view.html',
		// 	// 		// controller: 'TimeTracker.mainCtrl',
		// 	// 		// controllerAs: 'vm'
		// 	// 		template : '<ui-view/>'
		// 	// 	}
		// 	// }
		// })
		.state('app.TimeTracker-index', {
			url : '/TimeTracker/index',
			views: {
				'rightMenu': {
					templateUrl: 'app/bots/TimeTracker/app/views/rightMenu.view.html'
				},
				'mainContent': {
					templateUrl: 'app/bots/TimeTracker/app/views/default.view.html',
					controller: 'TimeTracker.mainCtrl',
					controllerAs: 'vm'
				}
			}
		})
		.state('app.TimeTracker-rawJson', {
			url : '/TimeTracker/rawJson',
			views: {
				'rightMenu': {
					templateUrl: 'app/bots/TimeTracker/app/views/rightMenu.view.html'
				},
				'mainContent': {
					templateUrl: 'app/bots/TimeTracker/app/views/rawJson.view.html',
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
