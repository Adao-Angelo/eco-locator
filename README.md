# Eco Locator

A Next.js application to manage and locate recycling points. Provides an admin dashboard to view statistics, an interactive map of points, filters, and a form to add new points.

Main goals:
- Register recycling points with accepted materials, contact info, opening hours and location.
- Visualize points on a map and filter by materials and status.
- Provide a simple admin dashboard to monitor metrics.

Status
- Implementation: functional (frontend)
- Tests: basic coverage using Vitest
- Deployment: ready for Vercel

Features
- Interactive list and map of recycling points
- Modal form to create points with validation
- Dashboard with statistic cards and materials distribution
- Minimal authentication (login)
- Simple unit tests with Vitest + Testing Library

Technologies
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Vitest + @testing-library/react
- Supabase (backend/services client included)
- lucide-react (icons)

Requirements
- Node.js 18+
- pnpm (recommended) / npm / yarn

Installation (example using pnpm)
```bash
pnpm install
```

Running in development
```bash
pnpm dev
# or
npm run dev
```

Build and production
```bash
pnpm build
pnpm start
```

Tests
```bash
pnpm exec vitest run
# watch mode
pnpm exec vitest --watch
```

Useful scripts (in `package.json`)
- dev — start development server
- build — create production build
- start — run production build
- test — run Vitest
- test:watch — run Vitest in watch mode

Applied best practices (summary)
- Small, reusable UI components in `components/ui/*`.
- Separation of concerns: custom hooks and business logic in `app/hooks` or `hooks/`.
- Explicit TypeScript types and use of `React.forwardRef` where applicable.
- Tests placed next to components for easy maintenance.
- Lightweight optimizations: `React.memo` for pure components and dynamic imports for heavy client-only modules (map) with `ssr: false`.

Project structure (high level)
- `app/` — routes and pages (Next.js App Router)
- `app/dashboard/_components` — dashboard components
- `components/ui` — shared UI components (Card, Button, Input, ...)
- `lib/` — utilities and services (e.g. Supabase client)
- Test files next to components or a `tests/` folder

Contribution guide
1. Create a feature branch from `main`.
2. Run linters and tests locally before committing.
3. Keep commits small and use clear commit messages.
4. Open a pull request describing your changes and any added tests.

Deployment
- Recommended platform: Vercel (default Next.js configuration works well).
- Ensure required environment variables are set in production (e.g. `SUPABASE_URL`, `SUPABASE_KEY`).

Quick tips
- Run `pnpm exec vitest --coverage` to see test coverage.
- Run linters and Prettier before commits.
- Keep components small and pure to make testing and maintenance easier.

License
- Add a LICENSE file and choose an appropriate license (e.g. MIT).

Contact
- Maintained by the project owner. Open an issue for bugs or feature requests.
