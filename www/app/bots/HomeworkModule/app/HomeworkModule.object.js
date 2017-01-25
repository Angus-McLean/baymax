(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModuleObject', HomeworkModuleObjectFactory);

		HomeworkModuleObjectFactory.$inject = ['ModuleDataStore', 'FirebaseDocument', '$firebaseArray'];

	function HomeworkModuleObjectFactory (ModuleDataStore, FirebaseDocument, $firebaseArray) {


		//TODO extend RecordModuleObject
		class HomeworkModuleObject extends FirebaseDocument {
			constructor(firebaseObject) {
				super(firebaseObject);

				this.editableFields = ['class', 'due_date', 'homework_type'];
			}
		}

		HomeworkModuleObject.create = function (objParams) {
			var defaults = {
				type : 'HomeworkModuleObject'
			};
			_.defaults(objParams, defaults);

			return FirebaseDocument.create(objParams);
		}

		HomeworkModuleObject.events = new EventEmitter();

		var db = ModuleDataStore.bootstrapModule('HomeworkModuleObject', ['RecordModuleObject'], {
			$$added: function(snap, prevChild) {
				var record = $firebaseArray.prototype.$$added.call(this, snap);
				var rec = new HomeworkModuleObject(record);

				return record;
			}
		});
		HomeworkModuleObject.db = db;

		return HomeworkModuleObject;
	}

})();
