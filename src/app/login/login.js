/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'sunshine.login', [
        'ui.router'
    ])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'login', {
            url: '/login',
            views: {
                "main": {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/login.tpl.html'
                }
            },
            data:{ pageTitle: 'Login', authorizedRoles: ['anonymous'] }
        });
    })

/**
 * And of course we define a controller for our route.
 */
    .controller('LoginCtrl', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
            username: 'cindy',
            password: 'cindy'
        };

        $scope.login = function (credentials) {
             AuthService.login(credentials).then(function(){},function(){});

            function x () {
               $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
               $scope.setCurrentUser(user);
            }
            function y () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            }
        };
    })
    .factory('AuthService', function ($http, Session) {
        var authService = {};
        var uzr = {"user":{"id":"123", "role":"admin"}};
        authService.login = function (credentials) {
            return $http
                .post('http://10.250.60.109:8088/login', credentials)
                .then(function (res) {
                    Session.create(res.data.id, res.data.user, res.data.role);
                    return res.data;
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            console.log("ANGULAR IS ARRAY " + !angular.isArray(authorizedRoles));

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            console.log("IS AUTHENTICATED " + authService.isAuthenticated());
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized;'
    })
    .service('Session', function () {
       // console.log("inSession");
        this.create = function (sessionId, userId, userRole) {
            //console.log("inCreate");
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
        };
        return this;
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push([
            '$injector',
            function ($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);
    })
    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })
    .directive('loginDialog', function (AUTH_EVENTS) {
        return {
            restrict: 'A',
            template: '<div ng-if="visible" ng-include="login-form.html">',
            link: function (scope) {
                var showDialog = function () {
                    scope.visible = true;
                };

                scope.visible = false;
                scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
                scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
            }
        };
    })
    .directive('formAutofillFix', function ($timeout) {
        return function (scope, element, attrs) {
            element.prop('method', 'post');
            if (attrs.ngSubmit) {
                $timeout(function () {
                    element
                        .unbind('submit')
                        .bind('submit', function (event) {
                            event.preventDefault();
                            element
                                .find('input, textarea, select')
                                .trigger('input')
                                .trigger('change')
                                .trigger('keydown');
                            scope.$apply(attrs.ngSubmit);
                        });
                });
            }
        };
    })
;

