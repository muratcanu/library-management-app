import db from '../db/knex.js';
import AppError from '../utils/appError.js';

/**
 * Create a new book
 * @param {Object} bookData - Book data (name)
 * @returns {Promise<Object>} Created book
 */
export const createBook = async (bookData) => {
    if (!bookData.name) {
        throw new AppError('Book name is required', 400);
    }

    try {
        const [book] = await db('books')
            .insert(bookData)
            .returning(['id', 'name', 'created_at']);

        return book;
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError(`Book with name "${bookData.name}" already exists`, 400);
        }
        throw error;
    }
};

/**
 * Get all books with average ratings
 * @returns {Promise<Array>} Array of books with ratings
 */
export const getAllBooks = async () => {
    try {
        // Get all books
        const books = await db('books').select('*');

        // For each book, calculate the average rating
        const booksWithRatings = await Promise.all(books.map(async (book) => {
            // Calculate average rating
            const ratingResult = await db('borrow_list')
                .where('book_id', book.id)
                .whereNotNull('rate')
                .avg('rate as averageRating')
                .first();

            // Get the number of ratings
            const ratingsCount = await db('borrow_list')
                .where('book_id', book.id)
                .whereNotNull('rate')
                .count('* as count')
                .first();

            return {
                ...book,
                averageRating: ratingResult.averageRating ? parseFloat(ratingResult.averageRating).toFixed(1) : null,
                ratingsCount: parseInt(ratingsCount.count)
            };
        }));

        return booksWithRatings;
    } catch (error) {
        throw error;
    }
};

/**
 * Get a specific book with average rating
 * @param {number} bookId - Book ID to retrieve 
 * @returns {Promise<Object>} Book with ratings
 */
export const getBookById = async (bookId) => {
    try {
        // Get the book
        const book = await db('books')
            .select('*')
            .where('id', bookId)
            .first();

        if (!book) {
            throw new AppError(`Book with ID ${bookId} not found`, 404);
        }

        // Calculate average rating
        const ratingResult = await db('borrow_list')
            .where('book_id', bookId)
            .whereNotNull('rate')
            .avg('rate as averageRating')
            .first();

        // Get the number of ratings
        const ratingsCount = await db('borrow_list')
            .where('book_id', bookId)
            .whereNotNull('rate')
            .count('* as count')
            .first();

        // Get all ratings
        const ratings = await db('borrow_list')
            .join('users', 'borrow_list.user_id', 'users.id')
            .select(
                'borrow_list.rate',
                'users.id as userId',
                'users.name as userName',
                'borrow_list.return_date'
            )
            .where('book_id', bookId)
            .whereNotNull('rate')
            .orderBy('borrow_list.return_date', 'desc');

        return {
            ...book,
            averageRating: ratingResult.averageRating ? parseFloat(ratingResult.averageRating).toFixed(1) : null,
            ratingsCount: parseInt(ratingsCount.count),
            ratings
        };
    } catch (error) {
        throw error;
    }
};