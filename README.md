# PROODOS - Personal Learning Roadmap & Consistency Tracker

Proodos is a full-stack personal "Learning Operating System" that allows users to create custom roadmaps, track their learning sessions, and visualize consistency over time.

## 1. Project Structure

The project uses a monorepo setup configured via npm workspaces.

```text
proodos/
├── client/                 # React frontend (Vite, Tailwind v4, Redux)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (MainLayout, AuthLayout)
│   │   ├── pages/          # Page components (Dashboard, Roadmap, History)
│   │   ├── store/          # Redux store
│   │   └── index.css       # Tailwind configuration & global styles
│   └── package.json
├── server/                 # Node.js backend (Express, Prisma, PostgreSQL)
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── lib/            # Prisma client instance
│   │   ├── middleware/     # Auth and error handling middleware
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Helper classes
│   │   ├── validators/     # Zod schemas for input validation
│   │   └── server.ts       # Server entry point
│   ├── prisma/             # Prisma schema and seed script
│   └── package.json
├── docker-compose.yml      # Local development PostgreSQL setup
└── package.json            # Root workspace definitions & concurrent scripts
```

## 2. Database Schema Summary

The database uses PostgreSQL, managed via Prisma ORM.

- **User**: Authentication details (`id`, `name`, `email`, `passwordHash`).
- **Roadmap**: Top-level learning paths (`title`, `description`, `targetDate`, `status`).
- **Category**: Roadmap segments (`name`, `order`).
- **Skill**: Specific topics to learn (`title`, `status: NOT_STARTED | IN_PROGRESS | COMPLETED`, `order`).
- **LearningSession**: Tracked learning instances (`skillId`, `startedAt`, `endedAt`, `durationMinutes`, `notes`).
- **Goal**: User goals (`type`, `targetValue`, `deadline`, `status`).

## 3. API Endpoint Summary

### Auth
- `POST /api/auth/register` - Create an account
- `POST /api/auth/login` - Authenticate and get JWT cookie
- `POST /api/auth/logout` - Clear JWT cookie
- `GET /api/auth/me` - Get current user

### Roadmaps
- `GET /api/roadmaps` - List roadmaps
- `GET /api/roadmaps/:id` - Get roadmap with nested categories & skills
- `POST /api/roadmaps` - Create roadmap
- `PUT /api/roadmaps/:id` - Edit roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap

### Categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Skills
- `POST /api/skills` - Create skill
- `PUT /api/skills/:id` - Update skill
- `PATCH /api/skills/:id/status` - Mark skill status
- `DELETE /api/skills/:id` - Delete skill

### Learning Sessions
- `POST /api/learning/sessions` - Record a session
- `GET /api/learning/sessions` - List recent sessions

### Dashboard
- `GET /api/dashboard` - Get calculated stats (streak, heatmaps, target times)

## 4. Setup Instructions

Prerequisites: Node.js (v18+), npm workspaces support, and Docker (for PostgreSQL).

1. Clone or extract the `proodos` directory.
2. Run `npm install` at the root folder to install dependencies for both client and server.
3. Start the database using `docker-compose up -d`.

## 5. Environment Variables Required

Create `.env` inside `server/`:
```env
DATABASE_URL="postgresql://proodos_user:proodos_password@localhost:5432/proodos_dbs?schema=public"
PORT=3001
CLIENT_URL="http://localhost:5173"
JWT_SECRET="your_secret_key"
NODE_ENV="development"
```

## 6. How to Run Locally

1. Start PostgreSQL: `docker-compose up -d`
2. Push the Prisma Schema:
   ```bash
   cd server
   npx prisma db push
   # Optional: Seed the database
   npx ts-node prisma/seed.ts
   ```
3. Run the development servers concurrently from the root directory:
   ```bash
   npm run dev
   ```
   *(This requires you to add `"dev": "concurrently \"npm run dev -w server\" \"npm run dev -w client\""` to your root package.json)*. 
   Alternatively, open two terminals:
   - Terminal 1: `cd server && npm run dev`
   - Terminal 2: `cd client && npm run dev`

## 7. How to Run Tests

For backend testing (Jest + Supertest):
```bash
cd server
npm run test
```

## 8. How to Build for Production

1. **Build Backend**:
   ```bash
   cd server
   npm run build
   ```
   This transpiles the TypeScript code into the `server/dist` folder.

2. **Build Frontend**:
   ```bash
   cd client
   npm run build
   ```
   This builds an optimized production static bundle in `client/dist`.

## 9. Deployment Instructions

1. **Database**: Provision a managed PostgreSQL instance (e.g., Supabase, Neon, AWS RDS). Update `DATABASE_URL`.
2. **Backend**: Deploy the Node.js server to a platform like Render, Railway, or Heroku. Ensure `NODE_ENV=production` and `CLIENT_URL` matches the frontend domain. Run migrations using `npx prisma migrate deploy` on the remote database.
3. **Frontend**: Deploy the static `dist` folder to Vercel, Netlify, or Cloudflare Pages. Point API requests to the backend URL.
4. **Security**: Ensure cookies use `secure: true` in production (this is automatically handled if `NODE_ENV=production`).

## 10. Limitations & Future Improvements

- **Testing Coverage**: E2E and comprehensive testing could be expanded with Cypress or Playwright.
- **Complex Streaks**: The streak calculation is functional but naive for massive datasets; a cron job or materialized view could optimize this.
- **Pagination**: The learning history API limits to 50 records. Proper cursor-based pagination should be added for production scale.
- **Goals Module**: The backend schema supports Goals, but API endpoints for them can be built out following the pattern used for Roadmaps.
