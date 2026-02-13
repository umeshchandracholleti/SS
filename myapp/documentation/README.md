# Project Documentation

This folder contains end-to-end documentation for the Sai Scientifics front-end experience and the planned backend needed to complete the product.

## What exists today
- Static HTML/CSS/JS pages in the project root.
- A Vite + React app in src/ that links to the static pages.
- Client-side form validation and UI feedback (toasts).
- Database design and Flyway migrations for PostgreSQL.
- Node + Express API with admin authentication and dashboards.
- API wiring for RFQ, credit, cart, orders, tracking, reviews, support, and grievances.

## What is missing for a finished product
- Payment processing integration and webhook handling.
- Production-ready email/WhatsApp notifications.
- A unified React experience (if the goal is a single SPA rather than mixed static pages).

## Where to start
- Setup and local run: SETUP.md
- Static pages overview: STATIC_PAGES.md
- React app overview: REACT_APP.md
- Backend and API plan: BACKEND_PLAN.md
- Database setup and migrations: DATABASE.md
- Testing plan: TESTING.md
- Deployment plan: DEPLOYMENT.md
- Production deployment (recommended stack): PROD_DEPLOY.md
- Release checklist: RELEASE_CHECKLIST.md
- Security notes: SECURITY.md
- Admin dashboard: ADMIN.md

## Ownership and assumptions
Unless otherwise specified, this documentation assumes:
- Static HTML and Vite React app both remain supported.
- PostgreSQL is the primary data store.
- The backend is not yet implemented and must be built.
