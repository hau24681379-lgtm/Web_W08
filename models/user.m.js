import db from './db.js';

const TABLE_NAME = 'users';

export default {
  all: async () => {
    return await db(TABLE_NAME).select('*');
  },

  oneById: async (id) => {
    const user = await db(TABLE_NAME).select('*').where({ id }).first();
    return user;
  },

  oneByUsername: async (username) => {
    const user = await db(TABLE_NAME).select('*').where({ username }).first();
    return user;
  },

  add: async (newUser) => {
    const [id] = await db(TABLE_NAME).insert(newUser).returning('id');
    return id;
  }
};