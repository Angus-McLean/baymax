
(function () {
  angular.module('app.baymax')
    .controller('stackCtrl', StackCtrl);

  StackCtrl.$inject = ['$scope', 'ContextStack'];

  function StackCtrl($scope, ContextStack) {
    var _self = this;
    _self.map = new WeakMap();
    _self.stack = ContextStack.stack;

    console.log('stackCtrl', this);
  }

})(this);
