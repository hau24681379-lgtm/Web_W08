import 'dotenv/config';
import knex from 'knex';
import knexConfig from '../knexfile.js';

const env = process.env.NODE_ENV || 'development';
const config = knexConfig[env];
const db = knex(config);    

export default db;  