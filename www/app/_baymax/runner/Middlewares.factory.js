(function () {
	angular
	.module('app.baymax')
	.factory('Middlewares', MiddlewaresFactory);

	function MiddlewaresFactory () {

		var middlewares = {};

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
				console.error('Middleware stage doesn\'t exist');
			}
		}

		return {
			registerMiddleware : registerMiddleware,
			runStage : runStage
		};
	}

})();
