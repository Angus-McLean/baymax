(function () {

	angular.module('bots.TimeTracker')
		.factory('TimeTracker', TimeTrackerFactory);

	TimeTrackerFactory.$inject = ['$q', 'Baymax', 'TimeTrackerObject', 'TimeTrackerActions'];

	function TimeTrackerFactory($q, Baymax, TimeTrackerObject, TimeTrackerActions) {

		var db = TimeTrackerObject.db;

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.metadata.intentName === 'Default Fallback Intent') {
				deferred.reject({
					message : 'Got Default Fallback'
				});
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'TimeTracker.create') {
					TimeTrackerActions.create(baymaxReqObj).then(deferred.resolve.bind(deferred));
				} else if (action === 'TimeTracker.start') {
					TimeTrackerActions.start(baymaxReqObj).then(deferred.resolve.bind(deferred));
				} else if (action === 'TimeTracker.stop') {
					TimeTrackerActions.stop(baymaxReqObj.result.parameters).then(deferred.resolve.bind(deferred));
				} else if (action === 'TimeTracker.readActiveTimers') {
					TimeTrackerActions.readActiveTimers(baymaxReqObj.result.parameters);
					deferred.resolve.bind(deferred);;
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
