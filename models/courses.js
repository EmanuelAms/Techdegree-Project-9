'use strict';

// load sequelize module
const { Model, DataTypes } = require('sequelize');

// Define Model for the Courses table, with four attributes set to the correct data type,
// and validation to ensure that the values for title and description are properly submitted in the request body

module.exports = (sequelize) => {
  class Courses extends Model {}
  Courses.init({
    
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "title"'
        },
        notEmpty: {
          msg: 'Please provide a title',
        }
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "description"'
        },
        notEmpty: {
          msg: 'Please provide a description',
        }
      }
    },

    estimatedTime: {
      type: DataTypes.STRING,
    },

    materialsNeeded: {
      type: DataTypes.STRING,
    },

  }, { sequelize });

  // Define one-to-one association between the Course and User models

  Courses.associate = (models) => {
    Courses.belongsTo(models.Users, {

      // userId created in the model associations with the foreignKey property, equals the id from the Users table
      foreignKey: 'userId'

    });
  };

  return Courses;
};