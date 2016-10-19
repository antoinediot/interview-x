(function () {

    'use strict';

    var securityApp = angular.module('leagueApp.security', [
        'ngRoute'
    ]);

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
            '$http',
            '$location',
            function ($scope, $http, $location) {

                $scope.login = function () {

                    $http
                        .post('/login', {
                            email: $scope.email,
                            password: $scope.password
                        })
                        .success(function (response) {
                            if (response.user) {
                                console.log('login successful:', response)
                                $location.path('/');
                            } else {
                                console.log('login failed:', response)
                                $scope.errorMessage = "Authentication failed."
                            }
                        }).error(function (response) {
                            console.log('error', response);
                        });
                };
            }
        ]
    );

    securityApp.controller(
        'registerController',
        [
            '$scope',
            '$sails',
            function ($scope, $sails) {

                $scope.save = function () {

                    $sails
                        .post('/user', {
                            email: $scope.email,
                            password: $scope.password
                        })
                        .success(function (response) {
                            console.log('registration successful:', response)
                        }).error(function (response) {
                            console.log('error', response);
                        });
                };
            }
        ]
    );

})();