import AppError from '../utils/appError.js';

/**
 * Database error handler - converts specific DB errors to user-friendly messages
 */
const handleDatabaseError = (err) => {
    // Postgres unique violation
    if (err.code === '23505') {
        return new AppError('A record with these details already exists.', 400);
    }

    // Foreign key violation
    if (err.code === '23503') {
        return new AppError('Referenced resource does not exist.', 400);
    }

    return err;
};

/**
 * Global error handling middleware
 */
export default (err, req, res, next) => {
    console.error('Error:', err);

    // If the error has a database error code, process it
    if (err.code && /^[0-9]{5}$/.test(err.code)) {
        err = handleDatabaseError(err);
    }

    // Determine if this is an operational error we can handle gracefully
    const isOperationalError = err.isOperational || false;

    // Set defaults
    const statusCode = err.statusCode || 500;
    const message = isOperationalError ? err.message : 'Something went wrong';

    // Create response object
    const response = {
        status: statusCode >= 500 ? 'error' : 'fail',
        message
    };

    // Add stack trace in development mode
    if (process.env.NODE_ENV === 'development' && !isOperationalError) {
        response.error = err;
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};