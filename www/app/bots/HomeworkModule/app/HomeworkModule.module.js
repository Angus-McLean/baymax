(function () {
	angular.module('bots.HomeworkModule', [
		'app.data',
		'ionic'
	])
		.run(bootstrap)
		.config(configRoutes)

	configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
	bootstrap.$inject = ['$http','Baymax', 'HomeworkModule', 'HomeworkModuleConfig'];

	function configRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app.HomeworkModule', {
			url : '/HomeworkModule',
			views: {
				'mainContent': {
					templateUrl: 'app/bots/HomeworkModule/app/views/main.view.html',
					controller: 'HomeworkModule.mainCtrl',
					controllerAs: 'vm'
				}
			}
		});
	}

	function bootstrap($http, Baymax, HomeworkModule, HomeworkModuleConfig) {

		var botData = HomeworkModuleConfig;

		Baymax.registerModule(botData);

		// registerMiddleware
		Baymax.registerMiddleware('_Process', function (baymaxReqObj, next) {
			if(baymaxReqObj.destinationModule === 'HomeworkModule') {
				HomeworkModule.process(baymaxReqObj)
					.then(()=>next());
			} else {
				next();
			}
		});

	}
})();
