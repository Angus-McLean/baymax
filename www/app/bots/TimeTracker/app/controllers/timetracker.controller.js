(function () {
	angular.module('bots.TimeTracker')
		.controller('TimeTracker.objectCtrl', mainCtrl);

	mainCtrl.$inject = ['TimeTrackerObject', '$interval', '$scope'];

	function mainCtrl(TimeTrackerObject, $interval, $scope) {

		$scope.moduleObject.$ephim().updateInterval = $interval(function () {
			$scope.moduleObject.$class().updateEllapsed();
		}, 1000);

		self.toggleEdit = function (record) {
			if(self.getEphim(record).isEditing) {
				record.$ephim().classObject.updateFromJson(self.getEphim(record).rawJson);
			}
			self.getEphim(record).rawJson = record.$class().toJson();
			self.getEphim(record).isEditing = !self.getEphim(record).isEditing;
		};

		self.delete = function (modObj) {
			modObj.$class().destroy();
		};

		self.actions = [{
			label : 'Stop',
			click : 'moduleObject.$class().stop()'
		}];
	}
})();
