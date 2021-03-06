(function () {
	angular.module('bots.HomeworkModule')
		.controller('HomeworkModule.mainCtrl', mainCtrl);

	mainCtrl.$inject = ['HomeworkModuleObject'];

	function mainCtrl(HomeworkModuleObject) {
		var self = this;
		self.ephim = new WeakMap();
		self.db = HomeworkModuleObject.db;
		self.records = HomeworkModuleObject.records;

		self.getEphim = function (ref) {
			if(!self.ephim.get(ref)) {
				self.ephim.set(ref, {})
			}
			return self.ephim.get(ref);
		}

		self.db.records.$watch(function (ev) {
			let record = self.db.records.$getRecord(ev.key);
			if(ev.event === 'child_added') {
				self.ephim.set(record, {});
			}
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
		}
	}
})();
