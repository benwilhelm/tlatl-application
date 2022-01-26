import { Sequelize, DataTypes } from 'sequelize';

// don't log SQL Statements in test environment, unless DB_LOGGING environment
// variable is explicitly set
const logging = process.env.DB_LOGGING || process.env.NODE_ENV !== 'test';

export const db = new Sequelize('sqlite::memory:', { logging });

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
