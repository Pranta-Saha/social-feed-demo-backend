"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "CommentLikes",
      {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
        commentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: "Comments",
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
            fields: ["commentId", "userId"],
          },
        ],
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CommentLikes");
  },
};
