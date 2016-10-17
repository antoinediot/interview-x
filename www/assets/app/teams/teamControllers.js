(function () {

    'use strict';

    var teamsApp = angular.module('leagueApp.teams', [
        'ngRoute'
    ]);

    teamsApp.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/teams', {
                    templateUrl: 'app/teams/teamlist.html',
                    controller: 'teamListController'
                }).
                otherwise({
                    redirectTo: '/teams'
                })
        }
    ]);

    teamsApp.controller(
        'teamListController',
        [
            '$scope',
            '$sails',
            function ($scope, $sails) {

                (function () {
                    $sails.post("/team/find", {
                        sort: 'name ASC'
                    }).success(function (response) {
                        $scope.teams = response;
                    }).error(function (response) {
                        console.log('error', response);
                    });

                    $scope.addTeamName = '';
                    $scope.addTeam = function () {
                        console.log('adding team: ', $scope.addTeamName);

                        $sails.post("/team/create", {
                            name: $scope.addTeamName
                        }).success(function (response) {
                            console.log('created', response);

                            // If all went well, add the new team to the list.
                            $scope.teams.push(response);

                            // Reset the add form.
                            $scope.addTeamName = '';

                        }).error(function (response) {
                            // If there was a problem then ...
                            console.log('error', response);
                        });

                    };

                    $scope.editTeam = function (team) {
                        team.nameEdit = team.name;
                        team.editMode = true;
                    };

                    $scope.applyEditTeam = function (team) {
                        $sails.post("/team/update/" + team.id, {
                            name: team.nameEdit
                        }).success(function (response) {
                            console.log('updated', response);

                            // If all went well, update the view model.
                            team.name = team.nameEdit;

                            // Exit edit mode.
                            team.editMode = false;

                            // Reset the add form.
                            $scope.addTeamName = '';

                        }).error(function (response) {
                            // If there was a problem then ...
                            console.log('error', response);
                        });
                        team.editMode = false;
                    };

                    $scope.cancelEditTeam = function (team) {
                        team.editMode = false;
                    };

                    $scope.deleteTeam = function (team) {
                        console.log('deleting team: ', team.name);

                        $sails.delete('/team/' + team.id)
                            .success(function (response) {
                                console.log('deleted', response);

                                // Remove the deleted team.
                                $scope.teams.splice($scope.teams.indexOf(team), 1);
                            })
                            .error(function (response) {
                                console.log('error', response);
                            });
                    };
                })();

                $scope.message = "You are on the Teams List Page.";
            }
        ]);

})();
