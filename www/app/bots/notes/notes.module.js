(function () {
  angular.module('notes', ['app.data'])
    .factory('NotesModuleHandler', NotesModuleHandler);

    NotesModuleHandler.$inject = ['NotesModule'];
    function NotesModuleHandler (NotesModule) {
      return function (request, result, stack, next) {
        console.log('NotesModules is handing..', arguments);
        // recieve incoming parsed requests
        NotesModule.actions[result.result.action](request, result, stack, next);
      };
    }

})()
