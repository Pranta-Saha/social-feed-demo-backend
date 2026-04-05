"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "ReplyLikes",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        replyId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "Replies",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        userId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("NOW"),
        },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ["replyId", "userId"],
          },
        ],
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ReplyLikes");
  },
};
