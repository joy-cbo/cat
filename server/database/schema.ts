import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role', { enum: ['admin', 'member'] }).notNull().default('member'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const cats = sqliteTable('cats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  breed: text('breed'),
  gender: text('gender', { enum: ['male', 'female'] }),
  birthDate: text('birth_date'),
  color: text('color'),
  weight: real('weight'),
  avatarUrl: text('avatar_url'),
  homeDate: text('home_date'),
  status: text('status', { enum: ['active', 'adopted', 'passed'] }).notNull().default('active'),
  chipNumber: text('chip_number'),
  notes: text('notes'),
  ownerId: integer('owner_id').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const healthRecords = sqliteTable('health_records', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  catId: integer('cat_id').references(() => cats.id),
  type: text('type', { enum: ['vaccine', 'deworming', 'sterilization', 'visit', 'checkup', 'weight', 'care'] }).notNull(),
  date: text('date').notNull(),
  vaccineName: text('vaccine_name'),
  batchNumber: text('batch_number'),
  hospital: text('hospital'),
  nextDate: text('next_date'),
  medicineName: text('medicine_name'),
  dosage: text('dosage'),
  diagnosis: text('diagnosis'),
  prescription: text('prescription'),
  cost: real('cost'),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const reminders = sqliteTable('reminders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  catId: integer('cat_id').references(() => cats.id),
  type: text('type', { enum: ['vaccine', 'deworming', 'checkup', 'custom'] }).notNull(),
  remindAt: text('remind_at').notNull(),
  done: integer('done').notNull().default(0),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});
