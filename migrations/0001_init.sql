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

INSERT OR IGNORE INTO settings (key, value) VALUES ('registration_open', 'true');
