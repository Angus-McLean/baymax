(function () {
	angular.module('bots.HomeworkModule', [
		'app.data',
		'ionic'
	])
		.run(bootstrap)
		.config(configRoutes)

	configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
	bootstrap.$inject = ['$http','Baymax', 'HomeworkModule'];

	function configRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app.HomeworkModule', {
			url : '/HomeworkModule',
			views: {
				'mainContent': {
					templateUrl: 'app/bots/HomeworkModule/app/views/main.view.html',
					controller: 'mainCtrl',
					controllerAs: 'vm'
				}
			}
		});
	}

	function bootstrap($http, Baymax, HomeworkModule) {
		var botData = $http.get('/app/bots/HomeworkModule/bot.json').then(function (resp) {
			Baymax.registerModule(resp.data);
			return resp.data;
		});

		botData.then(function () {
			// registerMiddleware
			Baymax.registerMiddleware('_Process', function (baymaxReqObj, next) {
				if(baymaxReqObj.destinationModule === 'HomeworkModule') {
					HomeworkModule.process(baymaxReqObj)
						.then(()=>next());
				} else {
					next();
				}
			})
		})
	}
})();
