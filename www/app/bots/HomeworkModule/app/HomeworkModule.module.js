(function () {
	angular.module('bots.HomeworkModule', ['app.data'])
		.run(bootstrap);

	bootstrap.$inject = ['$http','Baymax', 'HomeworkModule'];

	function bootstrap($http, Baymax, HomeworkModule) {
		$http.get('/app/bots/HomeworkModule/bot.json').then(function (resp) {
			Baymax.registerModule(resp.data);
		}).then(function () {

			//
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
