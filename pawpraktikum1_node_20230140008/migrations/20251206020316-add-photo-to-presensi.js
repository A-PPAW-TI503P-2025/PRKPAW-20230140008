'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    [cite_start]// Menambahkan kolom buktiFoto ke tabel Presensis [cite: 54-58]
    await queryInterface.addColumn('Presensis', 'buktiFoto', {
      type: Sequelize.STRING, // Menyimpan path/nama file
      allowNull: true         // Boleh kosong (opsional)
    });
  },

  async down (queryInterface, Sequelize) {
    // Menghapus kolom jika migrasi di-undo (Revert)
    await queryInterface.removeColumn('Presensis', 'buktiFoto');
  }
};