(function () {
	angular
	.module('app.baymax')
	.factory('Runner', RunnerFactory);

	RunnerFactory.$inject = ['Middlewares'];

	function RunnerFactory (Middlewares) {

		var stages = [
			'Initialize',
			'SpeechStart',
			'SpeechEnd',
			'TextRecieve',
			'PreFlight',
			'Receive',
			'Route',
			'Process',
			'PostProcess',
			'Finalize'
		];

		function startAtStage(startStage, ...params, cb) {
			var runStageFunctions = stages.slice(stages.indexOf(startStage)).map(function (curStage) {
				return Middlewares.runStage.bind(Middlewares, curStage, ...params);
			});
			async.waterfall(runStageFunctions, cb);
		}

		function addStage(stageName, previousStage) {
			if(stages.contains(previousStage)){
				stages.splice(stages.indexOf(previousStage), 0, stageName);
			}
		}

		return {
			startAtStage : startAtStage,
			addStage : addStage
		};
	}

})();
