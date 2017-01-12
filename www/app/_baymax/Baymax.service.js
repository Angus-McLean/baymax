(function () {
  angular
    .module('app.baymax');
	.factory('Baymax', BaymaxService);

	BaymaxService.$inject = [];

	function BaymaxService() {
		var self = this;

		return {

		};
	}
})();
