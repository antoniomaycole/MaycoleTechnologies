# Database Setup Guide

## Overview

MaycoleTechnologies uses PostgreSQL with the following structure:

- **Development**: Local PostgreSQL or Vercel Postgres
- **Production**: Vercel Postgres (included with hosting)
- **ORM**: Prisma (optional) or raw SQL

---

## Quick Setup

### Option 1: Local Development (PostgreSQL)

#### Install PostgreSQL

```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

#### Create Local Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In psql console:
CREATE DATABASE maycoletechnologies_dev;
CREATE USER maycole_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE maycoletechnologies_dev TO maycole_user;
ALTER DATABASE maycoletechnologies_dev OWNER TO maycole_user;
\q
```

#### Set Environment Variable

```bash
# .env.local
DATABASE_URL=postgresql://maycole_user:your_password_here@localhost:5432/maycoletechnologies_dev
```

#### Start PostgreSQL

```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql
```

---

### Option 2: Vercel Postgres (Recommended for Production)

#### Connect to Vercel

```bash
# Go to: https://vercel.com/dashboard
# 1. Select your project
# 2. Settings → Storage
# 3. Click "Create Database" → Postgres
# 4. Name: "maycoletechnologies"
# 5. Copy CONNECTION STRING
```

#### Get Connection String

```bash
# Vercel Dashboard shows:
DATABASE_URL=postgresql://default:xxxxx@ep-xxxxx.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require
```

---

## Database Schema

### Tables Created

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  username VARCHAR(100),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams & Collaboration
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- Inventory
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 0,
  unit_price DECIMAL(10, 2),
  category VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions & Billing
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan_type VARCHAR(50) NOT NULL DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stripe Events & Webhooks
CREATE TABLE stripe_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  message TEXT,
  type VARCHAR(50),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL,
  properties JSONB,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys (for third-party integrations)
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  key_hash VARCHAR(255) NOT NULL,
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);
```

---

## Using with Node.js

### Option 1: Using Prisma ORM

#### Install

```bash
npm install @prisma/client
npm install -D prisma
```

#### Initialize

```bash
npx prisma init
```

#### schema.prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  teams Team[]
}

model Team {
  id    String @id @default(cuid())
  name  String
  owner User @relation(fields: [ownerId], references: [id])
  ownerId String
}
```

#### Use in API

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Query users
const users = await prisma.user.findMany();
```

### Option 2: Using Raw SQL with node-postgres

#### Install

```bash
npm install pg
```

#### Connection

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Query
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
const user = result.rows[0];
```

---

## Migration & Setup

### Initial Setup

```bash
# Create tables (using SQL file)
psql $DATABASE_URL < schema.sql

# Or if using Prisma
npx prisma migrate dev --name init
npx prisma generate
```

### Seeding (Optional)

```typescript
// scripts/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
    },
  });
  console.log('Created user:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Backup & Maintenance

### Backup Vercel Postgres

```bash
# Vercel handles daily backups automatically
# View in: Vercel Dashboard → Project → Storage → Postgres → Backups

# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Monitor Database

```bash
# Check size
SELECT pg_size_pretty(pg_database_size('maycoletechnologies'));

# Check connections
SELECT count(*) FROM pg_stat_activity;

# View slow queries (if enabled)
SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC;
```

---

## Troubleshooting

### Connection Error

```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check PostgreSQL is running
ps aux | grep postgres
```

### Schema Not Created

```bash
# Run migrations
npx prisma migrate deploy

# Or manually import schema
psql $DATABASE_URL < schema.sql
```

### Port Already in Use

```bash
# Find process using port 5432
lsof -i :5432

# Kill it
kill -9 <PID>

# Or change port in connection string
postgresql://user:pass@localhost:5433/dbname
```

---

## Security Best Practices

1. **Never commit DATABASE_URL to git** - Use .env.local
2. **Use strong passwords** - 16+ characters with mixed case
3. **Enable SSL** - Vercel Postgres uses SSL by default
4. **Restrict IP access** - (if applicable)
5. **Rotate credentials regularly** - Update keys quarterly
6. **Enable audit logging** - Track all changes
7. **Use connection pooling** - For serverless (Vercel/PgBouncer)
8. **Regular backups** - Verify backups work

---

## Next Steps

1. ✅ Choose deployment option (local or Vercel)
2. ✅ Set DATABASE_URL env variable
3. ✅ Create/initialize database
4. ✅ Run migrations
5. ✅ Test connections from app
6. ✅ Setup monitoring
7. ✅ Configure backups
