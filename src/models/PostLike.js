import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

const PostLike = sequelize.define(
  "PostLike",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    postId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Posts",
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
        fields: ["postId", "userId"],
      },
    ],
  },
);

export default PostLike;
