# 🎯 MaycoleTechnologies - Developer Quick Start

## ⚡ TL;DR - Start in 3 Commands

```bash
# Terminal 1: Frontend
cd c:\Users\TEMP\Downloads\MaycoleTechnologies
npm run dev

# Terminal 2: Backend
cd c:\Users\TEMP\Downloads\MaycoleTechnologies\backend
npm run dev

# Then open http://localhost:3000 in browser
```

## 📌 Key Information

| Item           | Value                                                |
| -------------- | ---------------------------------------------------- |
| Frontend URL   | `http://localhost:3000`                              |
| Backend URL    | `http://localhost:3001`                              |
| API Base       | `http://localhost:3001/api`                          |
| Frontend Port  | 3000 (Vite)                                          |
| Backend Port   | 3001 (Express)                                       |
| Database       | PostgreSQL (connection string in backend/.env.local) |
| Authentication | JWT (7-day expiry)                                   |
| Build Status   | ✅ 0 Errors                                          |
| Security       | ✅ 0 Vulnerabilities                                 |

## 📁 Important Files

```
backend/.env.local          ← Database & JWT config (REQUIRED)
backend/package.json        ← Dependencies & scripts
backend/src/server.ts       ← Express app entry point
src/lib/api.ts             ← Frontend API client
src/lib/auth.ts            ← Frontend auth service
.env.local                 ← Frontend env (already set to localhost:3001)
```

## 🔧 Common Commands

```bash
# Frontend
npm run dev               # Start dev server
npm run build             # Production build
npm run preview           # Preview build
npm run lint              # Run linter
npm run type-check        # TypeScript check

# Backend
cd backend
npm run dev               # Start with tsx watch
npm run build             # TypeScript compilation
npm start                 # Run dist/server.js
npm test                  # Run tests (if configured)
```

## 🔐 Before Running

**CRITICAL**: Set up `backend/.env.local` with:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/maycoletechnologies_dev
JWT_SECRET=your_secret_key_min_32_chars
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Create PostgreSQL Database (Windows PowerShell)

```powershell
# Install PostgreSQL if needed, then:
psql -U postgres

# In psql:
CREATE DATABASE maycoletechnologies_dev;
\q
```

### Run Migrations

```bash
# Extract SQL from migrations.ts and run it
psql -U postgres -d maycoletechnologies_dev < backend/src/db/migrations.ts
```

## 📡 API Quick Reference

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "My Company"
}

Response: { user, organization, token, expiresAt }
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: { user, organization, token, expiresAt }
```

### Get Products

```bash
GET /api/products
Authorization: Bearer <token>

Response: [{ id, name, sku, price, stock_quantity, ... }]
```

### Create Product

```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Widget",
  "sku": "WID-001",
  "description": "A useful widget",
  "price": 29.99,
  "stock_quantity": 100,
  "category_id": "uuid-here"
}

Response: { id, name, sku, price, created_at, ... }
```

## 🧪 Quick Test

```bash
# Test backend health
curl http://localhost:3001/health

# Should return:
# {"status":"ok","timestamp":"2024-01-XX..."}
```

## 📦 Dependencies Summary

### Frontend

- React 18.3.1
- TypeScript 5.9.3
- Vite 6.4.1
- 2429 modules total
- ✅ 0 Errors

### Backend

- Express.js 4.18.2
- PostgreSQL (pg) 8.11.3
- JWT (jsonwebtoken) 9.0.2
- bcryptjs 2.4.3
- TypeScript 5.3.3
- 129 packages total
- ✅ 0 Vulnerabilities

## 🎨 Frontend Architecture

```
src/
├── components/              # React components
├── contexts/               # State management
├── hooks/                  # Custom hooks
├── lib/
│   ├── api.ts             # API client (calls localhost:3001)
│   ├── auth.ts            # Auth service (JWT handling)
│   └── config.ts          # Configuration
├── types/                  # TypeScript types
├── styles/                 # CSS/Tailwind
└── main.tsx               # Entry point
```

## 🖧 Backend Architecture

```
backend/src/
├── server.ts              # Express app + routes
├── routes/
│   ├── auth.ts           # /api/auth/* endpoints
│   └── products.ts       # /api/products/* endpoints
├── middleware/
│   └── auth.ts           # JWT verification
└── db/
    ├── client.ts         # PostgreSQL pool
    └── migrations.ts     # Schema (7 tables)
```

## 🚨 Troubleshooting

| Issue                         | Solution                                                               |
| ----------------------------- | ---------------------------------------------------------------------- |
| Port 3000/3001 already in use | Kill process: `netstat -ano \| findstr :3001` then `taskkill /PID xxx` |
| "Cannot find module"          | Run `npm install` in that directory                                    |
| Database connection error     | Check PostgreSQL is running & DATABASE_URL is correct                  |
| CORS error in browser         | Ensure backend FRONTEND_URL matches frontend URL in .env.local         |
| 401 Unauthorized              | Token might be expired or invalid, register/login again                |

## 📚 Documentation

- **Full Setup**: See `SETUP_COMPLETE.md`
- **Backend Docs**: See `backend/README.md`
- **Frontend Build**: `npm run build` creates optimized build in `build/`

## ✅ Health Checklist

- [ ] PostgreSQL running
- [ ] `backend/.env.local` configured
- [ ] `npm run build` (frontend) = 0 errors
- [ ] `cd backend; npm run build` (backend) = 0 errors
- [ ] `npm run dev` (frontend) = http://localhost:3000 accessible
- [ ] `npm run dev` (backend) = http://localhost:3001/health works
- [ ] Can register user
- [ ] Can login with registered user
- [ ] Can create/read products

---

**Happy coding! 🚀**

For detailed setup, see `SETUP_COMPLETE.md`
