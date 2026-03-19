# 🏠 Rental Property Listing Dashboard — Detailed Plan

---

## 👨‍💻 Developer Profile

**Level**: Junior Full-Stack Developer  
**Goal**: Learn professional development with Clean Architecture principles

**How to Help Me**:
- ✅ Explain WHY, not just HOW
- ✅ Show me patterns I can reuse
- ✅ Point out common mistakes
- ✅ Connect to SOLID principles
- ❌ Don't just dump code without explanation
- ❌ Don't skip error handling

---

## Project Overview

**Assignment:** Build a rental property listing dashboard with virtualized rendering, filtering, sorting, responsive design, and bonus features (modal detail view + pagination fallback).

**Tech Stack:** React + TypeScript + Tailwind CSS + react-window + Vite

**Approach:** Mobile-first responsive design

**Timeline:** 3 working days (~15–18 hours total)

---

## Architecture Overview

> **🧠 WHY this structure?** This folder structure follows the **Single Responsibility Principle (SRP)** from SOLID — each folder and file has ONE clear job. `components/` handles UI rendering, `hooks/` handles business logic, `types/` handles data contracts, and `utils/` handles reusable helpers. When your evaluator opens your project, they should immediately understand where to find things. This is the same separation-of-concerns thinking you'll use in Clean Architecture on the backend.

> **🔁 Reusable Pattern: Feature-Based Folder Structure**  
> For small projects, this flat structure works great. As projects grow, you'd evolve to feature-based folders (e.g., `features/property/`, `features/filters/`). Knowing when to switch is a sign of engineering maturity.

```
src/
├── components/
│   ├── PropertyCard.tsx        # Individual property card (UI only, no logic)
│   ├── PropertyList.tsx        # Virtualized list using react-window
│   ├── Filters.tsx             # All filter controls (UI only)
│   ├── SortControls.tsx        # Sort dropdown/buttons (UI only)
│   ├── PropertyModal.tsx       # Detail modal (Bonus)
│   ├── Pagination.tsx          # Pagination fallback (Bonus)
│   └── EmptyState.tsx          # No results message
├── hooks/
│   └── usePropertyFilters.ts   # Business logic: filter + sort (separated from UI)
├── data/
│   └── generateProperties.ts   # Data layer: mock data generation
├── types/
│   └── property.ts             # Data contracts / interfaces
├── utils/
│   └── formatters.ts           # Pure functions: price formatting, date helpers
├── App.tsx                     # Composition root: wires everything together
├── main.tsx
└── index.css                   # Tailwind directives
```

---

## Day 1 — Foundation & Data (~5–6 hours)

### Block 1: Project Setup (~1.5 hrs)

**Goal:** Working project with all dependencies installed and folder structure ready.

**Steps:**

1. Initialize project:
   ```bash
   npm create vite@latest rental-dashboard -- --template react-ts
   cd rental-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install react-window @faker-js/faker
   npm install -D tailwindcss @tailwindcss/vite @types/react-window
   ```

3. Configure Tailwind CSS (follow Tailwind v4 + Vite setup docs).

4. Create the folder structure as shown in the Architecture section above.

5. Define TypeScript interfaces in `types/property.ts`:

   > **🧠 WHY TypeScript interfaces?** This is the **Dependency Inversion Principle (DIP)** in action — your components depend on an *abstraction* (the `Property` interface), not on a *concrete* data source. Tomorrow, if you swap Faker.js for a real API, your components don't change at all. Only the data layer changes. This is exactly how Clean Architecture works on the backend too.

   ```typescript
   export interface Property {
     id: number;
     image: string;
     title: string;
     location: string;
     price: number;
     bedrooms: number;
     bathrooms: number;
     availableDate: string; // ISO date string
     description?: string;  // For modal detail view
   }
   ```

   > **⚠️ Common Mistake:** Don't use `any` type anywhere. It defeats the purpose of TypeScript. If you're unsure of a type, use `unknown` and narrow it down — this forces you to handle types properly.

   > **⚠️ Common Mistake:** Don't use `Date` object for `availableDate`. JSON doesn't serialize `Date` objects natively. Use ISO string (`"2025-09-01"`) and parse only when needed for display or comparison.

6. Initial commit: `git commit -m "feat: project setup with Vite, React, TS, Tailwind"`

---

### Block 2: Generate Mock Data (~1 hr)

**Goal:** 1,000+ realistic Thai rental properties generated with Faker.js.

**Steps:**

1. Create `data/generateProperties.ts` using `@faker-js/faker`.

2. Data specifications:
   - **Locations:** Array of real Thai areas — Sukhumvit, Silom, Ari, Thonglor, Chiang Mai Old City, Phuket Town, Hua Hin, Pattaya, Khon Kaen, etc.
   - **Titles:** Template-based — e.g., "Modern {bedrooms}BR Condo in {location}", "Cozy Studio near {landmark}"
   - **Prices:** Range 5,000–80,000 ฿ (weighted: more in 8,000–25,000 range for realism)
   - **Bedrooms:** 1–5 (weighted: more 1–2 BR)
   - **Bathrooms:** 1–3 (correlated with bedrooms)
   - **Available dates:** Spread across next 6 months from today
   - **Images:** `https://placehold.co/600x400?text=Property+{id}`
   - **Descriptions:** 2–3 sentences about the property for the modal view

3. Generate data once and export as a constant (not re-generated on every render).

   > **🧠 WHY generate once?** If you call `generateProperties()` inside a component, it runs on every re-render — creating 1,000 objects each time. By generating once at module level and exporting the result, it runs exactly once when the module loads. This is a fundamental performance principle: **avoid unnecessary work in the render path.**

   > **⚠️ Common Mistake:** Don't put data generation inside `useState` initializer like `useState(generateProperties())`. The function call syntax `()` means it executes every render. Use the lazy initializer form instead: `useState(() => generateProperties())` — the arrow function ensures it runs only once.

4. Commit: `git commit -m "feat: generate 1,000 mock properties with faker"`

---

### Block 3: Learn react-window (~1.5 hrs)

**Goal:** Understand virtualization concept and `FixedSizeList` API.

**Key Concept:** Normal rendering creates 1,000 DOM nodes (slow). Virtualization renders only ~10–15 visible items and recycles them on scroll (fast).

> **🧠 WHY virtualization matters?** The browser's DOM is expensive. Each DOM node costs memory and CPU for layout, painting, and event handling. With 1,000 cards, you might have 10,000+ DOM nodes (each card has image, text, icons...). The browser slows down because it has to manage ALL of them even though the user only sees ~5-10 at a time. `react-window` solves this by using a technique called **"windowing"** — it only creates DOM nodes for visible items and repositions them as you scroll using CSS transforms. Think of it like a conveyor belt: items move into and out of view, but there are only ever a few items on the belt.

> **🔁 Reusable Pattern: Virtualization**  
> This same pattern exists everywhere in software: database pagination (don't load all rows), lazy loading images (don't download all images), streaming APIs (don't buffer everything in memory). The principle is always the same: **only process what's needed right now.**

**What to study:**

1. Read the react-window GitHub README: https://github.com/bvaughn/react-window
2. Understand `FixedSizeList` props:
   - `height` — viewport height (px)
   - `width` — viewport width
   - `itemCount` — total number of items
   - `itemSize` — height of each row (px)
   - Children render function: `({ index, style }) => ...`

3. **Critical rule:** You MUST apply the `style` prop from react-window to the outer wrapper of each item. This is how react-window positions items via `transform: translateY(...)`.

   > **⚠️ Common Mistake #1 — Forgetting the `style` prop:** If you don't apply `style` to the wrapper div, all items stack at position 0 and overlap. This is the #1 beginner mistake with react-window.

   > **⚠️ Common Mistake #2 — Adding margin to cards:** Don't use `margin` on your PropertyCard inside the virtualized list. react-window calculates positions based on `itemSize` and doesn't account for margins. Use `padding` inside the style wrapper instead:
   > ```tsx
   > {({ index, style }) => (
   >   <div style={style}>
   >     <div className="p-2">  {/* ← padding, not margin */}
   >       <PropertyCard property={properties[index]} />
   >     </div>
   >   </div>
   > )}
   > ```

4. Basic pattern:
   ```tsx
   import { FixedSizeList } from 'react-window';

   <FixedSizeList
     height={600}
     itemCount={properties.length}
     itemSize={280}
     width="100%"
   >
     {({ index, style }) => (
       <div style={style}>
         <PropertyCard property={properties[index]} />
       </div>
     )}
   </FixedSizeList>
   ```

5. **Tip:** Wrap `FixedSizeList` in an `AutoSizer` (from `react-virtualized-auto-sizer`) to make it fill available space dynamically — consider installing this package.

---

### Block 4: Build PropertyCard + Basic List (~1.5 hrs)

**Goal:** Virtualized list rendering 1,000 properties smoothly.

**Steps:**

1. Build `PropertyCard.tsx` with Tailwind:
   - Property image (with lazy loading: `loading="lazy"`)
   - Title and location
   - Price badge (formatted with ฿ and comma separators)
   - Bedroom/bathroom count with icons
   - Available date (formatted nicely, e.g., "Available Sep 2025")

2. Build `PropertyList.tsx`:
   - Import `FixedSizeList` from react-window
   - Pass the properties array and render `PropertyCard` for each index
   - Set `itemSize` based on card height (measure in browser DevTools)

3. Wire up in `App.tsx` — import generated data, pass to list.

4. **Test performance:**
   - Open Chrome DevTools → Performance tab → Record while scrolling
   - FPS should stay near 60fps
   - DOM node count should stay low (~50 nodes, not 1,000+)

5. Commit: `git commit -m "feat: virtualized property list with react-window"`

### ✅ Day 1 Deliverable
Virtualized list of 1,000 properties scrolling smoothly with styled property cards.

---

## Day 2 — Filters, Sorting & Responsive (~5–6 hours)

### Block 1: Filter Logic — Custom Hook (~2 hrs)

**Goal:** Centralized, performant filter + sort logic in a custom hook.

> **🧠 WHY a custom hook?** This is the **Single Responsibility Principle (SRP)** applied to React. Your `Filters.tsx` component should ONLY handle rendering filter UI controls. Your `PropertyList.tsx` should ONLY handle rendering the list. Neither should contain filtering *logic*. The custom hook `usePropertyFilters` owns all the business logic — filtering, sorting, and state management. This separation means:
> 1. You can test the filtering logic independently (without rendering any UI)
> 2. You can swap the UI library without touching logic
> 3. You can reuse the hook in a different page/view
>
> This is the same thinking behind Clean Architecture's "Use Cases" layer — logic that's independent of the delivery mechanism (UI, API, CLI).

> **🔁 Reusable Pattern: Custom Hooks for Business Logic**  
> Whenever you find logic creeping into your components (filtering, validation, API calls, form handling), extract it into a custom hook. Pattern: `useXxx` returns `{ data, actions, state }`. Your components become thin UI shells that just render what the hook provides.

**Steps:**

1. Create `hooks/usePropertyFilters.ts`:
   ```typescript
   interface FilterState {
     minPrice: number;
     maxPrice: number;
     bedrooms: number | null;     // null = all
     availableMonth: string | null; // null = all, format: "2025-09"
   }

   type SortOption = 'price-asc' | 'price-desc' | 'date-asc' | 'date-desc';
   ```

2. **Use `useMemo`** for filtered + sorted results — this is critical for performance:

   > **🧠 WHY `useMemo` here?** Without `useMemo`, every time ANY state changes (even unrelated ones like opening a modal), React re-runs the component function. That means filtering and sorting 1,000 items on every single re-render — even when the filters haven't changed. `useMemo` caches the result and only recalculates when its dependencies (`properties`, `filters`, `sortBy`) actually change. This is called **memoization** — a fundamental optimization technique you'll use everywhere.

   > **⚠️ Common Mistake:** Don't chain `.filter().filter().filter().sort()` on the original array like the example below — it creates 3 intermediate arrays. For 1,000 items this is fine, but it's good practice to combine filters into a single `.filter()` pass when possible. I'm showing the chained version here for readability, but know the trade-off.

   ```typescript
   const filteredProperties = useMemo(() => {
     return properties
       .filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)
       .filter(p => filters.bedrooms ? p.bedrooms === filters.bedrooms : true)
       .filter(p => {
         if (!filters.availableMonth) return true;
         return p.availableDate.startsWith(filters.availableMonth);
       })
       .sort((a, b) => {
         switch (sortBy) {
           case 'price-asc': return a.price - b.price;
           case 'price-desc': return b.price - a.price;
           case 'date-asc': return new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime();
           case 'date-desc': return new Date(b.availableDate).getTime() - new Date(a.availableDate).getTime();
           default: return 0;
         }
       });
   }, [properties, filters, sortBy]);
   ```

   > **⚠️ Common Mistake:** `.sort()` mutates the original array! In React, mutating state leads to bugs where the UI doesn't update. The `.filter()` before `.sort()` already creates a new array, so we're safe here. But if you ever sort without filtering first, use `[...array].sort()` to sort a copy.

3. Return `{ filteredProperties, filters, setFilters, sortBy, setSortBy, totalCount }`.

---

### Block 2: Filter UI Components (~1 hr)

**Goal:** Intuitive filter controls.

**Steps:**

1. **Price range:** Two number inputs (Min ฿ / Max ฿)
   - Add debounce (300ms) so filtering doesn't happen on every keystroke
   - Default: min=0, max=80000

   > **🧠 WHY debounce?** When a user types "15000" in the price input, it fires 5 change events: "1", "15", "150", "1500", "15000". Without debounce, you re-filter 1,000 items 5 times in rapid succession. Debounce waits until the user *stops typing* for 300ms, then fires once. This is a **rate-limiting pattern** you'll use everywhere — API calls, search inputs, window resize handlers.

   > **🔁 Reusable Pattern: Debounce**  
   > You can write a simple `useDebounce` hook that works for any value:
   > ```typescript
   > function useDebounce<T>(value: T, delay: number): T {
   >   const [debouncedValue, setDebouncedValue] = useState(value);
   >   useEffect(() => {
   >     const timer = setTimeout(() => setDebouncedValue(value), delay);
   >     return () => clearTimeout(timer); // ← cleanup prevents memory leaks
   >   }, [value, delay]);
   >   return debouncedValue;
   > }
   > ```
   > This hook is reusable across any project. Save it in your personal toolkit.

2. **Bedrooms:** Button group — "All", "1", "2", "3", "4+"
   - Highlight the selected option with Tailwind active state

3. **Available month:** `<select>` dropdown
   - Options: "All months" + next 6 months (dynamically generated)
   - Format: "September 2025", "October 2025", etc.

4. **Result count:** Display "Showing X of 1,000 properties" above the list.

5. **Reset button:** "Clear all filters" to reset everything.

6. Commit: `git commit -m "feat: filter controls with price, bedrooms, available month"`

---

### Block 3: Sorting Controls (~30 min)

**Goal:** Sort properties by price or availability date.

**Steps:**

1. Build `SortControls.tsx`:
   - Dropdown or segmented button group
   - Options: "Price: Low → High", "Price: High → Low", "Available: Soonest", "Available: Latest"

2. Wire into the custom hook's `setSortBy`.

3. Commit: `git commit -m "feat: sorting by price and available date"`

---

### Block 4: Responsive Design (~1.5 hrs)

**Goal:** Clean layout on both mobile and desktop.

> **🧠 WHY mobile-first?** Three reasons: (1) Tailwind's breakpoints (`sm:`, `md:`, `lg:`) are min-width based — they're literally designed for mobile-first. Going desktop-first means fighting the framework. (2) Designing for small screens first forces you to prioritize essential content — this produces better UX on all screens. (3) It's the industry standard approach, and evaluators will recognize it as professional practice.

> **🔁 Reusable Pattern: Progressive Enhancement**  
> Mobile-first is an instance of the broader **Progressive Enhancement** pattern — start with the simplest version that works, then layer on enhancements for more capable environments. You'll see this pattern in backend development too: build the basic API first, then add caching, then add rate limiting, etc.

**Mobile (default):**
- Full-width property cards in a single column
- Filters stacked vertically at the top, or in a collapsible drawer (tap "Filters" button to expand)
- Sort dropdown above the list

**Desktop (md: breakpoint and up):**
- Sidebar for filters (left side, ~280px wide)
- Property list takes remaining width
- Cards can be wider with horizontal layout (image left, details right)

**Implementation tips:**
- Use Tailwind breakpoints: `md:`, `lg:`
- Layout: `flex flex-col md:flex-row`
- Filter panel: `w-full md:w-72 md:sticky md:top-0`
- Test with Chrome DevTools device toolbar (iPhone SE, iPad, Desktop)

**Commit:** `git commit -m "feat: responsive layout for mobile and desktop"`

### ✅ Day 2 Deliverable
Fully functional filtering, sorting, and responsive design across devices.

---

## Day 3 — Bonuses, Polish & Ship (~5–6 hours)

### Block 1: Property Detail Modal — Bonus (~1.5 hrs)

**Goal:** Click a property card to see full details in a modal.

> **🧠 WHY handle keyboard events and scroll lock?** Accessibility isn't optional — it's professional engineering. A modal that can't be closed with Escape, or that allows background scrolling, feels broken. These details separate junior-level work from professional-level work. Evaluators notice.

> **🔁 Reusable Pattern: Portal + Escape + Click-Outside**  
> Almost every modal you'll ever build needs these three things. Extract them into a reusable `Modal` wrapper component. You'll use this pattern in every project.

**Steps:**

1. Build `PropertyModal.tsx`:
   - Larger property image
   - Full title, location, price
   - Bedroom/bathroom details
   - Description text
   - Available date
   - Close button (X) in top-right corner

2. Features:
   - Close on `Escape` key press
   - Close on backdrop click (clicking outside the modal)
   - Prevent body scroll when modal is open (`overflow: hidden` on body)
   - Smooth fade-in animation with Tailwind transitions

3. Wire up: clicking `PropertyCard` sets `selectedProperty` state, which opens the modal.

   > **⚠️ Common Mistake:** Don't forget to clean up the `useEffect` for keyboard events. If you add an event listener for `Escape` key but don't return a cleanup function, you'll create a memory leak — the listener stays attached even after the modal unmounts:
   > ```typescript
   > useEffect(() => {
   >   const handleEsc = (e: KeyboardEvent) => {
   >     if (e.key === 'Escape') onClose();
   >   };
   >   document.addEventListener('keydown', handleEsc);
   >   return () => document.removeEventListener('keydown', handleEsc); // ← ALWAYS clean up
   > }, [onClose]);
   > ```

   > **⚠️ Common Mistake:** Don't forget to handle the case where `selectedProperty` is `null`. Always guard your modal render:
   > ```tsx
   > {selectedProperty && <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />}
   > ```

4. Commit: `git commit -m "feat: property detail modal with keyboard support"`

---

### Block 2: Pagination Fallback — Bonus (~1 hr)

**Goal:** Alternative paginated view as a fallback option.

> **🧠 WHY offer both approaches?** This demonstrates the **Open/Closed Principle (OCP)** — your app is open for extension (new rendering strategies) without modifying existing code. Your `usePropertyFilters` hook doesn't care whether the output goes to a virtualized list or a paginated view. The data flows the same way; only the rendering changes. This shows evaluators you think in abstractions, not just implementations.

> **🔁 Reusable Pattern: Strategy Pattern**  
> Having interchangeable rendering strategies (virtualized vs paginated) is an example of the **Strategy Pattern**. The same data is presented differently based on user preference. In backend development, you'd see this with different storage strategies (cache vs database) or different notification channels (email vs SMS).

**Steps:**

1. Add a toggle in the UI: "Virtualized List" / "Paginated View"

2. Build `Pagination.tsx`:
   - Show 20 items per page
   - Previous / Next buttons
   - Page indicator: "Page 3 of 50"
   - Disable Previous on page 1, disable Next on last page

3. When paginated mode is active, render a normal mapped list instead of `FixedSizeList`.

4. **Why this matters:** Shows the evaluator you understand trade-offs between different rendering strategies and can implement both.

5. Commit: `git commit -m "feat: pagination fallback as alternative to virtualization"`

---

### Block 3: Polish & Edge Cases (~1.5 hrs)

**Goal:** Professional-quality UX touches.

**Steps:**

1. **Empty state:** When filters return 0 results:
   - Friendly message: "No properties match your filters"
   - "Reset filters" button
   - Don't show a blank screen

2. **Loading state:** Brief skeleton or spinner on initial load (even if data is instant, it shows you think about loading states).

3. **Number formatting:**
   - Price: `฿18,000/month`
   - Date: "Available Sep 1, 2025"

4. **Accessibility basics:**
   - Proper `aria-label` on filter controls
   - Focus visible outlines on interactive elements
   - Semantic HTML (`<main>`, `<aside>`, `<button>`)

5. **Small UX wins:**
   - Hover effect on property cards (subtle shadow or scale)
   - Smooth transitions on filter panel open/close (mobile)
   - Consistent spacing and color palette

6. Commit: `git commit -m "fix: polish UI, add empty state, loading state, a11y"`

---

### Block 4: README & Deployment (~1.5 hrs)

**Goal:** Professional documentation and a live demo link.

#### README.md should include:

1. **Title + Screenshot/GIF** (use a screen recording tool to capture a GIF)

2. **Live Demo Link** (Vercel URL)

3. **How to run locally:**
   ```bash
   git clone <repo-url>
   cd rental-dashboard
   npm install
   npm run dev
   ```

4. **Architecture Decisions** (evaluators love this):
   - "Used `FixedSizeList` from react-window for O(1) rendering regardless of dataset size"
   - "Centralized filter/sort logic in a custom hook (`usePropertyFilters`) for separation of concerns and testability"
   - "Debounced price inputs to prevent excessive re-renders during typing"
   - "Mobile-first responsive approach since Tailwind's breakpoints are min-width based"
   - "Used `useMemo` to memoize filtered results, preventing unnecessary recalculations"

5. **Trade-offs & What I'd Improve:**
   - "With more time, I'd add unit tests with React Testing Library"
   - "Would implement URL-based filter state so users can share filtered views"
   - "Would add image lazy loading with Intersection Observer"
   - "Would consider `react-window`'s `VariableSizeList` for cards with dynamic content heights"

#### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```
Follow the prompts — you'll get a live URL in ~60 seconds.

**Final commit:** `git commit -m "docs: add comprehensive README with architecture decisions"`

### ✅ Day 3 Deliverable
Complete, polished app with both bonuses, deployed on Vercel, with professional documentation.

---

## Key Performance Patterns to Use

> **🧠 WHY care about performance in a take-home?** Two reasons: (1) The assignment explicitly tests performance with react-window — they want to see you think about it. (2) These patterns transfer directly to backend development. Memoization = caching. Debounce = rate limiting. Lazy loading = pagination. Understanding these concepts at the frontend level makes you a stronger full-stack developer.

| Pattern | Where | Why | Backend Equivalent |
|---|---|---|---|
| `useMemo` | Filter + sort logic | Prevents recalculation on unrelated re-renders | Redis/in-memory caching |
| `useCallback` | Event handlers passed to child components | Prevents unnecessary child re-renders | Reusing DB connections |
| `React.memo` | `PropertyCard` component | Skips re-render if props haven't changed | HTTP ETag / 304 Not Modified |
| `loading="lazy"` | Property images | Defers off-screen image loading | Lazy loading in ORMs |
| Debounce | Price input filters | Avoids filtering on every keystroke | API rate limiting |

> **⚠️ Common Mistake:** Don't wrap EVERYTHING in `useMemo`/`useCallback`/`React.memo`. Memoization has a cost — it uses memory to store previous results and runs comparison checks. Only memoize when the computation is expensive (filtering 1,000 items) or when referential equality matters (passing callbacks to memoized children). Premature optimization is the root of all evil — but this assignment specifically asks for performance, so these are justified.

---

## Git Commit Strategy

> **🧠 WHY does commit history matter?** Your git history tells a story about how you think. A single giant commit says "I coded everything at once and committed at the end." Incremental commits say "I planned my work, built in layers, and each step was a working state." Professional teams use git history for code reviews, debugging (`git bisect`), and understanding decisions. This habit will serve you in every job.

> **🔁 Reusable Pattern: Conventional Commits**  
> The `feat:`, `fix:`, `docs:` prefixes follow the **Conventional Commits** standard. Many teams use this format. It enables automatic changelog generation and semantic versioning. Learn it once, use it everywhere.

Commit after each meaningful feature. Example history:

```
feat: project setup with Vite, React, TS, Tailwind
feat: generate 1,000 mock properties with faker
feat: property card component with Tailwind styling
feat: virtualized property list with react-window
feat: filter controls with price, bedrooms, available month
feat: sorting by price and available date
feat: responsive layout for mobile and desktop
feat: property detail modal with keyboard support
feat: pagination fallback as alternative to virtualization
fix: polish UI, add empty state, loading state, a11y
docs: add comprehensive README with architecture decisions
```

This commit history tells a clear story of how you built the project incrementally.

---

## SOLID Principles Applied in This Project

> This section maps how each SOLID principle shows up in your code. Understanding these connections will help you apply the same thinking in backend Clean Architecture.

| Principle | Where It Appears | How |
|---|---|---|
| **S** — Single Responsibility | Folder structure, custom hook | Each file has ONE job. Components render, hooks handle logic, utils format data. |
| **O** — Open/Closed | Virtualized list + Pagination toggle | App is open for new rendering strategies without changing existing filter/sort logic. |
| **L** — Liskov Substitution | PropertyCard accepts `Property` interface | Any object that satisfies the `Property` interface works — mock data or real API data. |
| **I** — Interface Segregation | Component props | `PropertyCard` only receives what it needs (`Property`), not the entire app state. |
| **D** — Dependency Inversion | Components depend on `Property` type, not data source | Swap Faker.js for a real API — components don't change because they depend on the abstraction. |

---

## Error Handling Checklist

> **Because we don't skip error handling.**

- [ ] Handle empty `properties` array gracefully (don't crash, show empty state)
- [ ] Validate price filter inputs (prevent negative numbers, ensure min ≤ max)
- [ ] Handle invalid/missing image URLs (show a fallback placeholder)
- [ ] Guard against `null`/`undefined` when opening modal (`selectedProperty && ...`)
- [ ] Clean up all `useEffect` event listeners (prevent memory leaks)
- [ ] Handle edge case: all filters active but no results match
- [ ] Handle pagination edge case: page number exceeds total pages after filtering

---

## Final Checklist Before Submission

- [ ] 1,000+ properties render smoothly (no scroll jank)
- [ ] Price range filter works correctly
- [ ] Bedroom filter works correctly
- [ ] Available month filter works correctly
- [ ] Sorting works (price asc/desc, date asc/desc)
- [ ] Responsive on mobile and desktop
- [ ] Modal opens with property details (Bonus)
- [ ] Pagination fallback works (Bonus)
- [ ] Empty state shown when no results
- [ ] Result count displayed
- [ ] Clean, readable code with TypeScript
- [ ] README with setup instructions + architecture decisions
- [ ] Deployed to Vercel with live link
- [ ] Git history has meaningful commits
- [ ] No console errors or warnings

---

*Good luck! This plan is designed to help you not just complete the assignment, but understand WHY each decision was made — so you can reuse these patterns in every future project. The same principles (separation of concerns, memoization, progressive enhancement, error handling) apply whether you're building a React dashboard or a Go backend with Clean Architecture.*
