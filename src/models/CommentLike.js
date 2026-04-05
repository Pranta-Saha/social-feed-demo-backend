import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const CommentLike = sequelize.define(
  "CommentLike",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    commentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Comments",
        key: "id",
      },
    },
    userId: {
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
  },
  {
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["commentId", "userId"],
      },
    ],
  },
);

export default CommentLike;
