

angular
  .module('app')
  .config(configRoutes);

configRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

function configRoutes($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      templateUrl: 'app/common/menu.view.html'
      //controller: 'AppCtrl',
      //controllerAs: 'vm'
    })
    .state('app.bots', {
      url: '/bots',
      abstract: true,
      views: {
        'menuContent': {
          templateUrl: 'app/bots/start.view.html'
          //controller: 'surveysCtrl',
          //controllerAs: 'vm'
        }
      }
    })
    .state('app.note_module', {
      url: '/notes',
      views: {
        'menuContent': {
          templateUrl: 'app/bots/notes/index.view.html',
          controller: 'notes',
          controllerAs: 'vm'
        }
      }
    })

    $urlRouterProvider.otherwise('/app');
}
