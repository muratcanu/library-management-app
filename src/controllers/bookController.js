import * as bookService from '../services/bookService.js';
import AppError from '../utils/appError.js';

/**
 * Create a new book
 * @route POST /books
 */
export const createBook = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new AppError('Name is required', 400));
        }

        const newBook = await bookService.createBook({ name });

        res.status(201).json({
            status: 'success',
            data: {
                book: newBook
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get all books with average ratings
 * @route GET /books
 */
export const getAllBooks = async (req, res, next) => {
    try {
        const books = await bookService.getAllBooks();

        res.status(200).json({
            status: 'success',
            results: books.length,
            data: {
                books
            }
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get a specific book with average rating
 * @route GET /books/:id
 */
export const getBookById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const book = await bookService.getBookById(id);

        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch (err) {
        next(err);
    }
};