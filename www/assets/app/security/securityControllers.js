(function () {

    'use strict';

    var securityApp = angular.module('leagueApp.security', [
        'ngRoute'
    ]);

    securityApp.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    securityApp.constant('USER_ROLES', {
        all: '*',
        admin: 'admin'
    });

    securityApp.factory('AuthService', function ($http, Session, USER_ROLES) {
        var authService = {};

        authService.login = function (credentials) {
            return $http
                .post('/login', credentials)
                .then(function (res) {
                    Session.create(
                        res.data.user.id,
                        USER_ROLES.all); // For now, we'll just assign everyone the ALL role.
                    // res.data.user.role);
                    return res.data.user;
                });
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
                authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;
    });

    securityApp.service('Session', function () {
        this.create = function (userId, userRole) {
            this.userId = userId;
            this.userRole = userRole;
        };
        this.destroy = function () {
            this.userId = null;
            this.userRole = null;
        };
    });

    securityApp.run(function ($rootScope, AUTH_EVENTS, AuthService) {
        $rootScope.$on('$routeChangeStart', function (event, next) {

            var authorizedRoles;

            if (next.$$route &&
                next.$$route.data &&
                next.$$route.data.authorizedRoles) {

                authorizedRoles = next.$$route.data.authorizedRoles;
            }

            if (typeof authorizedRoles !== 'undefined' &&
                !AuthService.isAuthorized(authorizedRoles)) {

                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
        });
    });

    securityApp.controller('ApplicationController', function (
        $scope,
        $http,
        USER_ROLES,
        AuthService) {

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        $scope.logout = function (e) {
            $scope.currentUser = null;
            $http.post('/logout', {})
                .success(function (response) {
                    console.log(response);
                }).error(function (response) {
                    console.log('error', response);
                });
        }
    });

    securityApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/security/login', {
                    templateUrl: 'app/security/login.html',
                    controller: 'loginController'
                }).
                when('/security/register', {
                    templateUrl: 'app/security/register.html',
                    controller: 'registerController'
                }).
                otherwise({
                    redirectTo: '/security/login'
                })
        }
    ]);

    securityApp.controller(
        'loginController',
        [
            '$scope',
            '$rootScope',
            '$http',
            '$location',
            'AUTH_EVENTS',
            'AuthService',
            function ($scope, $rootScope, $http, $location, AUTH_EVENTS, AuthService) {

                $scope.login = function () {

                    // Setup the credentials.
                    var credentials = {
                        email: $scope.email,
                        password: $scope.password
                    };

                    AuthService.login(credentials).then(function (user) {
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $scope.setCurrentUser(user);

                        console.log('login successful:', user)
                        $location.path('/');
                    }, function () {
                        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        console.log('login failed')
                        $scope.errorMessage = "Authentication failed."
                    });
                };
            }
        ]
    );

    securityApp.controller(
        'registerController',
        [
            '$scope',
            '$rootScope',
            '$location',
            'AUTH_EVENTS',
            '$sails',
            function ($scope, $rootScope, $location, AUTH_EVENTS, $sails) {

                $scope.save = function () {

                    $sails
                        .post('/user', {
                            email: $scope.email,
                            password: $scope.password
                        })
                        .success(function (user) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            $scope.setCurrentUser(user);

                            console.log('registration successful:', user)
                            $location.path('/');
                        }).error(function (response) {
                            console.log('error', response);
                        });
                };
            }
        ]
    );

})();