(function () {
  angular.module('notes')
    .factory('NotesModule', NoteModuleService)

    NoteModuleService.$inject = ['$firebaseObject', '$firebaseArray'];
    function NoteModuleService($firebaseObject, $firebaseArray) {
      var _self = {};

      _self.ref = firebase.database().ref().child("modules").child('notes');
      _self.notes = $firebaseArray(_self.ref);

      _self.actions = {
        'notes.save' : function (req, res, stack, next) {
          console.log('notes.save');

          let newNote = {
            doc : {
              title : res.result.parameters.title || '',
              text : res.result.parameters.text || '',
              tag : res.result.parameters.tag || '',
              dateCreated : Date.now()
            }
          };

          _self.addNote(newNote).then(stack.addContext.bind(stack, 'notes'));

        },
        'notes.get' : function (req, res, stack, next) {
          // TODO : develop fuzzy search algorithm
          var options = {
            include: ["score"],
            shouldSort: true,
            threshold: 0.3,
            location: 0,
            distance: 1000,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: _.map(Object.keys(res.result.parameters), (a)=>'doc.'+a)
          };

          var fuse = new Fuse(_self.notes, options);

          var searchQuery = _.map(res.result.parameters).join(' ')

          var result = fuse.search(searchQuery);
          stack.addContext('notes', _.map(result, (a)=>a.item));

          return next();
        },
        'notes.add' : function (req, res, stack, next) {
          let noteObj = stack.getModuleContext('notes');
          if(noteObj) {
            _.extendWith(noteObj.doc, res.result.parameters, (a,b)=>a+', '+b);
            _self.saveNote(noteObj)
              .then(stack.addContext.bind(stack, 'notes'));
            //stack.addContext('notes', noteObj);
          }
          return next();
        },
        'notes.edit' : function (req, res, stack, next) {
          let noteObj = stack.getModuleContext('notes');
          if(noteObj) {
            _.extendWith(noteObj.doc, res.result.parameters, (a,b)=>b||a);
            _self.saveNote(noteObj)
              .then(stack.addContext.bind(stack, 'notes'));
            //stack.addContext('notes', noteObj);
          }
          return next();
        },
        'notes.remove' : function (req, res, stack, next) {
          let noteObj = stack.getModuleContext('notes');
          if(noteObj) {
            _self.deleteNote(noteObj);
          }
          return next();
        }
      }

      _self.deleteNote = _self.notes.$remove

      _self.saveNote = function (obj) {
        return _self.notes.$save(obj).then(function (ref) {
          return _self.notes[_self.notes.$indexFor(ref.key)]
        });
      }

      _self.addNote = function (obj) {
        return _self.notes.$add(obj).then(function (ref) {
          return _self.notes[_self.notes.$indexFor(ref.key)]
        });
      }

      return _self;
    }


})()
