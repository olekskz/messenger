'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add foreign key constraints
    await queryInterface.addConstraint('chats', {
      fields: ['user_one'],
      type: 'foreign key',
      name: 'fk_chat_user_one',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('chats', {
      fields: ['user_two'],
      type: 'foreign key',
      name: 'fk_chat_user_two',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraints
    await queryInterface.removeConstraint('chats', 'fk_chat_user_one');
    await queryInterface.removeConstraint('chats', 'fk_chat_user_two');
  }
};