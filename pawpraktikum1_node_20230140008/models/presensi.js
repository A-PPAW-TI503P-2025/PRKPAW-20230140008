'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // Relasi ke User
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User' 
      });
    }
  }

  Presensi.init({
    userId: DataTypes.INTEGER,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8),
    
    // --- TAMBAHAN PENTING (Agar foto tersimpan ke DB) ---
    buktiFoto: DataTypes.STRING 
    // ----------------------------------------------------
  }, {
    sequelize,
    modelName: 'Presensi',
  });

  return Presensi;
};