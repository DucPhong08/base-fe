# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, TypeScript 6, Vite 8, Ant Design 6, React Router 7, React Query 5.

## Users

_(Inferred from codebase)_ System administrators and internal operators managing users, authentication, and system settings.

## Product Purpose

_(Inferred from codebase)_ Provide an enterprise-grade, responsive administration web dashboard ("Quản trị hệ thống") for user management, role-based access control, and operational status tracking.

## Positioning

_(Inferred from codebase)_ Modern modular frontend architecture with feature-sliced organization, strict TypeScript DTOs, unified API error handling, and Ant Design token-based styling.

## Operating Context

_(Inferred from codebase)_ Internal administrative workflows across desktop and mobile web browsers, requiring quick scanning, user lookups, detail edits, and role assignment.

## Capabilities and Constraints

- _(Inferred)_ Role-based navigation (Guarded routes via `ProtectedRoute` and `hasRole('admin')`).
- _(Inferred)_ Light / Dark mode theme toggling with Ant Design token integration.
- _(Inferred)_ Authentication flow with JWT access/refresh tokens, login UI, and persistent sessions.
- _(Inferred)_ Paginated user management: list, filter, view user details, create user, toggle active status.

## Brand Commitments

- Name: **Quản trị hệ thống**
- Accent & Theme: Ant Design primary color tokens, dark blue gradient Sider (`#001529` to `#002140`).

## Evidence on Hand

- `src/app/router.tsx`: App routing system and layout structure.
- `src/layouts/AppLayout.tsx`: Sider navigation, header actions, breadcrumbs, and theme controls.
- `src/features/users/`: User management DTOs, queries, and UI components.
- `src/features/auth/`: Authentication provider, login page, and permission hooks.

## Product Principles

1. **Modular & Scalable**: Feature-sliced architecture keeping features self-contained (`api`, `pages`, `queries`, `types`).
2. **Defensive UI & Type Safety**: Strict type boundaries matching backend DTOs with consistent loading & error states.
3. **Accessibility & Responsive First**: Smooth sidebar collapse, mobile drawer backdrops, and flexible screen breakpoint handling.

## Accessibility & Inclusion

_(Inferred)_ WCAG Web accessibility compliance using semantic markup, ARIA labels for buttons/icons, and token-based contrast ratios.
