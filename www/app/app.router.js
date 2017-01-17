

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
      views: {
        'mainContent': {
          templateUrl: 'app/baymax/stack/stack.view.html',
          controller: 'stackCtrl',
          controllerAs: 'vm'
        }
      }
    })
    .state('app.note_module', {
      url: '/notes',
      views: {
        'mainContent': {
          templateUrl: 'app/bots/notes/index.view.html',
          controller: 'notes',
          controllerAs: 'vm'
        }
      }
    })

    $urlRouterProvider.otherwise('/app/bots');
}
