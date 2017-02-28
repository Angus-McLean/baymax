(function () {
	angular.module('bots.TimeTracker')
		.directive('timeTracker', TimeTrackerObjectDirective);

	TimeTrackerObjectDirective.$inject = [];

	function TimeTrackerObjectDirective() {
		return {
			restrict : 'EA',
			templateUrl : 'app/bots/TimeTracker/app/views/Tracker.partial.html',
			controller : 'TimeTracker.objectCtrl',
			scope : true
		};
	}
})();
