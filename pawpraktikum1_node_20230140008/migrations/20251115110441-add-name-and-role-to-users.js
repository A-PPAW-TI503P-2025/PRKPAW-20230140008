'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Perintah untuk MENAMBAHKAN kolom 'name' SAJA
    await queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    // Perintah untuk MENGHAPUS kolom 'name' (jika di-undo)
    await queryInterface.removeColumn('Users', 'name');
  }
};