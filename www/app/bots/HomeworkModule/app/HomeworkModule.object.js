(function () {

	angular.module('bots.HomeworkModule')
		.factory('HomeworkModuleObject', HomeworkModuleObjectFactory);

	HomeworkModuleObjectFactory.$inject = ['$firebaseObject', '$firebaseArray'];

	function HomeworkModuleObjectFactory ($firebaseObject, $firebaseArray) {

	}

})()
