import Joi from 'joi';

// Schema for creating a new book
export const createBookSchema = {
    body: Joi.object({
        name: Joi.string()
            .min(1)
            .max(255)
            .required()
            .messages({
                'string.empty': 'Book name cannot be empty',
                'string.min': 'Book name must be at least {#limit} characters long',
                'string.max': 'Book name cannot be more than {#limit} characters long',
                'any.required': 'Book name is required'
            })
    })
};

// Schema for retrieving a book by ID
export const getBookByIdSchema = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Book ID must be a number',
                'number.integer': 'Book ID must be an integer',
                'number.positive': 'Book ID must be positive',
                'any.required': 'Book ID is required'
            })
    })
};