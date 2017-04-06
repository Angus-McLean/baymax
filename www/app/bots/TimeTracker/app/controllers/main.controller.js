(function () {
	angular.module('bots.TimeTracker')
		.controller('TimeTracker.mainCtrl', mainCtrl);

	mainCtrl.$inject = ['TimeTrackerObject', '$interval'];

	function mainCtrl(TimeTrackerObject, $interval) {
		var self = this;
		self.ephim = new WeakMap();
		self.db = TimeTrackerObject.db;
		self.records = TimeTrackerObject.records;
		window.TimeTrackerObject = TimeTrackerObject;
		self.getEphim = function (ref) {
			if(!self.ephim.get(ref)) {
				self.ephim.set(ref, {});
			}
			return self.ephim.get(ref);
		};

		self.db.records.$watch(function (ev) {
			let record = self.db.records.$getRecord(ev.key);
			if(ev.event === 'child_added') {
				self.ephim.set(record, {});
			}

			var intervalProm = $interval(function () {
				if(record) {
					record.$class().updateEllapsed.bind(record.$class()), 1000
				} else {
					$interval.cancel(intervalProm);
				}
			});

		});

		self.toggleEdit = function (record) {
			if(self.getEphim(record).isEditing) {
				record.$ephim().classObject.updateFromJson(self.getEphim(record).rawJson);
			}
			self.getEphim(record).rawJson = record.$class().toJson();
			self.getEphim(record).isEditing = !self.getEphim(record).isEditing;
		};

		self.delete = function (modObj) {
			modObj.$ephim().classObject.destroy();
		};

		self.actions = [{
			label : 'Stop',
			click : 'moduleObject.$class().stop()'
		}];
	}
})();
