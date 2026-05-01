# Weekly Meal Planner (GitHub Pages)

This is a single-page web application designed for planning weekly meals, managing a dish catalog, and generating shopping lists. It runs entirely on the client-side using Vanilla HTML, CSS, and JavaScript.

## Features
- **Dish Catalog:** Create, edit, delete, and search dishes.
- **Weekly Plan:** Assign dishes to specific meals (Breakfast, Lunch, Dinner, Snack) across the week.
- **Shopping List:** Automatically aggregates ingredients from your weekly plan into a shopping list.
- **Smart Rules:** The application warns you when you repeat a dish on the same day, overload a day with "heavy" meals, or assign a dish to an incompatible meal slot.
- **Local Storage:** All your data is saved securely in your browser's local storage.

## Demo & Testing
- To view the app with sample data, click the **"Load Demo Data"** button in the sidebar. This will populate the catalog and plan.
- Use **"Reset Plan"** to clear the weekly plan while keeping your dish catalog intact.

## Technology Stack
- HTML5
- CSS3 (Custom Variables, Flexbox, CSS Grid)
- Vanilla JavaScript (ES6 Modules)
- `localStorage` API for data persistence

## Deployment
This project is configured for deployment to **GitHub Pages**. The `.github/workflows/deploy-pages.yml` file handles the automated build and deployment process whenever changes are pushed to the `main` branch. 

Since there is no backend server requirement, GitHub Pages static hosting provides a perfect, zero-cost environment.

## Architecture & SDR
For detailed architectural decisions and models, please refer to:
- [SDR.md](./docs/sdr/SDR.md)

## Note
Clearing your browser's local storage or caching data may result in data loss, as no server is used for backup.
