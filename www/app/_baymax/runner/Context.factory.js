(function () {

	angular.module('app.baymax')
		.factory('Context', ContextFactory)
		.run(AddContextMiddleware);

	AddContextMiddleware.$inject = ['Middlewares', 'Runner', 'Context'];

	function AddContextMiddleware(Middlewares, Runner, Context) {
		// register the routing middleware
		function addContextStage(baymaxReqObj, next) {
			if(Context.global.name) baymaxReqObj.context = _.cloneDeep(Context.global);
			next();
		}
		Middlewares.registerMiddleware('AddContext', addContextStage);
	}

	ContextFactory.$inject = [];

	function ContextFactory() {

		var GlobalContext = {};

		var resetTimerVar = null;

		var defaultContextParams = {
			lifetime : 10000
		};

		function resetGlobalContext() {
			GlobalContext = {};
		}

		// {name, children, lifetime}
		function setGlobalContext (contextObj) {
			var newContext = _.extend(defaultContextParams, contextObj);

			if(newContext.lifetime) {
				clearTimeout(resetTimerVar);
				resetTimerVar = setTimeout(resetGlobalContext, newContext.lifetime);
			}

			GlobalContext = newContext;
		}

		return {
			global : GlobalContext,
			resetGlobalContext,
			setGlobalContext
		};
	}

})();
