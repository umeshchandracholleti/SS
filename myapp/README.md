## MyApp

This workspace contains two parts:

- A Vite + React app in [src/](src/)
- Static HTML/CSS/JS pages in the project root (for standalone feature pages)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm run dev
```

## Scripts

- `npm run dev`: Start Vite dev server
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Notes

- Static pages can be opened directly in the browser (e.g., BuyOnCredit.html).
- Scripts for static pages are loaded with `defer` for better performance.
- Modals include ARIA attributes and keyboard escape handling for accessibility.
