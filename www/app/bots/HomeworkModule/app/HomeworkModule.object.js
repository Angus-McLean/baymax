(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModuleObject', HomeworkModuleObjectFactory);

	HomeworkModuleObjectFactory.$inject = ['FirebaseFactory'];

	function HomeworkModuleObjectFactory (FirebaseFactory) {

		var db = FirebaseFactory.bootstrapModule('HomeworkModuleObject', ['RecordModuleObject']);

		//TODO extend RecordModuleObject
		class HomeworkModuleObject extends FirebaseFactory.FirebaseDocument {
			constructor(doc) {
				super('HomeworkModuleObject', doc)
			}

			toJson(properties=[], replacer, space=4) {
				return JSON.stringify(_.pick(this, properties), replacer, space);
			}

			parseFromJson () {
				let parsedObj = null;
				try {
					parsedObj = JSON.parse(jsonText);
					_.extend(this, parsedObj);
				} catch (e) {
					console.error(e);
					try {
						parsedObj = angular.fromJson(jsonText);
						_.extend(this, parsedObj);

					} catch (e2) {
						console.error(e2);
						this.toJson();
					}
				}
			};
		}

		HomeworkModuleObject.records = [];
		HomeworkModuleObject.events = new EventEmitter();

		// keep records and db.docs synced
		db.on('child_added', function(doc) {
			let newRec = new HomeworkModuleObject(doc)
			HomeworkModuleObject.records.push(newRec);
			HomeworkModuleObject.events.emit('child_added', newRec);
		});
		db.on('child_removed', function(doc) {
			_.remove(HomeworkModuleObject.records, {$id : doc.$id});
			HomeworkModuleObject.events.emit('child_removed', newRec);
		});
		db.on('child_changed', function(doc) {
			_.assign(_.find(HomeworkModuleObject.records, {$id : doc.$id}), doc);
			HomeworkModuleObject.events.emit('child_changed', doc);
		});

		HomeworkModuleObject.db = db;

		return HomeworkModuleObject;
	}

})();
