import { pgTable, serial, text, real, integer, boolean, uuid } from 'drizzle-orm/pg-core';

// Do you like my schema 
// Yo real talk, would you work for a highly unethical tech company? Is there even a way
// To do good in this world with technology? It feels like all its used for is to hurt or
// control others. If there is a way to do good, I hope I find it.

export const clubsTable = pgTable('clubs', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    league: text('league').notNull(),
    country: text('country').notNull(),
    stadiumName: text('stadium').notNull(),
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull()
});

export const gamesTable = pgTable('games', {
    id: uuid('id').defaultRandom().primaryKey(),
    answer: integer('answer_club_id').references(() => clubsTable.id).notNull(),
    guesses: integer('guesses').notNull().default(0),
    gameOver: boolean('game_over').notNull().default(false)
});

export const guessesTable = pgTable('guesses', {
    id: uuid('id').defaultRandom().primaryKey(),
    guess: integer('guess').references(() => clubsTable.id).notNull(),
    gameId: uuid('game_id').references(() => gamesTable.id).notNull(),
    distance: real('distance_from_answer').notNull(),
    answer: boolean('answer').notNull(),
    guessNumber: integer('guess_number').notNull()
});
