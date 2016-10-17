/**
 * Match.js
 *
 * @description :: A Match played between two teams.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    date: {
      type: 'date',
      required: true
    },
    teams: {
      collection: 'team',
      via: 'matches',
      through: 'matchteam'
    }
  }
};

