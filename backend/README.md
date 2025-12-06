# MaycoleTechnologies Backend

Express.js REST API server for inventory management and user authentication.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/maycoletechnologies_dev
JWT_SECRET=your_secret_key_min_32_characters_long
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up Database

**Option A: Local PostgreSQL**

```bash
# Create database
createdb maycoletechnologies_dev

# Run migrations
psql maycoletechnologies_dev < db/migrations.sql
```

**Option B: Vercel Postgres (Production)**

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project → Storage → Create Database → Postgres
3. Copy the connection string to `DATABASE_URL` in `.env.local`
4. Run the migrations in the Vercel Postgres console

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── auth.ts      # Authentication endpoints
│   │   └── products.ts  # Product endpoints
│   ├── middleware/      # Express middleware
│   │   └── auth.ts      # JWT authentication
│   ├── db/              # Database utilities
│   │   ├── client.ts    # DB connection pool
│   │   └── migrations.ts# Database schema
│   └── server.ts        # Main server file
├── dist/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .env.local          # Local environment variables
```

## Environment Variables

| Variable         | Description                   | Example                       |
| ---------------- | ----------------------------- | ----------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string  | `postgresql://...`            |
| `JWT_SECRET`     | Secret for signing JWT tokens | `random_32_char_string`       |
| `JWT_EXPIRES_IN` | Token expiration time         | `7d`                          |
| `PORT`           | Server port                   | `3001`                        |
| `NODE_ENV`       | Environment                   | `development` or `production` |
| `FRONTEND_URL`   | Frontend URL for CORS         | `http://localhost:3000`       |

## Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

## Database Schema

The server automatically creates these tables:

- **organizations** - Organization data
- **users** - User accounts
- **categories** - Product categories
- **suppliers** - Supplier information
- **products** - Product inventory
- **stock_movements** - Stock transaction history
- **stock_alerts** - Low stock/overstock alerts

## Authentication Flow

1. User registers with email and password
2. Password is hashed with bcryptjs
3. User login returns JWT token
4. Token is sent in `Authorization: Bearer <token>` header
5. Middleware verifies token on protected routes

## Security Notes

- Never commit `.env.local` to version control
- Use strong JWT_SECRET (32+ characters)
- Enable SSL in production (Vercel does this by default)
- Use HTTPS only in production
- Validate all user inputs
- Use CORS to restrict frontend access

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Heroku

1. Create Heroku app: `heroku create`
2. Set environment: `heroku config:set DATABASE_URL=...`
3. Deploy: `git push heroku main`

## Support

For issues or questions, refer to the main [README.md](../README.md)
