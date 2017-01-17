(function () {
	angular.module('bots.HomeworkModule')
		.controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['HomeworkModuleObject'];

	function mainCtrl(HomeworkModuleObject) {
		var self = this;
		self.ephim = new WeakMap();
		self.db = HomeworkModuleObject.db;
		self.records = HomeworkModuleObject.records;

		HomeworkModuleObject.events.on('child_added', function (record) {
			console.log('setting');
			self.ephim.set(record, {});
			self.sendToJson(record);
		});

		self.parseFromJson = function (record) {
			let parsedObj = null
			try {
				parsedObj = JSON.parse(self.ephim.get(record).jsonText);
				_.assign(record, parsedObj);
			} catch (e) {
				console.error(e);
				try {
					parsedObj = angular.fromJson(self.ephim.get(record).jsonText);
					_.assign(record, parsedObj);
				} catch (e2) {
					console.error(e2);
					self.sendToJson(record);
				}
			}
		};

		self.sendToJson = function (record) {
			var fields = ['class', 'due_date', 'homework_type'];
			// self.ephim.get(record).jsonText = JSON.stringify(_.pick(record, fields), undefined, 4);
			self.ephim.get(record).jsonText = JSON.stringify(record, undefined, 4);
		}

		self.toggleEdit = function (record) {
			if(self.ephim.get(record).isEditing) {
				//self.parseFromJson(record)
				//record.update();
			}
			self.ephim.get(record).isEditing = !self.ephim.get(record).isEditing;
		};

		self.delete = function (modObj) {

			modObj.destroy();
		}
	}
})();
