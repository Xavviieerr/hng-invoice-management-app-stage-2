Here's a full walkthrough of the entire codebase, from entry point to the smallest utility.

---

## `main.jsx` / Entry Point

This is the very first file React loads. It finds the `<div id="root">` in your `index.html` and mounts the entire app inside it using `ReactDOM.createRoot`. Everything you see on screen lives inside that single div. Nothing runs before this file.

---

## `App.jsx`

This is the root of your component tree. It does three things in a specific order that matters:

**Providers wrap everything.** `ThemeProvider` is outermost, then `InvoiceProvider` inside it, then `BrowserRouter` inside that. The order is intentional — any component deeper in the tree can access theme and invoice data, and the router gives every component access to navigation. If you flipped `InvoiceProvider` outside `ThemeProvider`, it would still work, but if `InvoiceProvider` ever needed to read the theme (say, to style toasts differently), it couldn't.

**`AppLayout` wraps the routes.** This means the sidebar/topbar renders on every page automatically — you never have to add it manually to `InvoiceList` or `InvoiceDetail`.

**Routes are defined here.** Two routes: `/` renders `InvoiceList`, `/invoice/:id` renders `InvoiceDetail`. The `:id` is a URL parameter React Router extracts and makes available via `useParams()`.

---

## `context/themeContext.jsx`

This file creates a global "theme switch" that any component can read or toggle.

`createContext(null)` creates an empty context object — think of it as a named pipe that data flows through. `ThemeProvider` is a wrapper component that holds the actual `theme` state (`"light"` or `"dark"`). On first load, it checks `localStorage` for a saved preference — if there's none, it defaults to `"light"`. Every time `theme` changes, the `useEffect` saves the new value to localStorage so it survives page refresh.

`toggleTheme` simply flips between the two values. Both `theme` and `toggleTheme` are passed into the context value, so any component that calls `useTheme()` gets both. The `useTheme` hook is just a convenience wrapper — instead of writing `useContext(ThemeContext)` everywhere, you import `useTheme` and call it. The error throw inside it is a developer safety net: if you accidentally use `useTheme` outside the provider, you get a clear message instead of a silent `null`.

---

## `context/invoiceContext.jsx`

This is the brain of the app. All invoice data lives here, all mutations happen here, and localStorage sync happens here.

**Initial state.** On first render, it tries to read from localStorage. If it finds data, it parses and uses it. If not (first ever visit), it falls back to the `defaultInvoices` array — three seeded invoices so the app doesn't feel empty. This is all inside the `useState` initializer function, which only runs once.

**The `useEffect` for persistence.** Any time `invoices` changes (create, update, delete, mark paid), this effect fires and writes the full array to localStorage as a JSON string. This is the entire persistence mechanism — simple and reliable.

**Helper functions** sit outside the component because they don't need React state:

- `generateId()` builds IDs like `"RT3082"` — two random uppercase letters plus a 4-digit number, matching the design's format.
- `calcAmountDue(items)` sums `qty × price` across all items and formats it as a locale string with two decimal places.
- `addDays(dateStr, days)` takes an ISO date string, adds N days, and returns a formatted string like `"15 Sep 2021"` — this becomes the payment due date.
- `termsToDays(terms)` maps payment term labels to day counts (e.g. `"Net 30 Days"` → `30`).

**CRUD functions:**

`createInvoice(form, status)` generates a fresh ID, calculates amount and due date from the form data, then prepends the new invoice to the array (so it appears at the top of the list).

`updateInvoice(id, form)` maps over the array and replaces the matching invoice, recalculating amount and due date from the updated form. Everything else on the invoice (id, original creation metadata) is preserved via the spread.

`deleteInvoice(id)` filters out the matching invoice. After this, `useEffect` fires and localStorage is updated.

`markAsPaid(id)` maps over the array and sets `status: "paid"` on the matching invoice only.

`saveDraft(form)` is just `createInvoice(form, "draft")` — same flow, different status.

---

## `utils/validation.js`

This is a pure utility file — no React, no state, just functions.

`validateForm(form)` takes the form object and returns an `errors` object. Each key in `errors` corresponds to a field name, and the value is the error message string. If a field is valid, it simply has no key in the object.

The validations run top to bottom: Bill From fields, Bill To fields (including a regex email check), invoice date, description, and then items. The items section is more complex — it maps over the items array and produces an `itemErrors` array where each index corresponds to an item and contains its own error object. This structure is what allows per-row error display in the form.

`hasErrors(errors)` just checks if the errors object has any keys at all — a convenience used before saving.

---

## `layouts/AppLayout.jsx`

This component renders the chrome around your pages — the navigation bar — and slots page content into `<main>`.

**Responsive strategy:** There are two nav elements, one for mobile/tablet and one for desktop, and CSS hides/shows the right one via Tailwind's `lg:` breakpoint (1024px). Below 1024px, a horizontal `<header>` bar appears at the top. At 1024px and above, a vertical `<aside>` bar appears on the left. They never both show at once.

**Logo construction:** The logo area is built with a `relative` positioned container, a purple background, the logo image with `z-10` (so it's above the background layers), and an absolutely-placed purple-light half-circle in the bottom half. This creates the two-tone split effect from the design.

**`<main>` is `flex-1`** which means it takes all remaining horizontal space after the sidebar. On mobile, it's just a full-width block below the top bar. Page content flows into it as `children`.

---

## `components/LightDarkButton.jsx`

Reads `theme` from context and renders either a sun SVG (shown in dark mode, to switch back to light) or a moon SVG (shown in light mode, to switch to dark). Calls `toggleTheme` on click. The icons are inline SVGs so there's no image dependency.

---

## `components/BackdropComponent.jsx`

A single-purpose overlay. When `isOpen` is true it renders a fixed full-screen div with a dark semi-transparent background and a blur effect (`backdrop-blur-sm`). Clicking it calls `onClose`. It renders nothing when `isOpen` is false. Every modal and slide-in panel in the app uses this — it's the "click outside to close" mechanism.

---

## `components/StatusFilter.jsx`

A custom dropdown with checkboxes.

**State:** `open` controls whether the dropdown is visible. It's local to this component — the parent (`InvoiceList`) only cares about the `selected` filters object, not whether the dropdown is open.

**Outside click detection:** A `useEffect` attaches a `mousedown` listener to the whole document. When a click happens, it checks if the click target is inside the filter's `ref` container. If it's outside, it closes. This is the standard pattern for closing dropdowns on outside click.

**ESC key:** Another `useEffect` listens for `Escape` and closes the dropdown. Both listeners are cleaned up on unmount via the return function.

**The checkboxes** are controlled inputs — their `checked` value comes from the `selected` prop, and `onChange` calls `toggle(key)` which flips that key in the parent's state. This is "lifting state up" — the filter component doesn't own the filter state, the page does, because the page needs to use it to filter the list.

---

## `components/InvoiceItem.jsx`

Renders a single row in the invoice list.

The entire card is a `<button>` element (not a div) for accessibility — keyboard users can Tab to it and press Enter to navigate. `onClick` calls `navigate(`/invoice/${invoice.id}`)` from React Router, which changes the URL and renders `InvoiceDetail`.

**Status badge** is built from two lookup objects — `statusStyles` for the background and text color, `dotStyles` for the colored dot. Both are keyed by status string (`"draft"`, `"pending"`, `"paid"`). Applying `statusStyles[invoice.status]` gives you the right Tailwind classes for that status.

**Responsive layout:** On mobile it shows a stacked 2-column grid. At `md` (768px) it becomes a 6-column grid with all info in a single row. The arrow chevron is hidden on mobile since the whole card is tappable anyway.

---

## `components/InvoiceForm.jsx`

This is the most complex component in the app. It's used for both creating and editing invoices.

**Props it accepts:**

- `isOpen` — whether to render at all
- `onClose` — called when the user cancels or presses ESC
- `onSave` — called with the form data when the user submits successfully
- `onDraft` — if provided, shows the "Save as Draft" button; called with form data
- `title` — `"New Invoice"` or `"Edit #RT3082"`
- `initialForm` — pre-filled data for edit mode; empty defaults for new mode
- `submitLabel` — `"Save & Send"` or `"Save Changes"`

**Form state:** `useState(initialForm || defaultForm)` initializes with either the invoice being edited or empty fields. The `useEffect` that watches `isOpen` re-syncs the form when the panel opens — this is critical for edit mode, because if you edit invoice A, close, then edit invoice B, the form needs to reset to B's data.

**`set(field, value)`** updates a single field and clears its error. This is the handler for all non-item inputs.

**`setItem(index, field, value)`** updates a specific item in the items array. It also recalculates `total` whenever `qty` or `price` changes, so the total column stays in sync as you type.

**`addItem` and `removeItem`** append/filter the items array. Adding always starts a new blank item; removing uses `filter` with index comparison.

**Validation on submit:** `handleSave` calls `validateForm`, checks if there are errors, sets them into state (which triggers re-render showing error messages), and sets a global error message. If validation passes, it calls `onSave(form)`.

**ESC and focus:** Two `useEffect`s handle this. One attaches a keydown listener for Escape. The other uses `setTimeout(..., 50)` to focus the first input — the timeout is necessary because the DOM needs one tick to render before `focus()` works.

**Layout structure:** The outer `div` is `fixed`, full height, `max-w-[616px]`, `flex flex-col`. Inside, there are two children: the scrollable content div (`flex-1 overflow-y-auto`) and the sticky footer. The footer has `sticky bottom-0` which keeps it pinned to the bottom of the panel regardless of scroll position. This is the correct split — scroll happens only in the content, the buttons never scroll away.

**The `Field` helper component** is defined inside the file. It renders a label, an optional error message aligned to the right of the label, and whatever input is passed as `children`. The `ic(field)` function (short for "input class") returns either `inputNormal` or `inputError` based on whether that field has an error — this is what makes fields turn red on failed validation.

**Item rows are responsive:** On mobile, quantity, price, total, and delete are laid out in a horizontal flex row with labels above each. On desktop (`sm:` and up), they snap into a CSS grid with a header row.

---

## `components/DeleteConfirmModal.jsx`

A centered modal dialog.

`useEffect` focuses the Cancel button when the modal opens — this is a focus trap start (keyboard users land on Cancel, not somewhere random). ESC key closes it via another `useEffect`. Both effects clean up their listeners on unmount.

The modal has `role="dialog"` and `aria-modal="true"` for screen readers, and `aria-labelledby` pointing to the title's id. `Backdrop` sits behind it at `z-30`, the modal itself is at `z-50`.

`onConfirm` is what actually triggers deletion — the modal doesn't know how to delete; it just calls back to `InvoiceDetail` which calls `deleteInvoice` from context, then navigates home.

---

## `pages/InvoiceList.jsx`

The home page.

**Filter logic:** `activeFilters` is the subset of filter keys that are `true`. If none are active, all invoices show. Otherwise, only invoices whose `status` is in `activeFilters` show. This runs on every render — no `useEffect` needed because it's just a derived value from existing state.

**Two empty states:** If `invoices.length === 0` (truly no invoices), the full illustrated empty state shows. If `invoices.length > 0` but `filtered.length === 0` (invoices exist but don't match the filter), a simpler "No results" message shows. These are different UX situations and deserve different messages.

**`handleCreate` and `handleDraft`** call context functions and then close the form. The form doesn't close itself — it calls `onSave` and the parent decides what to do next. This keeps the form reusable.

---

## `pages/InvoiceDetail.jsx`

The detail page for a single invoice.

**`useParams()`** extracts the `id` from the URL (`/invoice/RT3082` → `id = "RT3082"`). `getInvoice(id)` looks it up in context. If no match is found (e.g. someone navigates to a bad URL), a not-found message renders with a back button.

**`editInitial`** constructs the form's initial values from the invoice's stored data, using optional chaining (`?.`) to safely handle fields that might be missing on older data.

**`handleSaveEdit`** takes the form data, reconstructs the nested `fromAddress`, `billTo`, and `sentTo` fields that the invoice schema expects, then calls `updateInvoice`. This is the mapping layer between the flat form shape and the nested invoice shape.

**`handleDelete`** calls `deleteInvoice(id)` then `navigate("/")`. The navigation happens after deletion so the detail page doesn't try to render a now-deleted invoice.

**`handleMarkPaid`** calls `markAsPaid(id)`. Because the invoice data comes from context which is backed by state, the status badge on this page re-renders immediately — no refresh needed.

**Responsive action buttons:** On desktop (`sm:` and up) the Edit/Delete/Mark as Paid buttons sit in the status bar. On mobile they're in a `fixed` bottom bar that floats above the content. The desktop ones have `hidden sm:flex` and the mobile bar has `sm:hidden`.

**"Mark as Paid" is conditionally rendered:** `{invoice.status !== "paid" && <button>Mark as Paid</button>}` — once an invoice is paid, the button disappears entirely on both mobile and desktop.

---

## `routes/AppRoutes.jsx`

A thin file that just holds the `<Routes>` and `<Route>` definitions, extracted from `App.jsx` for cleanliness. `App.jsx` renders this inside `AppLayout`, so the routes render inside the main content area automatically.
