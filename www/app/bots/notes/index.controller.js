
(function () {
  angular.module('app.bots')
    .controller('notes', NotesCtrl);

  NotesCtrl.$inject = ['NotesModule'];

  function NotesCtrl(NotesModule) {
    this.notes = NotesModule.notes;

  }

})(this);
