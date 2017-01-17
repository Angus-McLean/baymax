(function () {

	angular.module('app.baymax')
		.run(CommandSplitStage);

	CommandSplitStage.$inject = ['Middlewares', 'apiAIService', 'Runner'];

	function CommandSplitStage(Middlewares, apiAIService, Runner) {
		console.log('CommandSplitStage');

		// register the module
		var CommandSeperator2 = {
			"api.ai" : {
				authentication : {
					clientToken : 'a9187be4c49d4b3498ba5d991df434c4',
					developerToken : '9b75c9ff9225461e9f44c5016bf7232e',
				}
			}
		};
		apiAIService.registerModule('CommandSeperator2', CommandSeperator2);


		// register the splitting middleware
		function splitRequestStr(baymaxReqObj, next) {
			console.log('splitRequestStr', baymaxReqObj);
			// assume its already in the right form for a api.ai query
			apiAIService.sendToModule('CommandSeperator2', baymaxReqObj).then(function (splitResponse) {
				console.log('CommandSplitStage received split resp', arguments);

				// set immutables
				baymaxReqObj.setStageData('_SendSplit', JSON.parse(JSON.stringify(splitResponse)));
				baymaxReqObj.getModuleData('CommandSeperator2').response = JSON.parse(JSON.stringify(splitResponse));

				// set active index
				baymaxReqObj.getModuleData('CommandSeperator2').activeQueryIndex = 0;

				// mutate baymaxReqObj
				_.extend(baymaxReqObj, {
					isMultiple : splitResponse.result.parameters.commands.length > 1,
					queries : splitResponse.result.parameters.commands
				});
				next();
			});
		}
		Middlewares.registerMiddleware('_SendSplit', splitRequestStr);

		// Execute command split operation (assume just 2 queries for now)
		function branchMultipleRequests(baymaxReqObj, next) {
			console.log('branchMultipleRequests', baymaxReqObj);
			var modData = baymaxReqObj.getModuleData('CommandSeperator2')

			if(baymaxReqObj.isMultiple) {
				// default behaviour : increment query from queries
				baymaxReqObj.query = baymaxReqObj.queries[modData.activeQueryIndex]

				// if the next query to use is already defined use its values
				if(modData.nextOverride) {
					// reset all values in baymaxReqObj
					_.each(baymaxReqObj, (v,k,o)=> o[k] = undefined);
					_.extend(baymaxReqObj, modData.nextOverride);
				} else if (modData.nextExtend) {
					_.extend(baymaxReqObj, modData.nextExtend);
				}
			}
			next();
		}
		Middlewares.registerMiddleware('_ExecuteSplit', branchMultipleRequests);


		// execute repeat if its required
		function processNextCommand(baymaxReqObj, next) {
			var modData = baymaxReqObj.getModuleData('CommandSeperator2')

			if(baymaxReqObj.isMultiple && (modData.activeQueryIndex+1 < baymaxReqObj.queries.length)) {
				modData.activeQueryIndex++;
				Runner.startAtStage('_ExecuteSplit', baymaxReqObj);
			}
			next();
		}
		Middlewares.registerMiddleware('PostProcess', processNextCommand);

		return {};
	}

	// angular.module('app.baymax').run(['CommandSplitStage', function(){}]);
})();
