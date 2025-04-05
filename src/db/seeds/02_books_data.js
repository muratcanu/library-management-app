/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('books').del();

  // Inserts seed entries
  await knex('books').insert([
    { id: 1, name: 'Clean Code' },
    { id: 2, name: 'Pride and Prejudice' },
    { id: 3, name: 'Introduction to Algorithms' },
    { id: 4, name: 'Design Patterns' },
    { id: 5, name: 'To Kill a Mockingbird' }
  ]);
}