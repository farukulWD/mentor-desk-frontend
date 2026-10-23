# MentorDesk Frontend

Next.js app for students to submit projects and mentors to review them.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

App runs on http://localhost:3000. Start the backend (http://localhost:5001) first.

## Environment

| Variable | Example | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5001/api/v1` | Backend API base URL. |

## Accounts

- Students sign up at `/signup`.
- There is no mentor signup. Use the seeded mentor from the backend `.env` (`SEED_MENTOR_EMAIL` / `SEED_MENTOR_PASSWORD`), by default `mentor@mentordesk.dev` / `Mentor12345`.
