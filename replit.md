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

## Hero Section (Brutalist)

The homepage hero is a single-file brutalist composition in **`client/src/components/sections/hero-section.tsx`** (preserves the `(aboutInfo, isLoading)` contract and all `data-testid` hooks: `hero-name`, `hero-bio`, `button-lets-work-together`, `button-view-work`, `link-{label}`, `hero-stat-{label}`).

Visual language:
- **Palette**: BG `#0A0A0A`, INK `#F2EFE6`, ACCENT `#FF3D00`. No gradients, hard borders only.
- **Top status bar** with 1 Hz live clock (fixed `8ch` slot — no layout shift) and a square blinking status dot.
- **Asymmetric 12-col grid**: `col-span-2` aside (section index `01 / HERO` + manifesto rule + `BUILD SHARP. SHIP LOUD. CUT THE FLUFF.`) + `col-span-10` main column.
- **Massive headline** (`clamp(3.5rem, 11vw, 11rem)` Inter 800) with two block lines (`firstName` and an orange accent square + `lastName`) revealed via the safe `brut-fade` animation (animation `fill-mode: backwards` so content remains visible at its natural state if any animation fails).
- **Role cycler** in a fixed-width `ch` slot (no layout shift) cycling every 2.8 s.
- **Bio** with a vertical accent rule.
- **Hard-bordered `BrutButton`** (variants `solid` / `ghost`) with instant hover color invert (`transition: none`).
- **Full-width tech `Marquee`** (CSS-only, duplicated content + `translateX -50%` loop).
- **`Stat` cells** with `useCountUp` rAF hook in a 3-digit padded fixed slot (`tabular-nums`).
- **Bottom availability strip** with `LET'S WORK TOGETHER →` link.

All animations respect `prefers-reduced-motion` (CSS `@media` override forces opacity 1 + no transform). The `useNowEverySecond` hook ticks at 1 Hz only. The 3D vendor chunk dropped from ~256 kB → 0.49 kB gzip after this rewrite (Three.js / R3F are no longer imported by the hero).

Brutalist keyframes (`brut-rise`, `brut-fade`, `brut-marquee`, `brut-scan`, `brut-blink`) live in `client/src/index.css` under `@layer utilities`.
