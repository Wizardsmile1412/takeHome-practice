# 🏗️ Architecture & Learning Plan

---

## 👨‍💻 Developer Profile

**Level:** Junior Full-Stack Developer  

**Goal:** Learn professional development with Clean Architecture principles

**How to help me:**

- ✅ Explain **why**, not just **how**
- ✅ Show patterns I can reuse
- ✅ Point out common mistakes
- ✅ Connect things back to SOLID principles
- ❌ Do not dump code without explanation
- ❌ Do not skip error handling

---

# Overview

This project is intentionally upgraded beyond the assignment requirements. Each tech choice maps to a real-world learning goal. The goal is to finish the assignment **and** build production-grade patterns at the same time.

---

# Tech stack (upgraded)

| Layer | Choice | Replaces | Why upgraded |
| --- | --- | --- | --- |
| Backend framework | NestJS | Express | Enforces OOP, SOLID, DI out of the box |
| ORM | TypeORM | Raw SQL | Entity classes, repository pattern, migrations |
| Database | SQLite | In-memory | Persistent, file-based, same SQL as Postgres |
| Auth | httpOnly cookie + refresh token | localStorage JWT | Secure against XSS, production-grade pattern |
| Frontend state | Zustand | useState | Scalable, minimal boilerplate |
| Theme | React Context + CSS variables | None | Persisted dark/light mode |
| Testing | Jest + Supertest | None | Unit + integration coverage |
| Validation | class-validator + class-transformer | Manual checks | DTO-based, auto-validated by NestJS pipe |

| Containerization | Docker + Docker Compose | Run locally only | Consistent environment, runs anywhere |
| --- | --- | --- | --- |

---

# Learning goals mapped to the project

## 1. NestJS — module system

Every feature is a self-contained **Module** with three layers:

- **Controller** — HTTP routing only, no logic
- **Service** — business logic only
- **Repository** — database queries only

Modules in this project:

```
AuthModule       → register, login, refresh, logout
QuotesModule     → CRUD, vote, search/filter/sort
UsersModule      → User entity, shared dependency
DatabaseModule   → TypeORM connection, shared globally
```

## 2. OOP + SOLID — concrete examples

| Principle | Concrete example in this project |
| --- | --- |
| **S** — Single Responsibility | `QuotesService` handles business rules only. `QuotesRepository` handles DB queries only. Never mix them. |
| **O** — Open/Closed | Add rate-limiting via `@UseGuards(RateLimitGuard)` on the vote endpoint — zero changes to existing service code |
| **L** — Liskov Substitution | `QuotesRepository` implements `IQuotesRepository`. In tests, swap with `MockQuotesRepository` — service never knows the difference |
| **I** — Interface Segregation | `IQuotesRepository` only exposes `findAll()`, `findById()`, `vote()` — not every possible DB method |
| **D** — Dependency Inversion | `QuotesService` receives `IQuotesRepository` via constructor injection — depends on abstraction, not concrete class |

## 3. SQLite via TypeORM — 4 entities

```tsx
// user.entity.ts
@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number
  @Column({ unique: true }) username: string
  @Column() hashedPassword: string
  @OneToMany(() => Vote, vote => vote.user) votes: Vote[]
  @OneToMany(() => RefreshToken, rt => rt.user) refreshTokens: RefreshToken[]
}

// quote.entity.ts
@Entity()
export class Quote {
  @PrimaryGeneratedColumn() id: number
  @Column() text: string
  @Column({ default: 0 }) voteCount: number
  @OneToMany(() => Vote, vote => vote.quote) votes: Vote[]
}

// vote.entity.ts — composite unique enforces 1 vote per user per quote
@Entity()
@Unique(['user', 'quote'])
export class Vote {
  @PrimaryGeneratedColumn() id: number
  @ManyToOne(() => User) user: User
  @ManyToOne(() => Quote) quote: Quote
}

// refresh-token.entity.ts
@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn() id: number
  @Column() token: string
  @Column() expiresAt: Date
  @Column({ default: false }) revoked: boolean
  @ManyToOne(() => User) user: User
}
```

## 4. httpOnly cookies + refresh tokens — auth flow

**Token strategy:**

- **Access token** — short-lived (15 min). Stored in Zustand memory. Sent as `Authorization: Bearer` header.
- **Refresh token** — long-lived (7 days). Stored in httpOnly cookie. JS cannot read it — immune to XSS.

**Endpoints:**

| Endpoint | What it does |
| --- | --- |
| `POST /auth/register` | Validate unique username → hash password → create user → auto-login |
| `POST /auth/login` | bcrypt compare → sign AT + RT → set httpOnly cookie |
| `POST /auth/refresh` | Read RT cookie → verify not revoked → issue new AT |
| `POST /auth/logout` | Revoke RT in DB → clear cookie |

**Silent refresh flow (Axios interceptor):**

1. API call returns 401 (access token expired)
2. Interceptor automatically calls `POST /auth/refresh`
3. Updates access token in Zustand store
4. Retries the original failed request — user never notices

## 5. React state management — Zustand

Two stores, cleanly separated:

```tsx
// useAuthStore.ts
{ accessToken, user, setTokens(), logout() }

// useQuotesStore.ts
{ quotes, setQuotes(), optimisticVote(id), revertVote(id) }
```

`optimisticVote` updates the local count immediately. If the API call fails, `revertVote` rolls it back.

## 6. Dark / light theme

One `ThemeContext` toggles `data-theme` on `<html>`. CSS variables respond to it. Preference saved in `localStorage`.

```css
:root[data-theme='light'] { --bg: #ffffff; --text: #1a1a1a; }
:root[data-theme='dark']  { --bg: #121212; --text: #e0e0e0; }
```

## 7. Testing strategy

| Test type | What to test | Tool |
| --- | --- | --- |
| Unit | `QuotesService.vote()` — throw if already voted, increment if not | Jest + mock repository |
| Unit | `AuthService.login()` — throw if wrong password, return tokens if correct | Jest + mock repository |
| Unit | `AuthService.register()` — throw 409 if username taken | Jest + mock repository |
| Integration (e2e) | `POST /quotes/:id/vote` — 200 first time, 403 second time | Supertest + test SQLite DB |
| Integration (e2e) | `POST /auth/refresh` — 200 with valid cookie, 401 with revoked token | Supertest |
| Integration (e2e) | `POST /auth/register` — 201 on success, 409 on duplicate username | Supertest |

> Do NOT test controllers directly (e2e covers that) or repositories (that's testing TypeORM itself).
> 

## 8. Register system (bonus)

Register slots into `AuthModule` and reuses `issueTokens()` from login — no duplication.

**Key logic in `AuthService.register()`:**

```tsx
async register(dto: RegisterDto) {
  const existing = await this.usersRepo.findByUsername(dto.username)
  if (existing) throw new ConflictException('Username already taken') // 409

  const hashedPassword = await bcrypt.hash(dto.password, 10)
  const user = await this.usersRepo.create({ username: dto.username, hashedPassword })

  return this.issueTokens(user) // reuse same logic as login()
}
```

**`RegisterDto` with `class-validator`:**

```tsx
export class RegisterDto {
  @IsString() @MinLength(3) @MaxLength(20)
  username: string

  @IsString() @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, { message: 'Need 1 uppercase + 1 number' })
  password: string
}
```

NestJS's `ValidationPipe` (registered globally in `main.ts`) auto-validates every request body and returns `400` with descriptive messages before your code even runs.

---

# Backend folder structure

```
server/src/
├── app.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts      ← POST /auth/register, /login, /refresh, /logout
│   ├── auth.service.ts         ← bcrypt, JWT, issueTokens(), register(), login()
│   ├── strategies/
│   │   ├── jwt.strategy.ts     ← validates access token
│   │   └── rt.strategy.ts      ← validates refresh token cookie
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── rt-auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
├── quotes/
│   ├── quotes.module.ts
│   ├── quotes.controller.ts    ← GET/POST/PUT /quotes, POST /quotes/:id/vote
│   ├── quotes.service.ts       ← business logic
│   ├── quotes.repository.ts    ← DB queries, implements IQuotesRepository
│   └── dto/
│       ├── create-quote.dto.ts
│       └── update-quote.dto.ts
├── entities/
│   ├── user.entity.ts
│   ├── quote.entity.ts
│   ├── vote.entity.ts
│   └── refresh-token.entity.ts
└── common/
    ├── interceptors/
    │   └── transform.interceptor.ts   ← standardize response shape
    └── filters/
        └── http-exception.filter.ts   ← standardize error shape
```

# Frontend folder structure

```
client/src/
├── api/
│   └── axios.ts               ← Axios instance + silent refresh interceptor
├── stores/
│   ├── useAuthStore.ts        ← Zustand: accessToken, user, login/logout
│   └── useQuotesStore.ts      ← Zustand: quotes, optimistic vote
├── context/
│   └── ThemeContext.tsx       ← dark/light toggle, localStorage persist
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── QuoteListPage.tsx
│   └── ChartPage.tsx
├── components/
│   ├── QuoteItem.tsx
│   ├── VoteButton.tsx
│   ├── QuoteForm.tsx
│   └── ThemeToggle.tsx
└── App.tsx
```

---

# Build order

## Week 1 — backend foundation

| Day | Task |
| --- | --- |
| Day 1 | NestJS setup, TypeORM + SQLite config, 4 entities |
| Day 2 | AuthModule — register, login, httpOnly cookie, refresh token, logout |
| Day 3 | QuotesModule — CRUD + vote endpoint, SOLID structure, DTOs |

## Week 2 — frontend + polish

| Day | Task |
| --- | --- |
| Day 4 | Zustand stores, Axios interceptor (silent refresh on 401), React Router |
| Day 5 | Login + Register pages, Quote list UI (react-window, search/sort/filter) |
| Day 6 | Theme (dark/light), Chart view (Recharts) |
| Day 7 | Unit tests (services), e2e tests (auth + vote endpoints) |
| Day 8 | README, cleanup, submission |

---

# 9. Docker

## Why Docker?

Without Docker, "it works on my machine" is a real problem. With Docker, you package the app + its environment together — anyone can run it with one command regardless of their OS or Node version.

**What you'll learn:**

- Writing a `Dockerfile` for a Node.js/NestJS app
- Writing a `Dockerfile` for a React/Vite app (multi-stage build)
- Orchestrating multiple containers with `docker-compose.yml`
- Environment variables in containers via `.env` files
- The difference between a development setup and a production build

## Project Docker structure

```
voting-app/
├── server/
│   └── Dockerfile          ← NestJS container
├── client/
│   └── Dockerfile          ← React (multi-stage: build + nginx serve)
└── docker-compose.yml      ← orchestrates both containers together
```

## `docker-compose.yml`

```yaml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - '3001:3001'
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    volumes:
      - ./server/data:/app/data    # persist SQLite file outside container

  client:
    build: ./client
    ports:
      - '5173:80'
    depends_on:
      - server
```

## NestJS `Dockerfile`

```docker
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## React `Dockerfile` (multi-stage)

```docker
# Stage 1 — build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Why multi-stage?** The builder stage needs Node.js and all dev dependencies to compile TypeScript and bundle assets. The final image only needs nginx to serve the static files. This keeps the production image small and lean — you don't ship your `node_modules` to production.

## Where Docker fits in the build order

Docker is a **Week 2, Day 8** task — add it after everything works locally. The mental model: get it working first, then containerize. Never try to debug application logic inside a container you don't fully understand yet.

---

# 9. Docker

## Why Docker?

Without Docker, "it works on my machine" is a real problem. With Docker, you package the app and its environment together — anyone can run it with one command regardless of their OS or Node version. This is a real-world skill every professional developer needs.

**What you'll learn:**

- Writing a `Dockerfile` for a NestJS app
- Writing a `Dockerfile` for React/Vite using a **multi-stage build**
- Orchestrating both containers with `docker-compose.yml`
- Passing environment variables into containers via `.env`
- The difference between a dev setup and a production build

## Project Docker structure

```
voting-app/
├── server/
│   └── Dockerfile          ← NestJS container
├── client/
│   └── Dockerfile          ← React (multi-stage: build + nginx)
└── docker-compose.yml      ← orchestrates both containers
```

## docker-compose.yml

```yaml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - '3001:3001'
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    volumes:
      - ./server/data:/app/data    # persist SQLite file outside container

  client:
    build: ./client
    ports:
      - '5173:80'
    depends_on:
      - server
```

## NestJS Dockerfile

```docker
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## React Dockerfile (multi-stage)

```docker
# Stage 1 — build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Why multi-stage?** The `builder` stage needs Node.js and all dev dependencies to compile TypeScript. The final image only needs nginx to serve static files. This keeps the production image tiny — you don't ship `node_modules` to production.

**SOLID connection:** The multi-stage Dockerfile is the Single Responsibility Principle applied to infrastructure — each stage does exactly one job.

## When to add Docker

Docker is a **Day 8** task. Always get the app working locally first, then containerize. Never debug application logic inside a container you don't yet understand.

---

# Key design decisions summary

- **Optimistic UI on vote** — update local count immediately, revert on error
- **Backend-first build order** — test all endpoints with Postman before touching React
- **`issueTokens()` shared method** — register and login both call the same token-signing logic
- **Guard on both layers** — check `voteCount = 0` before edit on frontend (disable button) AND backend (throw `ForbiddenException`) — defense in depth
- **No Redux** — Zustand is enough for this scope, avoid over-engineering
- **Access token in memory only** — never `localStorage`, disappears on refresh, silent refresh restores it
- **Refresh token rotation** — each refresh call issues a new RT and revokes the old one (prevents RT reuse attacks)