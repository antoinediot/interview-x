/**
 * LookupResult.js
 *
 * @description :: A leage team.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      enum: ['W', 'L', 'D'],
      size: 1
    },
    description: {
      type: 'string',
      required: true,
      size: 32
    }
  }
};

