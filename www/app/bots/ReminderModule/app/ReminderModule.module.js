(function () {
	angular.module('bots.ReminderModule', [
		'app.data',
		'ionic'
	])
		.run(bootstrap)
		.config(configRoutes)

	configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
	bootstrap.$inject = ['$http','Baymax', 'ReminderModule', 'ReminderModuleConfig'];

	function configRoutes($stateProvider, $urlRouterProvider) {
		$stateProvider.state('app.ReminderModule', {
			url : '/ReminderModule',
			views: {
				'mainContent': {
					templateUrl: 'app/bots/ReminderModule/app/views/main.view.html',
					controller: 'ReminderModule.mainCtrl',
					controllerAs: 'vm'
				}
			}
		});
	}

	function bootstrap($http, Baymax, ReminderModule, ReminderModuleConfig) {

		var botData = ReminderModuleConfig;

		Baymax.registerModule(botData);

		// registerMiddleware
		Baymax.registerMiddleware('_Process', function (baymaxReqObj, next) {
			if(baymaxReqObj.destinationModule === 'ReminderModule') {
				ReminderModule.process(baymaxReqObj)
					.then(()=>next());
			} else {
				next();
			}
		});

	}
})();
