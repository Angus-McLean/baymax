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

	ContextFactory.$inject = ['$timeout', ];

	function ContextFactory($timeout) {

		var Context = {
			global : {},
			stack : [],
			setGlobalContext,
			resetGlobalContext,
			removeContext
		};

		var metaStore = new WeakMap().set(Context.global, {});

		var resetTimerVar = null;

		var defaultContextParams = {
			lifetime : 10000
		};

		function resetGlobalContext() {
			setGlobalContext({}, {lifetime:null});
		}

		// {name, children, lifetime}
		function setGlobalContext (contextObj, config) {
			var contextParams = {};
			_.extend(contextParams, defaultContextParams, config);

			if(contextParams.lifetime) {
				$timeout.cancel(resetTimerVar);
				resetTimerVar = $timeout(resetGlobalContext, contextParams.lifetime);
			}

			if(Context.global.doc && Context.global.doc.type) {
				Context.stack.unshift(Context.global);
			}
			Context.global = contextObj;
		}

		function removeContext(obj) {
			if(Context.stack.indexOf(obj) > -1) {
				Context.stack.splice(Context.stack.indexOf(obj), 1);
			}
			if(_.isEqual(obj, Context.global)) {
				Context.global = {}
				resetGlobalContext();
			}
		}

		return Context;

	}

})();
