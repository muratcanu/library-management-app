import AppError from '../utils/appError.js';

/**
 * Middleware to validate request using Joi schema
 * @param {Object} schema - Joi schema object with body, params, query keys
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, res, next) => {
    const validationOptions = {
        abortEarly: false,  // Include all errors
        allowUnknown: true, // Ignore unknown props
        stripUnknown: true  // Remove unknown props
    };

    // Validate request body if schema.body is provided
    if (schema.body) {
        const { error, value } = schema.body.validate(req.body, validationOptions);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(`Invalid request data: ${errorMessage}`, 400));
        }

        // Replace req.body with validated value
        req.body = value;
    }

    // Validate request params if schema.params is provided
    if (schema.params) {
        const { error, value } = schema.params.validate(req.params, validationOptions);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(`Invalid path parameters: ${errorMessage}`, 400));
        }

        // Replace req.params with validated value
        req.params = value;
    }

    // Validate request query if schema.query is provided
    if (schema.query) {
        const { error, value } = schema.query.validate(req.query, validationOptions);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return next(new AppError(`Invalid query parameters: ${errorMessage}`, 400));
        }

        // Replace req.query with validated value
        req.query = value;
    }

    next();
};

export default validate;