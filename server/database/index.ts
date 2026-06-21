import * as schema from './schema';

let _localDb: any = null;

async function getLocalDb() {
  if (_localDb) return _localDb;
  const { default: Database } = await import('better-sqlite3');
  const { join } = await import('path');
  const { drizzle: drizzleBetterSqlite3 } = await import('drizzle-orm/better-sqlite3');

  const dbPath = join(process.cwd(), 'local.db');
  const sqlite = new Database(dbPath);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS cats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      breed TEXT,
      gender TEXT,
      birth_date TEXT,
      color TEXT,
      weight REAL,
      avatar_url TEXT,
      home_date TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      chip_number TEXT,
      notes TEXT,
      owner_id INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_id INTEGER REFERENCES cats(id),
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      vaccine_name TEXT,
      batch_number TEXT,
      hospital TEXT,
      next_date TEXT,
      medicine_name TEXT,
      dosage TEXT,
      diagnosis TEXT,
      prescription TEXT,
      cost REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cat_id INTEGER REFERENCES cats(id),
      type TEXT NOT NULL,
      remind_at TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  _localDb = drizzleBetterSqlite3(sqlite, { schema });
  return _localDb;
}

export async function useDb(event?: any) {
  const db = event?.context?.cloudflare?.env?.DB;
  if (db) {
    const { drizzle: drizzleD1 } = await import('drizzle-orm/d1');
    return drizzleD1(db, { schema });
  }
  return await getLocalDb();
}
