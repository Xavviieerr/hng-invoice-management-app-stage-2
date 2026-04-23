# Invoice App

A fully functional invoice management application built with React and Tailwind CSS. Users can create, view, edit, and delete invoices, save drafts, mark invoices as paid, filter by status, and toggle between light and dark mode — with all data persisted to localStorage.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Xavviieerr/hng-invoice-management-app-stage-2.git
cd hng-invoice-management-app-stage-2

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

### Build for Production

```bash
npm run build
npm run preview
```

### Dependencies

| Package               | Purpose                   |
| --------------------- | ------------------------- |
| `react` + `react-dom` | UI library                |
| `react-router-dom`    | Client-side routing       |
| `tailwindcss`         | Utility-first styling     |
| `vite`                | Build tool and dev server |

### Tailwind Configuration

The project uses a custom Tailwind theme defined in `index.css` via `@theme`. Custom tokens include brand colors (`purple-primary`, `green-primary`, etc.), dark mode surfaces (`dark-bg`, `dark-card`, etc.), and the `LeagueSpartan` font family. Dark mode is activated by the `dark` class on the root element, toggled via context.

---

## Architecture Explanation

### State Management

The app uses React Context for global state, split into two providers:

**`InvoiceContext`** owns all invoice data and exposes five mutation functions: `createInvoice`, `updateInvoice`, `deleteInvoice`, `markAsPaid`, and `saveDraft`. Each mutation updates the in-memory state array, and a `useEffect` syncs the full array to `localStorage` on every change. No external state library (Redux, Zustand) is used — the data model is simple enough that Context with `useState` is sufficient and avoids unnecessary dependency overhead.

**`ThemeContext`** owns the `"light"` | `"dark"` string and a `toggleTheme` function. It reads from and writes to `localStorage` on every change. The theme string is applied as a class on the outermost div in `AppLayout`, which activates Tailwind's `dark:` variant across the entire component tree.

### Routing

React Router v6 is used with two routes: `/` for the invoice list and `/invoice/:id` for the detail view. The `id` URL parameter is extracted with `useParams()` and used to look up the correct invoice in context. This means the detail page URL is shareable and bookmarkable — navigating directly to `/invoice/RT3082` renders the correct invoice without any additional fetch.

### Form Architecture

A single `InvoiceForm` component serves both the "New Invoice" and "Edit Invoice" use cases. It accepts an `initialForm` prop: empty defaults for new invoices, pre-filled data for edits. The form manages its own internal state and only calls `onSave` or `onDraft` with the final data — the parent page decides what to do with it (which context function to call, whether to close the form, etc.).

### Data Shape

Each invoice stored in localStorage follows this schema:

```js
{
  id: "RT3082",            // Auto-generated: 2 letters + 4 digits
  status: "paid",          // "draft" | "pending" | "paid"
  name: "Elon Musk",       // Client name (denormalized for list display)
  amount: "5,120.50",      // Formatted string, recalculated on save
  date: "Due 15 Sep 2021", // Formatted string for list display
  invoiceDate: "2021-08-15",
  paymentDue: "15 Sep 2021",
  paymentTerms: "Net 30 Days",
  description: "Graphic Design",
  sentTo: "elon@spacex.com",
  fromAddress: { street, city, postCode, country },
  billTo: { name, street, city, postCode, country },
  items: [{ name, qty, price, total }]
}
```

`amount` and `paymentDue` are derived values recalculated on every create or update, so they are always consistent with the items and payment terms — there is no risk of stale display values.

### Responsive Layout Strategy

The sidebar is a desktop-only element (`lg:` breakpoint, 1024px+). Below 1024px a horizontal top nav bar replaces it. Both elements are always in the DOM — CSS hides the appropriate one. The slide-in form panel uses `lg:pl-[103px]` to indent its content on desktop so it doesn't overlap the sidebar, and removes that indent on smaller screens. The invoice detail action buttons appear in the status bar on desktop and in a `fixed` bottom bar on mobile, keeping them always reachable without scrolling.

---

## Trade-offs

### localStorage over a Backend

**Why:** Eliminates backend setup, deployment complexity, and network latency. The app works offline immediately after first load.

**Cost:** Data is browser-local — invoices don't sync across devices or users. localStorage is limited to ~5MB, which is ample for invoice data but would need replacing in a real multi-user product. A natural upgrade path would be to swap the `useEffect` persistence in `invoiceContext.jsx` for API calls while keeping the same context interface — page components wouldn't need to change at all.

### Single InvoiceForm for Create and Edit

**Why:** Removes duplicated JSX, validation logic, and item management code that previously lived in two separate files (`NewInvoiceForm.jsx` and `EditForm.jsx`).

**Cost:** The component is more complex and accepts more props. Any future divergence in create vs. edit behavior (e.g., edit showing a revision history panel) would require adding conditional logic inside a file that's already substantial.

### Context over Zustand or Redux

**Why:** Keeps the dependency footprint minimal. With only two global state domains (theme, invoices) and no async data fetching, Context is appropriate and avoids the learning curve and boilerplate of a dedicated state library.

**Cost:** React Context re-renders all consumers when any part of the context value changes. If the invoice list grows very large, this could cause performance issues. Mitigation strategies include splitting context into smaller slices, using `useMemo` on context values, or migrating to Zustand (which uses subscriptions instead of re-renders).

### Derived Values Stored on the Invoice Object

`amount` and `date` are calculated at write time and stored alongside the raw data. This means list rendering is fast — no calculation happens during display.

**Cost:** If the calculation logic changes (e.g., currency formatting), existing stored invoices retain the old formatted strings. A recalculation migration step would be needed. The alternative — calculating on read — avoids this but adds computation to every list render.

---

## Accessibility Notes

### Semantic HTML

Every interactive element uses the correct HTML element. Invoice list items are `<button>` elements, so they receive keyboard focus natively and announce correctly to screen readers. Form fields all have associated `<label>` elements. Section headings use appropriate heading levels.

### Keyboard Navigation

The `InvoiceForm` panel traps focus correctly: on open, the first input receives focus automatically via a `useRef` + `setTimeout`. The `DeleteConfirmModal` focuses the Cancel button on open, so a keyboard user's first action is the safe choice. Both the modal and form panels close on `Escape` via `keydown` listeners that are attached when open and cleaned up on close.

### ARIA

The delete modal has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to the modal title's `id`. The form panel has `role="dialog"` and `aria-label`. The filter button has `aria-haspopup="true"` and `aria-expanded` reflecting open state. The backdrop div has `aria-hidden="true"` so screen readers skip it.

### Color Contrast

Status badges use color plus a text label — color is never the sole means of conveying status. Dark mode color tokens are designed to maintain WCAG AA contrast ratios. Error states use both a red border and an inline text message — not color alone.

### Error Announcements

Validation errors render inline next to their fields and a summary message appears at the bottom of the form. Because errors are rendered into the DOM (not just styled differently), screen readers will encounter them naturally during Tab navigation through the form.

---

## Improvements Beyond Requirements

### Auto-calculated Amount and Due Date

The spec required displaying amount and due date, but not that they be auto-derived. The app calculates both from form inputs on every save — change the items or payment terms and the totals and due date update automatically, with no manual entry required.

### Seeded Default Data

First-time visitors see a populated invoice list rather than an empty state, making the app immediately explorable without having to create data first.

### Filter Empty State Differentiation

The spec required an empty state. The app implements two distinct empty states: one for "no invoices exist at all" (illustrated, with a CTA) and one for "invoices exist but don't match the filter" (minimal, explanatory). These are different situations and deserve different messages.

### Sticky Form Footer

The create/edit form's Cancel and Save buttons are in a sticky footer that stays visible at the bottom of the panel regardless of scroll position. On long forms with many items, users never have to scroll to the bottom to save — the actions are always in view.

### Per-field and Per-item Validation

Validation errors appear inline next to each specific field rather than as a single top-level error message. Item rows each display their own individual errors (name required, qty must be positive, etc.) so users know exactly what to fix without hunting.

### Mobile Bottom Action Bar

On the invoice detail page, the Edit / Delete / Mark as Paid buttons are duplicated into a fixed bottom bar on mobile. This follows mobile UX best practices — primary actions should be reachable with a thumb without scrolling back to the top of the page.

### Outside Click and ESC for Dropdowns

The status filter dropdown closes both on outside click and on Escape key. This is expected behavior that users rely on but the spec didn't explicitly require.

### Shareable Invoice URLs

Because the detail page is routed by invoice ID (`/invoice/RT3082`), invoice URLs are bookmarkable and shareable. A page refresh on the detail view does not lose state — the invoice is re-fetched from localStorage via context.
