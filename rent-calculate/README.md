# Rental Dashboard

A responsive rental property dashboard built with React + TypeScript. Browse, filter, and sort 1,000 properties with smooth performance using virtualized rendering.

This project was built to practice and learn **react-window** (virtualized list rendering) and **Docker** (containerized deployment with multi-stage builds).

**[Live Demo](https://your-vercel-url.vercel.app)**

---

## Features

- Filter by price range, bedrooms, and available month
- Sort by price or available date (ascending/descending)
- Virtualized list rendering for O(1) performance regardless of dataset size
- Paginated view as an alternative rendering strategy
- Property detail modal with keyboard (`Escape`) and backdrop click support
- Responsive layout — mobile-first with collapsible filter panel
- Empty state, loading state, and accessible filter controls

---

## How to Run Locally

```bash
git clone <repo-url>
cd rent-calculate
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Run with Docker

```bash
docker build -t rental-dashboard .
docker run -p 8080:80 rental-dashboard
```

App runs at `http://localhost:8080`

The Docker setup uses a **multi-stage build** — Stage 1 builds the app with Node, Stage 2 serves the static output with Nginx. This keeps the final image small by not including Node or source files in production.

---

## Architecture Decisions

**Virtualized list with `react-window`**
Used `FixedSizeList` to render only the visible rows regardless of dataset size. Scrolling through 1,000 items costs the same as scrolling through 10 — O(1) DOM nodes at any time.

**Centralized filter/sort logic in `usePropertyFilters`**
All filtering and sorting lives in a single custom hook. Components just consume the output — they don't know how filtering works. This makes the logic independently testable and easy to swap out.

**Debounced price inputs via `onBlur`**
Price filter only applies when the user leaves the input field, preventing excessive re-renders on every keystroke.

**`useMemo` for filtered results**
The filtered and sorted property list is memoized — it only recalculates when filters, sort order, or the source data changes.

**Pagination as a Strategy Pattern**
Both `PropertyList` (virtualized) and `Pagination` accept the same `properties` prop. The `usePropertyFilters` hook doesn't care which renderer is active — only the rendering strategy changes, not the data layer. This demonstrates the Open/Closed Principle.

**Mobile-first responsive layout**
Filter panel collapses on mobile with an animated slide using `max-h` + `opacity` CSS transitions. On desktop it's always visible as a sidebar.

---

## Trade-offs & What I'd Improve

- **Tests** — with more time I'd add unit tests for `usePropertyFilters` with React Testing Library and cover edge cases like empty datasets and boundary price values
- **URL-based filter state** — storing filters in query params (`?bedrooms=2&minPrice=10000`) would let users share filtered views via URL
- **Real data** — the current dataset is generated locally; a real API with server-side filtering and pagination would be needed at scale
- **Image optimization** — property images are loaded with `loading="lazy"` but a real app would use optimized formats (WebP) and a CDN
