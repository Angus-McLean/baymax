(function () {
	angular
	.module('app.baymax')
	.factory('Middlewares', MiddlewaresFactory);

	function MiddlewaresFactory () {

		var middlewares = {};
		var nullMiddleware = (new Ware()).use(function() {
			setTimeout(_.last(arguments),0);
		});

		function registerMiddleware(stageName, fn) {
			if(!middlewares[stageName]) {
				middlewares[stageName] = new Ware();
			}
			middlewares[stageName].use(fn);
		}

		function runStage(stageName, ...params) {
			if(middlewares[stageName]) {
				return middlewares[stageName].run(...params);
			} else {
				return nullMiddleware.run(...params);
			}
		}

		return {
			registerMiddleware : registerMiddleware,
			runStage : runStage
		};
	}

})();
