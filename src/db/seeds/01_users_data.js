/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex('users').insert([
    { id: 1, name: 'John Doe', field: 'Computer Science' },
    { id: 2, name: 'Jane Smith', field: 'Literature' },
    { id: 3, name: 'Robert Johnson', field: 'Physics' }
  ]);
}