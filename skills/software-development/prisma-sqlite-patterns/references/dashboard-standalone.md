# Dashboard Standalone — Implementation Reference

Concrete example of applying the prisma-sqlite-patterns skill.

## Context

Extracted API billing + code change tracking from a scheduler system into an independent Express service on port 14514, sharing the scheduler's SQLite database.

## Final Structure

```
dashboard-standalone/
├── server.js              ← Express entry, port 14514, login proxy
├── .env                   ← DATABASE_URL, JWT_SECRET, PORT, GIT_REPO_PATH
├── package.json           ← express, @prisma/client, jsonwebtoken, cors, dotenv
├── setup-db.js            ← One-shot script to create code_changes table
├── prisma/
│   └── schema.prisma      ← ApiUsage + CodeChange models only (no User!)
├── config/database.js     ← new PrismaClient()
├── middleware/auth.js      ← JWT verify + raw SQL user lookup
├── routes/
│   ├── dashboard.js       ← GET /api/dashboard, POST /api/dashboard/track
│   └── activity.js        ← GET /api/activity, POST /api/activity/sync
└── public/
    └── index.html         ← Self-contained SPA (Tailwind CDN, vanilla JS)
```

## Key Decisions

- **Shared DB, not copied**: `.env` points to `../../scheduler/backend/prisma/dev.db` (relative from `prisma/` dir)
- **Auth**: Reads `users` table via `$queryRawUnsafe` to avoid Prisma schema conflicts
- **Login proxy**: `/api/auth/login` forwards to scheduler's `:3000` — browser only talks to `:14514`
- **Frontend**: Single HTML file, no React build step, Tailwind CDN, dark theme
- **New table**: `code_changes` created via `$executeRawUnsafe` (Prisma generates client, doesn't touch DB)

## Error Journey

| Error | Cause | Fix |
|-------|-------|-----|
| `no such table: users` | DATABASE_URL `../scheduler/...` resolved from wrong dir | Changed to `../../scheduler/...` (prisma/ → 2 levels up) |
| `prisma db push` wants to drop users/tasks tables | Schema missing shared models | Used raw SQL CREATE TABLE + `prisma generate` only |
| Login returns "无效的 Token" | auth.js used `prisma.user.findUnique()` which uses nonexistent User model | Changed to `$queryRawUnsafe` for user lookup |
| Browser "Failed to fetch" on login | Remote browser can't reach `localhost:3000` | Added `/api/auth/login` proxy in server.js |
| Login 429 rate limited | Too many test requests hit `loginLimiter` | Generated a JWT manually with `jwt.sign()` for testing |
