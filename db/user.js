import { DataTypes } from 'sequelize';
import { db } from './db.js';

export const User = db.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Name is a required field',
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Email is a required field',
      },
      isEmail: {
        msg: 'Email does not appear valid',
      },
    },
  },
});
