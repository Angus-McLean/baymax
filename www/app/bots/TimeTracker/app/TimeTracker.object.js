(function () {

	angular.module('bots.TimeTracker')
		.factory('TimeTrackerObject', TimeTrackerObjectFactory);

		TimeTrackerObjectFactory.$inject = ['ModuleDataStore', 'FirebaseDocument', '$firebaseArray', '$interval'];

	function TimeTrackerObjectFactory (ModuleDataStore, FirebaseDocument, $firebaseArray, $interval) {

		var [sec,min,hour,day] = [1000, 1000*60, 1000*60*60, 1000*60*60*60*24];

		//TODO extend RecordModuleObject
		class TimeTrackerObject extends FirebaseDocument {
			constructor(firebaseObject) {
				super(firebaseObject);
				var self = this;
				this.editableFields = ['text', 'tags', 'startTime', 'endTime'];
			}

			updateEllapsed() {
				var startDate = this.$ephim().startDate || new Date(this.getDoc().startTime);
				var endDate;
				if(this.getDoc().endTime) {
					endDate = this.$ephim().endDate || new Date(this.getDoc().endTime);
				} else {
					endDate = new Date();
				}

				this.$ephim().startDate = startDate;
				this.$ephim().endDate = endDate;
				var dif = endDate - startDate;
				this.$ephim().ellapsed = {
					h : Math.floor(dif%day / hour),
					m : Math.floor(dif%hour / min),
					s : Math.floor(dif%min / sec)
				};
			}

			toText(params) {
				var speech = this.getDoc().text;
				return speech;
			}

			stop() {
				this.getDoc().endTime = Date.now();
				return this.update();
			}

			startDuplicate() {
				var duplicateDoc = _.cloneDeep(this.getDoc());
				duplicateDoc.endTime = undefined;

				return TimeTrackerObject.create(duplicateDoc);
			}
		}

		TimeTrackerObject.create = function (objParams) {
			var defaults = {
				type : 'TimeTrackerObject',
				tags : []
			};
			_.defaults(objParams, defaults);

			objParams.tags.push('tracking');

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
