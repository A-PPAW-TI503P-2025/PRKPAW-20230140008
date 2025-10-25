'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    
    // --- INI PERBAIKANNYA ---
    nama: { // Diganti dari 'name' menjadi 'nama'
      type: DataTypes.STRING
    },
    // -----------------------

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};