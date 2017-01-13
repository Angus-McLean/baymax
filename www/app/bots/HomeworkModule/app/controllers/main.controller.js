(function () {
	angular.module('bots.HomeworkModule')
		.controller('mainCtrl', mainCtrl);

	mainCtrl.$inject = ['HomeworkModuleObject'];

	function mainCtrl(HomeworkModuleObject) {
		var self = this;
		self.db = HomeworkModuleObject.db;
	}
})();
