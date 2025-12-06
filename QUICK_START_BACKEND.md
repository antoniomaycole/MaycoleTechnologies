# Quick Start: Local Development

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+ (or Docker)
- Git

## 5-Minute Setup

### 1. Start PostgreSQL

**Option A: Local PostgreSQL**

```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services app
```

**Option B: Docker**

```bash
docker run --name maycole-postgres \
  -e POSTGRES_DB=maycoletechnologies_dev \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Create database
docker exec maycole-postgres createdb -U postgres maycoletechnologies_dev
```

### 2. Setup Backend

```bash
cd backend
npm install

# Copy and edit .env.local
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL
```

**Example .env.local**:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/maycoletechnologies_dev
JWT_SECRET=your_jwt_secret_key_min_32_characters_long_change_this
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Run Database Migrations

Open your database tool and run the SQL from `backend/src/db/migrations.ts`:

```sql
-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_organization_id ON categories(organization_id);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address JSONB,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  rating DECIMAL(3,1) DEFAULT 5.0,
  lead_time INTEGER DEFAULT 7,
  minimum_order_value DECIMAL(10,2) DEFAULT 0,
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_suppliers_organization_id ON suppliers(organization_id);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  supplier_id UUID REFERENCES suppliers(id),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  max_stock_level INTEGER DEFAULT 100,
  reorder_point INTEGER DEFAULT 20,
  unit_cost DECIMAL(10,2),
  selling_price DECIMAL(10,2),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_restocked_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_organization_id ON products(organization_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  reference VARCHAR(100),
  reason VARCHAR(255),
  performed_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);

-- Stock Alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(50),
  message TEXT,
  is_resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON stock_alerts(product_id);
```

### 4. Start Backend

```bash
cd backend
npm run dev
# Server running on http://localhost:3001
```

### 5. Start Frontend

In another terminal:

```bash
npm run dev
# App running on http://localhost:3000
```

### 6. Test It!

Open http://localhost:3000 and:

1. **Sign up** with an email and password
2. **Login** with your credentials
3. **Create a product** (Name, SKU required)
4. **View products** list
5. **Update product** details
6. **Delete product**

All data is saved to your PostgreSQL database! 🎉

## Common Issues

### "Error: connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL isn't running. Start it:

```bash
# macOS
brew services start postgresql@15

# Or using Docker
docker start maycole-postgres
```

### "JWT_SECRET must be at least 32 characters"

Update `.env.local`:

```env
JWT_SECRET=your_jwt_secret_key_min_32_characters_long_change_this
```

### Port 3001 already in use

Change PORT in `backend/.env.local`:

```env
PORT=3002
```

And update frontend `.env.local`:

```env
VITE_API_URL=http://localhost:3002
```

### "User already exists"

Use a different email when signing up.

## Files You Need to Know

- `frontend/.env.local` - Frontend config
- `backend/.env.local` - Backend config
- `backend/src/server.ts` - Main backend app
- `backend/src/routes/auth.ts` - Login/register
- `backend/src/routes/products.ts` - Product CRUD
- `src/lib/api.ts` - Frontend API client
- `src/lib/auth.ts` - Frontend auth service

## Next Steps

1. ✅ Set up database
2. ✅ Start both servers
3. ✅ Test auth flow
4. ✅ Test CRUD operations
5. ⏳ Add more features (categories, suppliers, etc.)
6. ⏳ Deploy to Vercel

---

**Need help?** See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)
