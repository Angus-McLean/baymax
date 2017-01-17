(function () {
  angular
    .module('app.baymax')
    .service('ContextStack', ContextStack)

    ContextStack.$inject = ['$q'];

    function ContextStack ($q) {
        const _self = this;

        _self.stack = [];

    }

    ContextStack.prototype.newItem = function() {
      let a = {};
      this.stack.unshift(a);
      return a;
    };

    ContextStack.prototype.addContext = function (moduleName, contextObj) {
      let stackItem = this.stack[0];
      (stackItem.modules = stackItem.modules || []).push(moduleName)
      stackItem[moduleName] = contextObj;
    };

    ContextStack.prototype.getModuleStack = function (moduleName) {
      return _.filter(this.stack, (a)=>(a&&a[moduleName]));
    };

    ContextStack.prototype.getModuleContext = function (moduleName) {
      return _.find(this.stack, (a)=>(a&&a[moduleName]))[moduleName];
    };

})()
