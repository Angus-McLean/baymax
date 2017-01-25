(function () {

	angular.module('bots.GroceryModule')
		.factory('GroceryModule', GroceryModuleFactory);

	GroceryModuleFactory.$inject = ['$q', 'Baymax', 'GroceryModuleObject'];

	function GroceryModuleFactory($q, Baymax, GroceryModuleObject) {

		var db = GroceryModuleObject.db;

		function process(baymaxReqObj) {
			var deferred = $q.defer();
			if(baymaxReqObj.result.intentName === 'Default Fallback Intent') {
				deferred.reject({
					message : 'Got Default Fallback'
				});
			} else {
				var action = baymaxReqObj.result.action;
				if(action === 'GroceryModule.create') {
					var homeworkObjectProm = GroceryModuleObject.create(baymaxReqObj.result.parameters);
					homeworkObjectProm.then(function (firebaseObject) {

						var homeworkObject = GroceryModuleObject.db.records.$getRecord(firebaseObject.$id);
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
