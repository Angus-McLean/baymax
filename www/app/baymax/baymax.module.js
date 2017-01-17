(function () {
  angular
    .module('app.baymax', ['utils'])
	.run(function(){
		var annoyingError = '["Uncaught SyntaxError: Unexpected identifier","",1,9,{}]';
		window.onerror = function (...args) {
			if(JSON.stringify(args) === annoyingError) {
				return true;
			}
			console.log(args);
		};
	});

})();
