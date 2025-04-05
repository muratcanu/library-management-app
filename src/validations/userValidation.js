import Joi from 'joi';

// Schema for creating a new user
export const createUserSchema = {
    body: Joi.object({
        name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .messages({
                'string.empty': 'Name cannot be empty',
                'string.min': 'Name must be at least {#limit} characters long',
                'string.max': 'Name cannot be more than {#limit} characters long',
                'any.required': 'Name is required'
            }),
    })
};

// Schema for retrieving a user by ID
export const getUserByIdSchema = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'User ID must be a number',
                'number.integer': 'User ID must be an integer',
                'number.positive': 'User ID must be positive',
                'any.required': 'User ID is required'
            })
    })
};

// Schema for borrowing a book
export const borrowBookSchema = {
    params: Joi.object({
        userId: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'User ID must be a number',
                'number.integer': 'User ID must be an integer',
                'number.positive': 'User ID must be positive',
                'any.required': 'User ID is required'
            }),
        bookId: Joi.number()
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

// Schema for returning a book
export const returnBookSchema = {
    params: Joi.object({
        userId: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'User ID must be a number',
                'number.integer': 'User ID must be an integer',
                'number.positive': 'User ID must be positive',
                'any.required': 'User ID is required'
            }),
        bookId: Joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                'number.base': 'Book ID must be a number',
                'number.integer': 'Book ID must be an integer',
                'number.positive': 'Book ID must be positive',
                'any.required': 'Book ID is required'
            })
    }),
    body: Joi.object({
        score: Joi.number()
            .integer()
            .min(0)
            .max(10)
            .optional()
            .messages({
                'number.base': 'Score must be a number',
                'number.integer': 'Score must be an integer',
                'number.min': 'Score must be at least {#limit}',
                'number.max': 'Score cannot be more than {#limit}'
            })
    })
};