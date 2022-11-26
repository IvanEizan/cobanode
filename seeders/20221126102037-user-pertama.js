'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Ivan',
        email: 'eizan@gmail.com',
        password: 'sa',
        createdAt: new Date,
        updatedAt: new Date,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null);
  }
};
