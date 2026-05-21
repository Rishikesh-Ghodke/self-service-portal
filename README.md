# Self Service Portal

Frontend-only internal IAM access management portal. Built with React, Vite, and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Click **Sign in with Google** (mock auth).

## Tech stack

- React (JavaScript)
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- React Hook Form
- Lucide React
- date-fns

## Project structure

```
src/
  api/           # Axios clients — swap mocks for real REST
  components/    # Reusable UI
  constants/     # Routes, statuses, config
  hooks/         # Auth, toast, debounce, polling
  layouts/       # App shell
  mocks/         # Mock JSON data
  pages/         # Route pages
  utils/         # Formatting, filtering, CSV export
```

## API-ready endpoints

Designed for a Node.js + Express backend:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/auth/me` | Current user |
| POST | `/auth/google` | Sign in |
| POST | `/auth/logout` | Sign out |
| GET | `/projects` | List GCP projects |
| GET | `/projects/:id/roles` | Roles for project |
| POST | `/requests` | Create access request |
| GET | `/requests` | List/filter requests |
| GET | `/access` | Current access mappings |

Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` in `.env` when the backend is ready.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run preview` — preview production build
# self-service-portal
