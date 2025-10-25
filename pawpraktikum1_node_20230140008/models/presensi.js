'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User' // Penting: Ini harus sama dengan saat dipanggil di Controller
      });
    }
  }

  Presensi.init({
    userId: DataTypes.INTEGER,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    
    // --- BAGIAN PENTING YANG SEBELUMNYA HILANG ---
    latitude: DataTypes.DECIMAL(10, 8),
    longitude: DataTypes.DECIMAL(11, 8)
    // ---------------------------------------------
  }, {
    sequelize,
    modelName: 'Presensi',
  });

  return Presensi;
};