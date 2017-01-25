(function () {

	angular.module('app.baymax')
		.run(ModuleRouterFactory);

	ModuleRouterFactory.$inject = ['Middlewares', 'apiAIService', 'Runner'];

	function ModuleRouterFactory(Middlewares, apiAIService, Runner) {
		console.log('ModuleRouterFactory');

		// register the module
		var ModuleRouter = {
			"api.ai" : {
				authentication : {
					clientToken : '61e62ec167fd4b38bea09cc19c5b85ee ',
					developerToken : '89a3583d6c40441690dfe3813e08d97c'
				}
			}
		};
		apiAIService.registerModule('ModuleRouter', ModuleRouter);

		// register the routing middleware
		function routeRequestStr(baymaxReqObj, next) {
			apiAIService.sendToModule('ModuleRouter', baymaxReqObj).then(function (routeResponse) {
				console.log('ModuleRouterFactory received route resp', arguments);
				baymaxReqObj.destinationModule = routeResponse.result.metadata.intentName;
				next();
			});
		}
		Middlewares.registerMiddleware('_SendModuleRouter', routeRequestStr);

		// register the routing middleware
		function sendReqToAgent(baymaxReqObj, next) {
			console.log('sendReqToModule', baymaxReqObj);
			// assume its already in the right form for a api.ai query
			apiAIService.sendToModule(baymaxReqObj.destinationModule, baymaxReqObj).then(function (agentResponse) {
				console.log(agentResponse.result.metadata.intentName, agentResponse.result.action, agentResponse.result.parameters);

				// set immutables
				baymaxReqObj.setStageData('_SendToAgent', JSON.parse(JSON.stringify(agentResponse)));
				baymaxReqObj.getModuleData(baymaxReqObj.destinationModule).response = JSON.parse(JSON.stringify(agentResponse));

				// mutate baymaxReqObj
				baymaxReqObj.result = agentResponse.result;
				next();
			}).catch(function (e){
				console.error(e);
			})
		}
		Middlewares.registerMiddleware('_SendToAgent', sendReqToAgent);

		return {};
	}

})();
