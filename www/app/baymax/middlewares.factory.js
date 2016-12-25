(function () {
  angular
    .module('app.baymax')
    .factory('Middlewares', MiddlewaresFactory)

    MiddlewaresFactory.$inject = ['$q', 'apiAIService', 'Bots'];

    function MiddlewaresFactory ($q, apiAIService, Bots) {
      // initialize speech Middlewares plugin
      var middlewares = new Ware()
      middlewares
        .use(function (req, res, stack, next) {
            console.log('first middleware', arguments);
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
          Bots.route(req, res, stack, next)
          next();
        })

      return middlewares;
    }

})()
