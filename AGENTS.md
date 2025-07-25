# AGENTS.md - Development Guidelines

## Build/Lint/Test Commands
- Build: `pnpm build` (builds both frontend and backend)
- Dev: `pnpm dev` (runs both frontend and backend in dev mode)
- Lint: `pnpm lint` or `pnpm lint:fix` (ESLint for entire project)
- Format: `pnpm prettify` (Prettier formatting)
- Backend build: `cd backend && pnpm build` (TypeScript compilation)
- Frontend build: `cd frontend && pnpm build` (Nuxt build)
- Tests: Currently no test setup (shows "Error: no test specified")

## Code Style
- **Imports**: Use ES6 imports, group by external/internal, 'dotenv/config' and 'reflect-metadata' first in backend
- **Formatting**: Prettier with single quotes, semicolons, trailing commas, 80 char line width
- **Types**: TypeScript strict mode, use explicit types for exports, avoid `@ts-ignore` where possible
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces/components
- **Error Handling**: Try-catch blocks with development vs production error responses
- **Vue**: Composition API with `<script setup>`, TypeScript, ref/reactive for state
- **Backend**: Express controllers with async/await, proper error responses with status codes
- **Database**: Kysely for SQL, camelCase columns via kysely-codegen

## Structure
- Monorepo with pnpm workspaces (backend/, frontend/)
- Backend: Express + TypeScript + Kysely
- Frontend: Nuxt 3 + Vue 3 + PrimeVue + TypeScript