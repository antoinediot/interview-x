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

        sails.models.match.create(match, function(err, results) {
            if (err) {
                console.error(err);
            } else {
                matchTeam1.match = results.id;
                matchTeam2.match = results.id;

                sails.models.matchteam.create(matchTeam1, function(err, results) {
                    if (err) {
                        console.error(err);
                    }
                });

                sails.models.matchteam.create(matchTeam2, function(err, results) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });

        return res.json({
            todo: 'Done!'
        });
    }
};

