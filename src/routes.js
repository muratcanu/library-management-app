import express from 'express';
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

const router = express.Router();

// User routes
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users/:userId/borrow/:bookId', borrowBook);
router.post('/users/:userId/return/:bookId', returnBook);

// Book routes
router.post('/books', createBook);
router.get('/books', getAllBooks);
router.get('/books/:id', getBookById);

export default router;