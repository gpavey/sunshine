// App wide dependencies
var app = angular
.module( 'sunshine', [
  'templates-app',
  'templates-common',
  'sunshine.home',
  'sunshine.login',
  'sunshine.console',
  'sunshine.global_svcs',
  'sunshine.global_utils',
  'sunshine.search',
  'sunshine.agency',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'ngAnimate',
  'ui.bootstrap',
  'ui.unique',
  'cc.slide.menu',
  'paper.input',
  'checklist-model',
  'ngSanitize',
  'angular-ellipsis',
  'cgBusy',
  'ncy-angular-breadcrumb',
  'xeditable'
])

.config(function($breadcrumbProvider) {
  $breadcrumbProvider.setOptions({
    prefixStateName: 'home',
    template: 'bootstrap3'
  });
})
.config(function ($httpProvider) {
  $httpProvider.responseInterceptors.push('HttpInterceptor');

  var spinnerFunction = function spinnerFunction(data, headersGetter) {
  var search_button = angular.element(document.querySelector('.fa-search'));
     search_button.removeClass('fa-search');
     search_button.addClass('fa-spinner');
     search_button.addClass('fa-spin');

    return data;
  };

  $httpProvider.defaults.transformRequest.push(spinnerFunction);
})

.config( function ( $provide, $stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise( '/home' );
}, function(USER_ROLESProvider){} )
//Using the main application's run method to execute any code after services have been started
.run( function run ($rootScope, AUTH_EVENTS, AuthService) {

//    $rootScope.$on('$stateChangeStart', function (event, next) {
//        var authorizedRoles = next.data.authorizedRoles;
//
//        //route permits anonymous users
//        if (authorizedRoles.indexOf("anonymous") !== -1){
//            return;
//        }
//
//        // Route requires authentication and authorization check
//        if (!AuthService.isAuthorized(authorizedRoles)) {
//
//            //prevent routing
//            event.preventDefault();
//
//            if (AuthService.isAuthenticated()) {
//                // user is not allowed
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
//            } else {
//                // user is not logged in
//                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
//            }
//        }
//    });
})
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
})
.provider('UserRoles', function()  {
    var roles = {
        anon: 'anonymous',
        admin: 'admin',
        editor: 'editor',
        guest: 'guest'};
    this.$get = function() {
        return roles;
    };
})
.controller( 'AppCtrl', function AppCtrl ( $scope, $location, $rootScope, AuthService, UserRoles ) {

    $rootScope.API_URL = 'http://localhost:1971';
    $rootScope.USERS_DEPT_ID = '54331f1023fe388f037119c6';

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
          $scope.pageTitle = toState.data.pageTitle ;
        }
    });

    $scope.currentUser = null;
    $scope.userRoles = UserRoles;
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;

  };
})

;
