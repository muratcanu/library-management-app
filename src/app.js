import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Library Management API'
    });
});

// API routes
app.use('/', routes);

// Handle undefined routes
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    err.status = 'fail';
    next(err);
});

// Global error handling middleware
app.use(errorHandler);

export default app;