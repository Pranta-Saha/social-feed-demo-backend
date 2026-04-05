import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const Reply = sequelize.define("Reply", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  commentId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Comments",
      key: "id",
    },
  },
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Reply;
