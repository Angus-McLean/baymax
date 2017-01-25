(function () {

	angular.module('bots.TimeTracker')
		.factory('TimeTracker', TimeTrackerFactory);

	TimeTrackerFactory.$inject = ['$q', 'Baymax', 'TimeTrackerObject'];

	function TimeTrackerFactory($q, Baymax, TimeTrackerObject) {

		var db = TimeTrackerObject.db;

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.intentName === 'Default Fallback Intent') {
				deferred.reject({
					message : 'Got Default Fallback'
				});
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'TimeTracker.create') {
					var homeworkObjectProm = TimeTrackerObject.create(baymaxReqObj.result.parameters);
					homeworkObjectProm.then(function (firebaseObject) {

						var homeworkObject = TimeTrackerObject.db.records.$getRecord(firebaseObject.$id);
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
