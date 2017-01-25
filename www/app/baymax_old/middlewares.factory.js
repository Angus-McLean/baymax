(function () {
  angular
    .module('app.baymax')
    .factory('Middlewares', MiddlewaresFactory)

    MiddlewaresFactory.$inject = ['$q', 'apiAIService', 'Bots', 'ContextStack'];

    function MiddlewaresFactory ($q, apiAIService, Bots, ContextStack) {
      // initialize speech Middlewares plugin
      var middlewares = new Ware()
      middlewares
        .use(function (req, res, stack, next) {
            console.log('first middleware', arguments);
            // add context object to front of context stack
            stack.newItem();
            next();
        })
        .use(function (req, res, stack, next) {
            apiAIService.sendDomainQuery(req).then(function (respObj) {
              console.log('received response from apiAIService', respObj);
              angular.extend(res, respObj);
              next();
            })
        })
        .use(function (req, res, stack, next) {
          // add logging info to stack
          //TODO : take this out into a different file for logging
          let logObj = {
            request : req,
            response : res
          };

          stack.addContext('logging', logObj);
          next();
        })
        .use(function (req, res, stack, next) {
          Bots.route(req, res, stack, next)
          next();
        })

      return middlewares;
    }

})()
