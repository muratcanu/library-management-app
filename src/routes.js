import express from 'express';
import validate from './middleware/validate.js';

// Controllers
import {
    createUser,
    getAllUsers,
    getUserById,
    borrowBook,
    returnBook
} from './controllers/userController.js';

import {
    createBook,
    getAllBooks,
    getBookById
} from './controllers/bookController.js';

// Validation schemas
import {
    createUserSchema,
    getUserByIdSchema,
    borrowBookSchema,
    returnBookSchema
} from './validations/userValidation.js';

import {
    createBookSchema,
    getBookByIdSchema
} from './validations/bookValidation.js';

const router = express.Router();

// User routes
router.post('/users', validate(createUserSchema), createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', validate(getUserByIdSchema), getUserById);
router.post('/users/:userId/borrow/:bookId', validate(borrowBookSchema), borrowBook);
router.post('/users/:userId/return/:bookId', validate(returnBookSchema), returnBook);

// Book routes
router.post('/books', validate(createBookSchema), createBook);
router.get('/books', getAllBooks);
router.get('/books/:id', validate(getBookByIdSchema), getBookById);

export default router;