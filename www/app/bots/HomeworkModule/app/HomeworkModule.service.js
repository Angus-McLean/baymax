(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModule', HomeworkModuleFactory);

	HomeworkModuleFactory.$inject = ['$q', 'FirebaseFactory'];

	function HomeworkModuleFactory($q, FirebaseFactory) {

		var records = FirebaseFactory.bootstrapModule('HomeworkModule');

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.intentName === 'Default Fallback Intent') {
				console.info('HomeworkModule', 'Got Default Fallback', baymaxReqObj);
				deferred.resolve();
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'HomeworkModule.create') {
					records.add(baymaxReqObj.result.parameters).then(deferred.resolve)
				} else if (action === 'HomeworkModule.create') {

				}
			}
			return deferred.promise;
		}

		return {
			records : records,
			process : process
		};
	}
})();
