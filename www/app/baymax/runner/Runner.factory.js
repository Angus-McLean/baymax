(function () {
	angular
	.module('app.baymax')
	.factory('Runner', RunnerFactory);

	RunnerFactory.$inject = ['Middlewares', 'BaymaxRequest'];

	function RunnerFactory (Middlewares, BaymaxRequest) {

		var stages = [
			'Initialize',
			'SpeechStart',
			'SpeechEnd',
			// Received Text from speech input
			'TextRecieve',
			'PreSplit',
			'_SendSplit',		// Send to command seperator
			'RecieveSplit',
			'_ExecuteSplit',		// branches split commands into seperate paths here
			'AddContext',
			'PreRouteRequest',
			'_SendModuleRouter',		// send request to module router
			'Routed',
			'PreFlightToModule',
			'_SendToAgent',
			'PreProcess',
			'_Process',			// send apiai response object to requested root module
			'PostProcess',
			'Finalize'
		];

		function startAtStage(startStage, reqObj, cb) {
			var baymaxReq = new BaymaxRequest(reqObj);
			var runStageFunctions = stages.slice(stages.indexOf(startStage)).map(function (curStage) {
				return function (asyncCb) {
					// this function is called on each of the stages defined in the list
					baymaxReq.emit('stages.'+curStage+'.start');
					Middlewares.runStage(curStage, baymaxReq, function (err, ...res) {
						if(err) {
							console.error(curStage, err);
							asyncCb(err);
						} else {
							// this is called when this middleware stage is done.
							baymaxReq.emit('stages.'+curStage+'.end');
							asyncCb();
						}
					});
				}
			});
			runStageFunctions.unshift((a)=>a(null, baymaxReq));

			// run all stages in order
			async.series(runStageFunctions, function (err, res) {
				// do some crash reporting
				if(err) {
					console.error(err);
				}
				if(cb) cb(err, res);
			});
			return baymaxReq;
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
	angular.module('app.baymax').run(['Runner', function(){}]);

})();
