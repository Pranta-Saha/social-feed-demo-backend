import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const ReplyLike = sequelize.define('ReplyLike', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  replyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Replies',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['replyId', 'userId'],
    },
  ],
});

export default ReplyLike;
