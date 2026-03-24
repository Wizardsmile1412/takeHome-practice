# TakeHome Practice

A collection of take-home assignments used as vehicles for building **production-grade habits** — not just solving the problem, but applying real-world patterns while doing it.

Each assignment is a small, focused project where the goal is to finish the task **and** practice:

- Clean Architecture / layered design
- SOLID principles
- Secure authentication patterns
- Familiarity with new stacks or frameworks

---

## Philosophy

> Finish the assignment. Build it the right way.

Take-home problems are intentionally constrained — small scope, clear requirements. That constraint makes them ideal for mapping each new tool or framework back to production concepts without the noise of a real codebase.

---

## Projects

| # | Project | Stack | Concepts Practiced |
|---|---------|-------|--------------------|
| 1 | [blood-expire](./blood-expire/) | TypeScript | Pure functions, filtering & sorting logic |
| 2 | [pump-selection](./pump-selection/) | TypeScript | Map data structure, optimization logic |
| 3 | [filter-age](./filter-age/) | TypeScript | Data transformation, grouping |
| 4 | [rent-calculate](./rent-calculate/) | React + TypeScript + Tailwind + Vite | Component architecture, custom hooks, virtualization, Docker |
| 5 | [voting-app](./voting-app/) | NestJS (in progress) | REST API, Clean Architecture, auth |

---

## Projects In Detail

### blood-expire
Blood bank matching system. Selects blood bags by group compatibility, availability, and expiry window (7 days), sorted by urgency.

**Patterns:** Pure function design, single responsibility, explicit business rules.

---

### pump-selection
Industrial pump selector. Filters by flow rate, head, and efficiency — then picks lowest power consumption from eligible candidates.

**Patterns:** Strategy filtering, optimization as a separate step, Map usage for O(1) lookups.

---

### filter-age
User age-grouping utility. Categorizes people into teen / adult / senior brackets, excluding out-of-range ages.

**Patterns:** Data transformation pipeline, separation of categorization logic from output structure.

---

### rent-calculate
Responsive rental property dashboard with 1,000 mock properties.

**Features:** Filter by price, bedrooms, available month — sort by price or date — virtualized list (react-window) — property detail modal — Docker-ready.

**Patterns:** Custom hook for centralized filter/sort logic, memoized derived state, Strategy Pattern (virtualized vs paginated view), multi-stage Docker build.

**Live demo:** https://take-home-practice.vercel.app

---

### voting-app *(in progress)*
Full-stack voting application.

**Target stack:** NestJS (backend)

**Target patterns:** Clean Architecture (Controllers → Use Cases → Domain), SOLID, secure JWT authentication.

---

## Running a Project

Each project is self-contained. Navigate into the folder and follow its own setup:

```bash
# TypeScript assignments (no build step needed)
cd blood-expire
npx ts-node blood-expire-improve.ts

# React app
cd rent-calculate
npm install
npm run dev

# Docker (rent-calculate)
docker build -t rental-dashboard .
docker run -p 8080:80 rental-dashboard
```

---

## Patterns Reference

| Pattern | Where Applied |
|---------|---------------|
| Pure functions | blood-expire, pump-selection, filter-age |
| Custom hooks (React) | rent-calculate — `usePropertyFilters` |
| Virtualized rendering | rent-calculate — `react-window` |
| Multi-stage Docker build | rent-calculate |
| Clean Architecture | voting-app (planned) |
| SOLID principles | voting-app (planned) |
| Secure auth (JWT) | voting-app (planned) |
