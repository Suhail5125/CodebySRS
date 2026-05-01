# CodebySRS Portfolio

A futuristic, full-stack developer portfolio with immersive 3D WebGL animations and a custom CMS admin panel.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Three.js / React Three Fiber
- **Backend**: Node.js + Express.js (serves both API and Vite dev middleware)
- **Database**: PostgreSQL via Drizzle ORM (Replit built-in database)
- **Auth**: Passport.js with session-based authentication
- **Shared code**: `/shared` directory with Zod schemas and TypeScript types

## Project Structure

```
client/      - React frontend (Vite root)
server/      - Express backend
shared/      - Shared schemas and types
dist/        - Production build output
uploads/     - File upload storage
```

## Development

The app runs as a single server (Express + Vite middleware) on port 5000.

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run db:push   # Sync Drizzle schema to database
npm run db:seed   # Seed database with initial data
```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (set automatically by Replit)
- `SESSION_SECRET` - Session secret (defaults to dev value; must be set for production)
- `PORT` - Server port (defaults to 5000)
- `NODE_ENV` - Environment (development/production)

## Deployment

Configured for autoscale deployment:
- Build: `npm run build`
- Run: `node dist/index.js`
