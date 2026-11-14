# AGENTS.md

## Project overview

This repository contains the frontend of a cinema management system.

The frontend is a Single Page Application (SPA) developed with:

- Vite
- React
- JavaScript (ES6+)
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

The backend is developed separately by another team using ASP.NET Core Web API and SQL Server.

## Documentation

Before implementing features, consult these documents:

- `docs/requirements.md`: application requirements, user roles, features and navigation.
- `docs/database.md`: database schema, relationships and business rules.
- `docs/api-contract.md`: API operations and expected request/response structures.

If documentation conflicts with the actual backend API, do not guess. Identify the inconsistency and ask for clarification.

## General development rules

1. Use JavaScript, not TypeScript.
2. Use functional React components and hooks.
3. Use React Router for navigation.
4. Use Tailwind CSS for styling.
5. Keep components reusable and responsibilities separated.
6. Avoid unnecessary dependencies.
7. Keep API calls outside visual components, using a dedicated services layer.
8. Keep mock data separated from real API services.
9. Do not connect directly to SQL Server.
10. Do not invent API endpoints, DTOs, properties or business rules.

## Architecture

Organize the application by responsibility.

Suggested structure:

- `src/components/`: reusable UI components.
- `src/pages/`: application pages.
- `src/layouts/`: shared page layouts.
- `src/services/`: API communication.
- `src/context/`: shared application state.
- `src/hooks/`: reusable custom hooks.
- `src/utils/`: helper functions.
- `src/mocks/`: temporary mock data.
- `src/assets/`: static assets.

Adapt this structure when necessary, avoiding unnecessary complexity.

## Development workflow

1. Work incrementally, one feature or task at a time.
2. Inspect the existing project before making changes.
3. Explain the planned changes before implementing substantial features.
4. Do not rewrite working code unnecessarily.
5. Reuse existing components and styles whenever possible.
6. Run the build after completing significant changes.
7. Report modified files, implementation details and any remaining issues.
8. Do not commit or push changes unless explicitly requested.

## Design guidelines

The application uses a modern, dark, cinematic visual style.

Prioritize:

- Consistent spacing and typography.
- Reusable buttons, inputs, cards and navigation components.
- Clear visual hierarchy.
- Responsive layouts.
- Accessible forms and interactive elements.
- Consistent colors, borders, shadows and hover states.

Avoid implementing the entire application in a single step.

Follow the project requirements and implement features incrementally.
