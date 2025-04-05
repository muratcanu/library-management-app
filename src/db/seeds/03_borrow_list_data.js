/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('borrow_list').del();

  // Inserts seed entries
  await knex('borrow_list').insert([
    {
      id: 1,
      user_id: 1,
      book_id: 1,
      borrow_date: new Date('2023-03-15T10:00:00Z'),
      return_date: new Date('2023-03-30T14:30:00Z'),
      rate: 9
    },
    {
      id: 2,
      user_id: 2,
      book_id: 3,
      borrow_date: new Date('2023-03-20T11:30:00Z'),
      return_date: null,
      rate: null
    },
    {
      id: 3,
      user_id: 3,
      book_id: 5,
      borrow_date: new Date('2023-03-25T09:15:00Z'),
      return_date: new Date('2023-04-01T16:45:00Z'),
      rate: 7
    }
  ]);
}