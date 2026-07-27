// setup-db.js — Create new tables on a shared SQLite DB without prisma db push
// Usage: node setup-db.js
// Prerequisite: npm install @prisma/client, .env with DATABASE_URL

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Replace with your CREATE TABLE statement(s)
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS my_table (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now'))
  )`);

  console.log('Tables created OK');

  // Verify
  const tables = await prisma.$queryRawUnsafe(
    `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
  );
  console.log('Existing tables:', tables.map(t => t.name).join(', '));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
