
(function () {
  angular.module('app.baymax')
    .controller('stackCtrl', StackCtrl);

  StackCtrl.$inject = ['$scope', 'Baymax'];

  function StackCtrl($scope, Baymax) {
    var _self = this;
    _self.map = new WeakMap();
	_self.context = Baymax.context;
	_self.stack = _self.context.stack;

	_self.delete = function (obj) {
		Baymax.context.removeContext(obj);
		obj.destroy();
	};
  }

})(this);
