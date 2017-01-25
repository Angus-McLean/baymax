(function () {

	angular.module('bots.GroceryModule')
		.factory('GroceryModuleObject', GroceryModuleObjectFactory);

		GroceryModuleObjectFactory.$inject = ['ModuleDataStore', 'FirebaseDocument', '$firebaseArray'];

	function GroceryModuleObjectFactory (ModuleDataStore, FirebaseDocument, $firebaseArray) {


		//TODO extend RecordModuleObject
		class GroceryModuleObject extends FirebaseDocument {
			constructor(firebaseObject) {
				super(firebaseObject);

				this.editableFields = ['text', 'time', 'date', 'time-period', 'date-period', 'date-time'];
			}
		}

		GroceryModuleObject.create = function (objParams) {
			var defaults = {
				type : 'GroceryModuleObject'
			};
			_.defaults(objParams, defaults);

			return FirebaseDocument.create(objParams);
		}

		GroceryModuleObject.events = new EventEmitter();

		var db = ModuleDataStore.bootstrapModule('GroceryModuleObject', ['RecordModuleObject'], {
			$$added: function(snap, prevChild) {
				var record = $firebaseArray.prototype.$$added.call(this, snap);
				var rec = new GroceryModuleObject(record);

				return record;
			}
		});
		GroceryModuleObject.db = db;

		return GroceryModuleObject;
	}

})();
