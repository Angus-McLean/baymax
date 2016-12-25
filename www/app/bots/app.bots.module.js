(function () {
  angular
    // require in all bot modules
    .module('app.bots', [
      'notes'
    ])
    .constant('BOTS_DIGEST', {
      bots : {
        'notes' : {
          intent : 'NoteIntent',
          entryFunction : 'NotesModule'
        }
      }
    })
    .factory('Bots', BotsFactory)

    // inject all bot factory functions
    let botFactories = [
      'NotesModuleHandler'
    ];

    BotsFactory.$inject = botFactories;

    function BotsFactory() {
      const bots = arguments;

      return {
        route : function(req, res, stack, next) {
          // logic to route to bots here ...

          // Send request to desired BotsFactory
          bots[botFactories.indexOf('NotesModuleHandler')].apply(this, [].slice.call(arguments))
        }
      }
    }

})()
