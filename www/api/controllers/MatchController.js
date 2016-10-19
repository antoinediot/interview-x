/**
 * MatchController
 *
 * @description :: Server-side logic for managing Matches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addMatch: function (req, res) {

        // Create match team records.
        var params = req.allParams(),
            matchTeam1 = {
                team: params.team1,
                score: params.team1score
            },
            matchTeam2 = {
                team: params.team2,
                score: params.team2score
            },
            match = {
                date: params.date
            };

        if (matchTeam1.score > matchTeam2.score) {
            matchTeam1.result = 'W';
            matchTeam2.result = 'L';
        } else if (matchTeam1.score < matchTeam2.score) {
            matchTeam1.result = 'L';
            matchTeam2.result = 'W';
        } else if (matchTeam1.score === matchTeam2.score) {
            matchTeam1.result = 'D';
            matchTeam2.result = 'D';
        } else {
            console.error('Result calculation unreachable code!')
        }

        // First create the match.
        sails.models.match
            .create(match)
            .then(function (match) {

                // Associate the match teams with the match.
                matchTeam1.match = match.id;
                matchTeam2.match = match.id;

                // Create the first match team.
                sails.models.matchteam
                    .create(matchTeam1)
                    .then(function () {

                        // Create the second match team.
                        sails.models.matchteam
                            .create(matchTeam2)
                            .then(function () {
                                return res.status(200).send('Match created.');
                            })
                            .fail(function (reason) {
                                console.error(reason);
                                return res.status(500).send(reason);
                            });
                    })
                    .fail(function (reason) {
                        console.error(reason);
                        return res.status(500).send(reason);
                    });
            })
            .fail(function (reason) {
                console.error(reason);
                return res.status(500).send(reason);
            });
    }
};

