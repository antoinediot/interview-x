(function () {

    'use strict';

    var standingsApp = angular.module('leagueApp.standings', [
        'ngRoute'
    ]);

    standingsApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/standings', {
                    templateUrl: 'app/standings/standings.html',
                    controller: 'standingsController'
                }).
                otherwise({
                    redirectTo: '/standings'
                })
        }
    ]);

    standingsApp.controller(
        'standingsController',
        [
            '$scope',
            '$sails',
            function ($scope, $sails) {

                // $sails
                // .post("/match/getStandings")
                // .success(function (response) {
                //     $scope.standings = response;
                // }).error(function (response) {
                //     console.log('error', response);
                // });
            }
        ]
    );

})();