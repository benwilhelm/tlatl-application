import { Sequelize, DataTypes } from 'sequelize';

// don't log SQL Statements in test environment, unless DB_LOGGING environment
// variable is explicitly set
const logging = process.env.DB_LOGGING || process.env.NODE_ENV !== 'test';

export const db = new Sequelize('sqlite::memory:', { logging });

export const User = db.define('User', {});
