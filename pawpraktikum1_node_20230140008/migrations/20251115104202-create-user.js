'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  // Fungsi 'up' ini akan dijalankan saat Anda 'db:migrate'
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: { // Ini kolom 'name' yang sebelumnya hilang
        type: Sequelize.STRING
      },
      email: { 
        type: Sequelize.STRING,
        allowNull: false,
        unique: true      
      },
      password: { 
        type: Sequelize.STRING,
        allowNull: false 
      },
      role: { // Ini kolom 'role' yang juga kita butuhkan
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  // Fungsi 'down' ini akan dijalankan saat Anda 'db:migrate:undo'
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};