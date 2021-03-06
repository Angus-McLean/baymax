(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModule', HomeworkModuleFactory);

	HomeworkModuleFactory.$inject = ['$q', 'Baymax', 'HomeworkModuleObject'];

	function HomeworkModuleFactory($q, Baymax, HomeworkModuleObject) {

		var db = HomeworkModuleObject.db;

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.intentName === 'Default Fallback Intent') {
				deferred.reject({
					message : 'Got Default Fallback'
				});
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'HomeworkModule.create') {
					var homeworkObjectProm = HomeworkModuleObject.create(baymaxReqObj.result.parameters);
					homeworkObjectProm.then(function (firebaseObject) {

						var homeworkObject = HomeworkModuleObject.db.records.$getRecord(firebaseObject.$id);
						Baymax.context.setGlobalContext(homeworkObject);
						deferred.resolve(homeworkObject);
					})
				} else {
					deferred.reject({
						message : 'Got Unmatched Action'
					});
				}
			}
			return deferred.promise;
		}

		return {
			db : db,
			process : process
		};
	}
})();
