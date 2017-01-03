
(function () {
  angular.module('app.bots')
    .controller('notes', NotesCtrl);

  NotesCtrl.$inject = ['NotesModule', '$scope'];

  function NotesCtrl(NotesModule, $scope) {
    var _self = this;
    _self.map = new WeakMap();
    _self.notes = [];
    NotesModule.notes.$loaded(function () {
      _self.map = new WeakMap(_.map(NotesModule.notes, (a)=>[a,{}]));
      _self.notes = NotesModule.notes;
    });

    NotesModule.notes.$watch(function(event) {
      if(event.event === 'child_added') {
        let a = NotesModule.notes.$getRecord(event.key);
        if(!_self.map.has(a)) {
          _self.map.set(a, {});
        }
      }
    });

    _self.delete = NotesModule.deleteNote;

    _self.toggleEdit = function (noteObj) {
      if(_self.map.get(noteObj).isEditing) {
        NotesModule.saveNote(_.omit(noteObj,'_'));
      }
      _self.map.get(noteObj).isEditing = !_self.map.get(noteObj).isEditing;
    }

  }

})(this);
