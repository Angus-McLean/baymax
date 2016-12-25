(function () {
  angular.module('notes', ['app.data'])
    .service('NotesModule', NoteModuleFactory)
    .factory('NotesModuleHandler', NotesModuleHandler);

    NotesModuleHandler.$inject = ['NotesModule'];
    function NotesModuleHandler (NotesModule) {
      return function (request, result, stack, next) {
        console.log('NotesModules is handing..', arguments);
        // recieve incoming parsed requests
        NotesModule.actions[result.result.action](request, result, stack, next);
      };
    }

    NoteModuleFactory.$inject = ['$firebaseObject', '$firebaseArray'];
    function NoteModuleFactory($firebaseObject, $firebaseArray) {
      var _self = this;

      _self.ref = firebase.database().ref().child("modules").child('notes');
      _self.notes = $firebaseArray(_self.ref);

      _self.actions = {
        'notes.save' : function (req, res, stack, next) {
          console.log('notes.save');

          let newNote = {
            module : this,
            doc : {
              title : res.result.parameters.title || '',
              text : res.result.parameters.text || '',
              tag : res.result.parameters.tag || ''
            }
          };

          let noteDoc = _self.ref.push();
          noteDoc.set(newNote.doc);
          stack.push(newNote);
        },
        'notes.get' : function (req, res, stack, next) {
          console.log('getting your note');

          return next(req, stack)
        },
        'notes.add' : function (req, res, stack, next) {
          console.log('notes.add');

          return next(req, stack)
        },
        'notes.edit' : function (req, res, stack, next) {
          console.log('notes.edit');

          return next(req, stack)
        },
        'notes.remove' : function (req, res, stack, next) {
          console.log('deleted your note');
          stack.push(null);
          return next(req, stack)
        }
      }
    }


})()
