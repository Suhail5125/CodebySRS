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

## Hero Section (Immersive 3D)

The homepage hero is a sci-fi holographic command-deck experience composed of:

- **`hero-section.tsx`** — main composition (preserves the `(aboutInfo, isLoading)` contract and all `data-testid` hooks).
- **`hero/scene.tsx`** — lazy-loaded R3F `<Canvas>` with: transmission-glass icosahedron core, hologram rings, drifting particles (`Stars` + `Sparkles`), companion form with `MeshDistortMaterial`, scrolling grid floor, cursor + scroll camera parallax, and an `EffectComposer` (Bloom + ChromaticAberration + Noise + Vignette).
- **`hero/hud.tsx`** — corner brackets, scanline sweep, "SYSTEM ONLINE" status panel with live FPS/uptime telemetry, looping typing terminal, and floating tech chips.
- **`hero/glitch-text.tsx`** — character-decode scramble-into-target effect for the headline and rotating role.
- **`hero/holo-button.tsx`** — glassy holographic CTA buttons with hover scanline sweep and corner brackets.
- **`hero/scene-boundary.tsx`** + **`hero/scene-css-fallback.tsx`** — WebGL detection + `componentDidCatch` boundary that swap in a pure-CSS holographic orb fallback when WebGL is unavailable (headless browsers, old devices).

All animations respect `prefers-reduced-motion`. On mobile (≤640px) the particle/star count drops, DPR is capped, the companion form is hidden, and HUD panels stack below the headline. The 3D bundle is split into `3d-vendor` (~256 kB gzip) via `vite.config.ts` and lazy-loaded with `React.lazy` + `Suspense`.

> **Compatibility**: requires `@react-three/fiber@^8`, `@react-three/drei@^9`, `@react-three/postprocessing@^2` (the v9/v10 lines require React 19; this project is on React 18).
