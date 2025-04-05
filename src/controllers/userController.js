import * as userService from '../services/userService.js';
import AppError from '../utils/appError.js';

/**
 * Create a new user
 * @route POST /users
 */
export const createUser = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new AppError('Name is required', 400));
        }

        const newUser = await userService.createUser({ name });

        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all users with their borrowed and returned books
 * @route GET /users
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get a specific user with their borrowed and returned books
 * @route GET /users/:id
 */
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Borrow a book
 * @route POST /users/:userId/borrow/:bookId
 */
export const borrowBook = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;

        if (!userId || !bookId) {
            return next(new AppError('User ID and Book ID are required', 400));
        }

        const result = await userService.borrowBook(userId, bookId);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Return a book
 * @route POST /users/:userId/return/:bookId
 */
export const returnBook = async (req, res, next) => {
    try {
        const { userId, bookId } = req.params;
        const { score } = req.body;

        if (!userId || !bookId) {
            return next(new AppError('User ID and Book ID are required', 400));
        }

        const result = await userService.returnBook(userId, bookId, score);

        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (err) {
        next(err);
    }
};