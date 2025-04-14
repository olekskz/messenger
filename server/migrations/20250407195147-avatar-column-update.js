'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('u sers', 'avatar', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '/assets/avatar.avif'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
  }
};