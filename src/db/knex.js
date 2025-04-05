import knex from 'knex';
import config from '../../knexfile.js';

const environment = process.env.NODE_ENV || 'development';
const connectionConfig = config[environment];

// Create database connection
const db = knex(connectionConfig);

// Test the connection
const testConnection = async () => {
    try {
        const result = await db.raw('SELECT 1');
        console.log('Database connection established successfully');
        return true;
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        // Don't crash the app, just report the error
        return false;
    }
};

// Execute connection test (but don't wait for it)
testConnection();

export default db;