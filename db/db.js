import { Sequelize } from 'sequelize';

// don't log SQL Statements in test environment, unless DB_LOGGING environment
// variable is explicitly set
const logging = getLoggingOption;
const dbCnxString = process.env.DATABASE_CONNECTION_STRING;

export const db = new Sequelize(dbCnxString, { logging });

function getLoggingOption() {
  const { DB_LOGGING, NODE_ENV } = process.env;
  const log = console.log;
  if (DB_LOGGING && DB_LOGGING !== 'false') return log;
  if (NODE_ENV === 'test') return false;
  return log;
}
