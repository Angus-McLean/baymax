(function () {

	angular.module('bots.TimeTracker')
		.factory('TimeTrackerObject', TimeTrackerObjectFactory);

		TimeTrackerObjectFactory.$inject = ['ModuleDataStore', 'FirebaseDocument', '$firebaseArray'];

	function TimeTrackerObjectFactory (ModuleDataStore, FirebaseDocument, $firebaseArray) {


		//TODO extend RecordModuleObject
		class TimeTrackerObject extends FirebaseDocument {
			constructor(firebaseObject) {
				super(firebaseObject);

				this.editableFields = ['text', 'time', 'date', 'time-period', 'date-period', 'date-time'];
			}
		}

		TimeTrackerObject.create = function (objParams) {
			var defaults = {
				type : 'TimeTrackerObject'
			};
			_.defaults(objParams, defaults);

			return FirebaseDocument.create(objParams);
		}

		TimeTrackerObject.events = new EventEmitter();

		var db = ModuleDataStore.bootstrapModule('TimeTrackerObject', ['RecordModuleObject'], {
			$$added: function(snap, prevChild) {
				var record = $firebaseArray.prototype.$$added.call(this, snap);
				var rec = new TimeTrackerObject(record);

				return record;
			}
		});
		TimeTrackerObject.db = db;

		return TimeTrackerObject;
	}

})();
