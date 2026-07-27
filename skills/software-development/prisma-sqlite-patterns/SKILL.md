---
name: prisma-sqlite-patterns
description: Safe patterns for adding a second Prisma service that shares an existing SQLite database — avoiding data loss from `prisma db push`, handling schema conflicts, relative path resolution, and cross-service JWT auth with raw SQL queries.
---

# Prisma SQLite Multi-Service Patterns

When creating a new service that shares an SQLite database with an existing Prisma-backed service, `prisma db push` will attempt to drop every table NOT in your schema — including the existing service's tables. Use the patterns below to safely add tables and share data.

## Triggers

- Creating a second Express/Node service that needs to read/write the same SQLite DB as an existing Prisma app
- Adding new tables to a shared SQLite DB without touching existing tables
- Cross-service JWT authentication where the user table lives in another service's schema

## Pattern 1: Safe Table Creation (avoid `prisma db push` data loss)

**Problem**: `prisma db push` synchronizes your entire `schema.prisma` to the database. If your schema only defines 2 models but the DB has 6 tables, `prisma db push` will drop the other 4.

**Solution**: Create new tables manually, then use `prisma generate` (which doesn't touch the DB).

### Step 1: Define only your models in `schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Only your NEW models — do NOT include shared tables like User, Task, etc.
model CodeChange {
  id        String   @id @default(uuid())
  commitSha String
  message   String
  // ...
  @@map("code_changes")
}
```

### Step 2: Create the table manually via `$executeRawUnsafe`

```javascript
// setup-db.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS code_changes (
  id TEXT PRIMARY KEY,
  commitSha TEXT NOT NULL,
  message TEXT NOT NULL,
  -- ...
)`);
await prisma.$disconnect();
```

Run: `node setup-db.js`

### Step 3: Generate client (NOT push)

```bash
npx prisma generate   # reads schema, generates client, does NOT touch DB
```

**Never run `prisma db push` on a shared DB** unless your schema includes every table in the database (matching the original schema exactly).

## Pattern 2: Database Path Resolution

Prisma resolves relative `DATABASE_URL` paths from the **`prisma/` directory** (where `schema.prisma` lives), not from the project root.

**Example**: If `schema.prisma` is at `my-service/prisma/schema.prisma` and the shared DB is at `../other-service/prisma/dev.db`, the correct path from `prisma/` is:

```env
# From my-service/prisma/ → ../../other-service/prisma/dev.db
DATABASE_URL="file:../../other-service/prisma/dev.db"
```

Double-check with:
```bash
npx prisma db push --preview-feature  # shows resolved path
```

## Pattern 3: Cross-Service JWT Auth with Raw SQL

When your service shares the `users` table but your Prisma schema doesn't define the full `User` model (to avoid schema conflict), query users with raw SQL:

```javascript
const jwt = require('jsonwebtoken');
// DO NOT use prisma.user.findUnique() — model doesn't exist in this schema
const users = await prisma.$queryRawUnsafe(
  `SELECT id, nickname, role FROM users WHERE id = ?`,
  decoded.sub
);
const user = users[0];
```

**JWT_SECRET must match exactly** between services. Verify with:
```bash
node -e "require('dotenv').config(); console.log('secret length:', process.env.JWT_SECRET.length)"
```

## Pattern 4: Login Proxy for Browser-Based Frontends

When the frontend (served by your service) needs to authenticate against another backend that the browser can't reach directly (e.g., remote Browserbase can't hit `localhost:3000`), proxy the login endpoint:

```javascript
app.post('/api/auth/login', async (req, res) => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(response.status).json(data);
});
```

Also use permissive CORS so the browser can reach your proxy:
```javascript
app.use(cors({ origin: true, credentials: true }));
```

## Pitfalls

- **`prisma db push` drops tables** if your schema doesn't include them. Always check with `--preview-feature` first or skip entirely on shared DBs.
- **`.env` quotes**: `JWT_SECRET="value"` — dotenv strips the quotes on most platforms, but verify with `console.log(secret.length)` if auth mysteriously fails.
- **Rate limiting**: The upstream auth backend may have `loginLimiter` middleware. Too many test logins will trigger 429s. Generate a test token once with `jwt.sign()` and reuse it.
- **Prisma file locks on Windows**: Running `prisma generate` while the Node server is active may fail with `EPERM: operation not permitted`. Kill the server first.
- **$queryRawUnsafe parameterized UTF-8 corruption**: `?` placeholders silently corrupt Chinese characters in SQLite. Use `$executeRawUnsafe` with inline SQL and `esc()` function instead. See Pattern 5 below.

## Pattern 5: UTF-8 Chinese Character Preservation

**Problem**: Prisma `$queryRawUnsafe` with parameterized `?` placeholders silently corrupts UTF-8 Chinese characters when writing to SQLite. The DB encoding is correct (UTF-8), but parameter binding strips multi-byte characters.

**Symptom**: `添加看门狗功能` → `���ӿ��Ź�`

**Solution**: Use `$executeRawUnsafe` with values embedded directly in SQL:

```javascript
// ❌ parameterized — corrupts UTF-8
await prisma.$queryRawUnsafe(
  `INSERT INTO t (summary) VALUES (?)`, '中文');

// ✅ inline with esc() — preserves UTF-8
const esc = (s) => (s || '').replace(/'/g, "''");
await prisma.$executeRawUnsafe(
  `INSERT INTO t (summary) VALUES ('${esc('中文')}')`);
```
