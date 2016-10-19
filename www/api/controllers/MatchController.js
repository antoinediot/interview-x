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
    },

    getMatches: function (req, res) {

        var matchesQuery = 'SELECT m.id as matchId, m.date, mt.score, t.id as teamId, t.name FROM `match` m'
            + ' JOIN matchteam mt ON mt.match = m.id'
            + ' JOIN team t ON t.id = mt.team';

        try {
            var results = sails.models.match.query(matchesQuery, function (err, results) {
                var matches = [],
                    index,
                    currentMatch;

                if (err) return res.serverError(err);

                // For each match team returned:
                for (index = 0; index < results.length; index++) {

                    // Find the match corresponding to the current match team.
                    currentMatch = matches.find(function(match){
                        return match.id === results[index].matchId;
                    });

                    // If we haven't already added the current match then:
                    if (typeof currentMatch === 'undefined') {
                        
                        // Create it.
                        currentMatch = {
                            id: results[index].matchId,
                            date: results[index].date,
                            teams: []
                        };

                        // Add it.
                        matches.push(currentMatch);
                    }

                    // Add the team with result details to the match.
                    currentMatch.teams.push({
                        id: results[index].teamId,
                        name: results[index].name,
                        score: results[index].score
                    });
                }

                return res.json(matches);
            });
        } catch (e) {
            return res.send(e);
        }
    }
};

