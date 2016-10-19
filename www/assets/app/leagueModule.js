(function () {

    'use strict';

    var leagueApp = angular.module('leagueApp', [
        'ngRoute',
        'ngSails',
        'leagueApp.teams',
        'leagueApp.matches',
        'leagueApp.standings',
        'leagueApp.security'
    ]);

    leagueApp.config([
        '$locationProvider',
        '$routeProvider',
        function ($locationProvider, $routeProvider) {

            $locationProvider.hashPrefix('!');

            $routeProvider.otherwise({ redirectTo: '/standings' });
        }]
    );

})();
