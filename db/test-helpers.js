import { db } from './db.js';

export const resetDb = async () => db.sync({ force: true });
