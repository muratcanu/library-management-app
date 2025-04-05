import dotenv from 'dotenv';
dotenv.config();

// Determine if running in Docker or locally
const isDocker = process.env.RUNNING_IN_DOCKER === 'true';

export default {
  development: {
    client: 'pg',
    connection: {
      host: isDocker ? (process.env.DB_HOST || 'db') : 'localhost',
      port: process.env.DB_PORT || 5433, // Using 5433 since we mapped PostgreSQL to this port
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'library_db',
    },
    migrations: {
      directory: './src/db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './src/db/migrations',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
  },
};