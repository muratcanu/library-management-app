import db from '../db/knex.js';
import AppError from '../utils/appError.js';

/**
 * Create a new user
 * @param {Object} userData - User data (name, field)
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  if (!userData.name) {
    throw new AppError('User name is required', 400);
  }
  
  try {
    const [user] = await db('users')
      .insert(userData)
      .returning(['id', 'name', 'field', 'created_at']);
    
    return user;
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError(`User with name "${userData.name}" already exists`, 400);
    }
    throw error;
  }
};

/**
 * Get all users with their borrowed and returned books
 * @returns {Promise<Array>} Array of users with their books
 */
export const getAllUsers = async () => {
  try {
    // Get all users
    const users = await db('users').select('*');
    
    // For each user, get their borrowed and returned books
    const usersWithBooks = await Promise.all(users.map(async (user) => {
      // Get currently borrowed books (return_date is null)
      const borrowedBooks = await db('borrow_list as bl')
        .join('books as b', 'bl.book_id', 'b.id')
        .select('b.id', 'b.name', 'bl.borrow_date')
        .where('bl.user_id', user.id)
        .whereNull('bl.return_date');
      
      // Get latest returned books with scores
      const returnedBooks = await db('borrow_list as bl')
        .join('books as b', 'bl.book_id', 'b.id')
        .select('b.id', 'b.name', 'bl.borrow_date', 'bl.return_date', 'bl.rate')
        .where('bl.user_id', user.id)
        .whereNotNull('bl.return_date')
        .orderBy('bl.return_date', 'desc')
        .limit(5); // Get last 5 returned books
      
      return {
        ...user,
        borrowedBooks,
        returnedBooks
      };
    }));
    
    return usersWithBooks;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific user with their borrowed and returned books
 * @param {number} userId - User ID to retrieve
 * @returns {Promise<Object>} User with their books
 */
export const getUserById = async (userId) => {
  try {
    // Get the user
    const user = await db('users')
      .select('*')
      .where('id', userId)
      .first();
    
    if (!user) {
      throw new AppError(`User with ID ${userId} not found`, 404);
    }
    
    // Get currently borrowed books
    const borrowedBooks = await db('borrow_list as bl')
      .join('books as b', 'bl.book_id', 'b.id')
      .select('b.id', 'b.name', 'bl.borrow_date')
      .where('bl.user_id', userId)
      .whereNull('bl.return_date');
    
    // Get latest returned books with scores
    const returnedBooks = await db('borrow_list as bl')
      .join('books as b', 'bl.book_id', 'b.id')
      .select('b.id', 'b.name', 'bl.borrow_date', 'bl.return_date', 'bl.rate')
      .where('bl.user_id', userId)
      .whereNotNull('bl.return_date')
      .orderBy('bl.return_date', 'desc')
      .limit(5); // Get last 5 returned books
    
    return {
      ...user,
      borrowedBooks,
      returnedBooks
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Borrow a book for a user
 * @param {number} userId - User ID
 * @param {number} bookId - Book ID
 * @returns {Promise<Object>} Borrow record
 */
export const borrowBook = async (userId, bookId) => {
  try {
    // Check if user exists
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new AppError(`User with ID ${userId} not found`, 404);
    }
    
    // Check if book exists
    const book = await db('books').where('id', bookId).first();
    if (!book) {
      throw new AppError(`Book with ID ${bookId} not found`, 404);
    }
    
    // Check if the book is already borrowed by the user
    const alreadyBorrowedByUser = await db('borrow_list')
      .where({ user_id: userId, book_id: bookId })
      .whereNull('return_date')
      .first();
    
    if (alreadyBorrowedByUser) {
      throw new AppError(`Book "${book.name}" is already borrowed by user "${user.name}"`, 400);
    }
    
    // Check if the book is borrowed by any user
    const alreadyBorrowed = await db('borrow_list')
      .where({ book_id: bookId })
      .whereNull('return_date')
      .first();
    
    if (alreadyBorrowed) {
      const borrower = await db('users').where('id', alreadyBorrowed.user_id).first();
      throw new AppError(`Book "${book.name}" is currently borrowed by user "${borrower.name}"`, 400);
    }
    
    // Create borrow record
    const [borrowRecord] = await db('borrow_list')
      .insert({
        user_id: userId,
        book_id: bookId,
        borrow_date: new Date()
      })
      .returning(['id', 'user_id', 'book_id', 'borrow_date']);
    
    return {
      message: 'Book borrowed successfully',
      borrowRecord
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Return a book with optional rating
 * @param {number} userId - User ID
 * @param {number} bookId - Book ID
 * @param {number} score - Optional rating (0-10)
 * @returns {Promise<Object>} Updated borrow record
 */
export const returnBook = async (userId, bookId, score) => {
  try {
    // Check if user exists
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new AppError(`User with ID ${userId} not found`, 404);
    }
    
    // Check if book exists
    const book = await db('books').where('id', bookId).first();
    if (!book) {
      throw new AppError(`Book with ID ${bookId} not found`, 404);
    }
    
    // Find the borrow record
    const borrowRecord = await db('borrow_list')
      .where({ user_id: userId, book_id: bookId })
      .whereNull('return_date')
      .first();
    
    if (!borrowRecord) {
      throw new AppError(`No active borrow record found for user "${user.name}" and book "${book.name}"`, 404);
    }
    
    // Update the borrow record with return date and score
    const updateData = {
      return_date: new Date(),
      updated_at: new Date()
    };
    
    // Add score if provided
    if (score !== undefined) {
      if (score < 0 || score > 10 || !Number.isInteger(Number(score))) {
        throw new AppError('Rating must be an integer between 0 and 10', 400);
      }
      updateData.rate = score;
    }
    
    const [updatedRecord] = await db('borrow_list')
      .where('id', borrowRecord.id)
      .update(updateData)
      .returning(['id', 'user_id', 'book_id', 'borrow_date', 'return_date', 'rate', 'updated_at']);
    
    return {
      message: 'Book returned successfully',
      updatedRecord
    };
  } catch (error) {
    throw error;
  }
};