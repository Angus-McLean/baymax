(function () {

	angular.module('bots.ReminderModule')
		.factory('ReminderModule', ReminderModuleFactory);

	ReminderModuleFactory.$inject = ['$q', 'Baymax', 'ReminderModuleObject'];

	function ReminderModuleFactory($q, Baymax, ReminderModuleObject) {

		var db = ReminderModuleObject.db;

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.intentName === 'Default Fallback Intent') {
				deferred.reject({
					message : 'Got Default Fallback'
				});
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'ReminderModule.create') {
					var homeworkObjectProm = ReminderModuleObject.create(baymaxReqObj.result.parameters);
					homeworkObjectProm.then(function (firebaseObject) {

						var homeworkObject = ReminderModuleObject.db.records.$getRecord(firebaseObject.$id);
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
