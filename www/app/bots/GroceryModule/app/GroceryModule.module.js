(function () {
	angular.module('bots.GroceryModule', [
		'app.data',
		'ionic'
	])
		.run(bootstrap)
		.config(configRoutes)

	configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
	bootstrap.$inject = ['$http','Baymax', 'GroceryModule', 'GroceryModuleConfig'];

	function configRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app.GroceryModule', {
			url : '/GroceryModule',
			views: {
				'mainContent': {
					templateUrl: 'app/bots/GroceryModule/app/views/main.view.html',
					controller: 'GroceryModule.mainCtrl',
					controllerAs: 'vm'
				}
			}
		});
	}

	function bootstrap($http, Baymax, GroceryModule, GroceryModuleConfig) {

		var botData = GroceryModuleConfig;

		Baymax.registerModule(botData);

		// registerMiddleware
		Baymax.registerMiddleware('_Process', function (baymaxReqObj, next) {
			if(baymaxReqObj.destinationModule === 'GroceryModule') {
				GroceryModule.process(baymaxReqObj)
					.then(()=>next());
			} else {
				next();
			}
		});

	}
})();
