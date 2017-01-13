(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModuleObject', HomeworkModuleObjectFactory);

	HomeworkModuleObjectFactory.$inject = ['FirebaseFactory'];

	function HomeworkModuleObjectFactory (FirebaseFactory) {

		var db = FirebaseFactory.bootstrapModule('HomeworkModuleObject', ['RecordModuleObject']);

		//TODO extend RecordModuleObject
		class HomeworkModuleObject extends FirebaseFactory.FirebaseDocument {
			constructor(doc) {
				super('HomeworkModuleObject', {doc : doc})
			}

		}

		HomeworkModuleObject.db = db;

		return HomeworkModuleObject;
	}

})();
