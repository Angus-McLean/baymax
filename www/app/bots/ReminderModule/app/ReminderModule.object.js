(function () {

	angular.module('bots.ReminderModule')
		.factory('ReminderModuleObject', ReminderModuleObjectFactory);

		ReminderModuleObjectFactory.$inject = ['ModuleDataStore', 'FirebaseDocument', '$firebaseArray'];

	function ReminderModuleObjectFactory (ModuleDataStore, FirebaseDocument, $firebaseArray) {


		//TODO extend RecordModuleObject
		class ReminderModuleObject extends FirebaseDocument {
			constructor(firebaseObject) {
				super(firebaseObject);

				this.editableFields = ['text', 'time', 'date', 'time-period', 'date-period', 'date-time'];
			}
		}

		ReminderModuleObject.create = function (objParams) {
			var defaults = {
				type : 'ReminderModuleObject'
			};
			_.defaults(objParams, defaults);

			return FirebaseDocument.create(objParams);
		}

		ReminderModuleObject.events = new EventEmitter();

		var db = ModuleDataStore.bootstrapModule('ReminderModuleObject', ['RecordModuleObject'], {
			$$added: function(snap, prevChild) {
				var record = $firebaseArray.prototype.$$added.call(this, snap);
				var rec = new ReminderModuleObject(record);

				return record;
			}
		});
		ReminderModuleObject.db = db;

		return ReminderModuleObject;
	}

})();
