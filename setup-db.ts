import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DB_URL || '',
  authToken: process.env.DB_TOKEN || '',
});

const tables = [
  `CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS site_settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, value TEXT NOT NULL, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, slot INTEGER NOT NULL UNIQUE, url TEXT NOT NULL, alt TEXT, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT, tags TEXT, link TEXT, sort_order INTEGER NOT NULL DEFAULT 0, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS blog_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, excerpt TEXT NOT NULL, date TEXT NOT NULL, read_time TEXT NOT NULL, link TEXT, sort_order INTEGER NOT NULL DEFAULT 0, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS timeline_events (id INTEGER PRIMARY KEY AUTOINCREMENT, year TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT, sort_order INTEGER NOT NULL DEFAULT 0, updated_at INTEGER)`,
  `CREATE TABLE IF NOT EXISTS connection_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT, linkedin TEXT, twitter TEXT, status TEXT DEFAULT 'pending' NOT NULL, created_at INTEGER)`,
];

for (const sql of tables) {
  await client.execute(sql);
}

console.log('All tables created!');