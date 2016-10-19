(function () {

    'use strict';

    var matchesApp = angular.module('leagueApp.matches', [
        'ngRoute'
    ]);

    matchesApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/matches', {
                    templateUrl: 'app/matches/matches.html',
                    controller: 'matchesController'
                }).
                when('/matches/add', {
                    templateUrl: 'app/matches/add-match.html',
                    controller: 'addMatchController'
                }).
                otherwise({
                    redirectTo: '/matches'
                })
        }
    ]);

    matchesApp.controller(
        'matchesController',
        [
            '$scope',
            '$sails',
            function ($scope, $sails) {

                $sails.post("/match/find", {
                    sort: 'date ASC'
                }).success(function (response) {
                    $scope.matches = response;
                }).error(function (response) {
                    console.log('error', response);
                });
            }
        ]
    );

    matchesApp.controller(
        'addMatchController',
        [
            '$scope',
            '$location',
            '$sails',
            function ($scope, $location, $sails) {

                // Get the teams.
                $sails.post("/team/find", {
                    sort: 'name ASC'
                }).success(function (response) {
                    $scope.teams = response;
                }).error(function (response) {
                    console.log('error', response);
                });

                // Handle save.
                $scope.save = function() {

                    // Build parameter list to post.
                    var params = {
                        date: $scope.match.date,
                        team1: $scope.team1.team.id,
                        team1score: $scope.team1.score,
                        team2: $scope.team2.team.id,
                        team2score: $scope.team2.score
                    };

                    $sails.post(
                        "/match/addMatch",
                        params
                    ).success(function (response) {
                        $location.path('/matches')
                    }).error(function (response) {
                        console.log('error', response);
                    });
                };
            }
        ]
    );

})();