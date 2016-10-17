/**
 * MatchTeam.js
 *
 * @description :: Associationg between team and match with data regarding teams performance and result.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    match: {
      model: 'match'
    },
    team: {
      model: 'team'
    },
    score: {
      type: 'integer',
      required: true
    },
    result: {
      model: 'lookupresult',
      required: true
    }
  }
};
