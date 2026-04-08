# Voting App — Backend

> **Learning Project**
> This project goes beyond the assignment requirements — intentionally. Every tech choice here is something I had not used before. The goal is to finish the assignment **and** build production-grade patterns at the same time, mapping each new tool back to real-world concepts like Clean Architecture, SOLID principles, and secure authentication.

A NestJS REST API for a quote voting application, built with production-grade patterns including Clean Architecture, httpOnly cookie auth, and refresh token rotation.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | NestJS | Enforces OOP, SOLID, and DI out of the box |
| ORM | TypeORM | Entity classes, repository pattern, migrations |
| Database | SQLite | Persistent, file-based, same SQL as Postgres |
| Auth | httpOnly cookie + refresh token | Secure against XSS, production-grade pattern |
| Validation | class-validator + class-transformer | DTO-based, auto-validated by NestJS pipe |
| Testing | Jest + Supertest | Unit + integration coverage |

## Project Setup

```bash
npm install
```

## Running the App

```bash
# development
npm run start:dev

# production
npm run start:prod
```

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (auto-login on success) |
| POST | `/auth/login` | Login → access token + httpOnly refresh cookie |
| POST | `/auth/refresh` | Issue new access token from refresh cookie |
| POST | `/auth/logout` | Revoke refresh token + clear cookie |

### Quotes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quotes` | List all quotes (supports search/sort/filter) |
| POST | `/quotes` | Create a new quote |
| PUT | `/quotes/:id` | Update a quote (owner only) |
| POST | `/quotes/:id/vote` | Vote on a quote (1 vote per user per quote) |

## Auth Flow

- **Access token** — short-lived (15 min), stored in memory, sent as `Authorization: Bearer`
- **Refresh token** — long-lived (7 days), stored in httpOnly cookie (XSS-immune)
- **Token rotation** — each refresh call issues a new RT and revokes the old one

## Folder Structure

```
server/src/
├── app.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/         ← jwt.strategy.ts, rt.strategy.ts
│   ├── guards/             ← jwt-auth.guard.ts, rt-auth.guard.ts
│   └── dto/                ← register.dto.ts, login.dto.ts
├── quotes/
│   ├── quotes.module.ts
│   ├── quotes.controller.ts
│   ├── quotes.service.ts
│   ├── quotes.repository.ts
│   └── dto/                ← create-quote.dto.ts, update-quote.dto.ts
├── entities/
│   ├── user.entity.ts
│   ├── quote.entity.ts
│   ├── vote.entity.ts
│   └── refresh-token.entity.ts
└── common/
    ├── interceptors/       ← transform.interceptor.ts
    └── filters/            ← http-exception.filter.ts
```

## API Testing with Bruno

This project uses [Bruno](https://www.usebruno.com/) as the API client for testing endpoints. The collection lives inside the repo at `bruno/voting-app/` and is version-controlled with git.

### Why Bruno over Postman

| | Postman | Bruno |
|---|---|---|
| Collection storage | Postman cloud | Plain files on your machine |
| Git-friendly | No — collections live in Postman's cloud, not your repo | Yes — commit and push with your code |
| Version history | No | Full git history — see exactly what changed and when |
| Offline | Limited (requires account) | Fully offline, no account needed |
| Free | Limited (team features paywalled) | Fully free and open source |

Storing the collection in the repo means anyone who clones the project gets all the API requests ready to use — no importing, no sharing links, no account required.

### Getting started with Bruno

1. Download Bruno at [usebruno.com](https://www.usebruno.com/)
2. Open Bruno → **Open Collection** → select `bruno/voting-app/`
3. Create an environment: **Environments** → **Create Environment** → name it `local`
4. Add a variable: `baseUrl` = `http://localhost:3001`
5. Set `local` as active
6. Start the server and run any request

## Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

```bash
# from voting-app/ root
docker-compose up --build
```

The server runs on port `3001`. SQLite data is persisted via a volume mount at `./server/data`.
