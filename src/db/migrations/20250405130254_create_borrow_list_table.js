/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('borrow_list', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('book_id').unsigned().notNullable();
        table.timestamp('borrow_date').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('return_date').nullable();
        table.integer('rate').nullable().unsigned().comment('Rating 0-10');
        table.timestamps(true, true);

        // Foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('book_id').references('id').inTable('books').onDelete('CASCADE');

        // Additional check constraint for rating range
        table.check('rate >= 0 AND rate <= 10');
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('borrow_list');
}