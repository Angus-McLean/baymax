(function () {

	angular.module('app.baymax')
		.factory('apiAIService', apiAIService)

	apiAIService.$inject = ['$http'];

	function apiAIService($http) {

		var modules = {};

		function registerModule(name, botJson) {
			modules[name] = botJson;
		}

		function sendToRootModules (str) {
			return sendToModule('ModuleRouter', {
				query : str,
				contexts : []
			}).then(function (resData) {
				// route to proper root module
				var rootMod = resData.result.metadata.intentName;
				if(rootMod != 'Default Fallback Intent') {
					// sends to root module
					return sendToModule(rootMod, {
						query : str,
						contexts : context
					})
				} else {
					return Promise.resolve(null);
				}
			});
		}

		function getModuleAuth(moduleName) {
			return modules[moduleName]['api.ai'].authentication;
		}

		function sendToModule (moduleName, body) {
			if(!modules[moduleName]) {
				console.error('Module isn\'t registered');
				throw {
					message : 'Module isn\'t registered'
				};
			}
			var defaultVal = {
				url : 'https://api.api.ai/v1/query',
				method : 'POST',
				headers : {
					'Content-Type' : 'application/json; charset=utf-8.',
					'Authorization' : 'Bearer ' + getModuleAuth(moduleName).developerToken
				},
				data : {
					lang : 'en',
					sessionId : Date.now().toString() + Math.random().toString().slice(8)
				}
			};

			var httpObj = {};
			_.merge(httpObj, defaultVal, {data: body});
			_.merge(httpObj, defaultVal, {data: body});

			return $http(httpObj).then(a=> a.data);
		}

		return {
			registerModule,
			sendToModule
		};
	}



})()
