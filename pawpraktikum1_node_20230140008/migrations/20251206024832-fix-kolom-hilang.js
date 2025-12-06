'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Kita cek dulu, kalau kolomnya belum ada, baru kita buat
    const tableInfo = await queryInterface.describeTable('Presensis');
    
    if (!tableInfo.buktiFoto) {
      await queryInterface.addColumn('Presensis', 'buktiFoto', {
        type: Sequelize.STRING,
        allowNull: true
      });
      console.log("SUKSES: Kolom buktiFoto berhasil dibuat!");
    } else {
      console.log("INFO: Kolom buktiFoto sudah ada, melewati proses.");
    }
  },

  async down (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Presensis');
    
    if (tableInfo.buktiFoto) {
      await queryInterface.removeColumn('Presensis', 'buktiFoto');
    }
  }
};