# Product Document — Base FE

<!-- impeccable:product-schema 1 -->

## Platform

Web (Desktop & Mobile Responsive)

## Stack

React 19, TypeScript 6, Vite 8, Ant Design 6, React Router 7, React Query 5.

## Users

System administrators, auditors, and internal operators managing users, authentication, trace logs, and system settings.

## Product Purpose

Provide an enterprise-grade, responsive administration web dashboard ("Quản trị hệ thống") for user management, role-based access control, system audit logging, and global configuration tracking.

## Positioning

Modern modular frontend architecture with feature-sliced organization, strict TypeScript DTOs, unified API error handling, and high-contrast Ant Design token-based styling.

## Operating Context

Internal administrative workflows across desktop and mobile web browsers, requiring high contrast legibility for users with vision constraints, quick scanning, user lookups, detail edits, role assignment, and audit log inspection.

## Capabilities and Constraints

- **Role-based Navigation**: Guarded routes via `ProtectedRoute` and `hasRole('admin')`.
- **Facebook Light High-Contrast Theme**: Ant Design token integration with `#0866ff` primary blue, `#f0f2f5` background, `#050505` text, and `15px` base typography.
- **Authentication Flow**: JWT access/refresh tokens, login UI, and persistent sessions.
- **Paginated User Management**: List, filter by role/search, view user details, create user, toggle active status.
- **Audit Logging**: Traceability feed, date range filter, risk level badges, and JSON payload inspection drawer.
- **System Settings**: General app config, security policies (Session Timeout, 2FA), SMTP email gateway, and role permissions matrix.

## Brand Commitments

- Name: **Quản trị hệ thống**
- Accent & Theme: Facebook Light Theme (`#0866ff` primary, `#f0f2f5` layout, `#050505` text).
- Navigation: 260px wide Sider with bold active indicators.

## Product Principles

1. **High Contrast Accessibility**: High legibility typography and crisp semantic tags for vision constraint accessibility.
2. **Modular & Scalable**: Feature-sliced architecture keeping features self-contained (`api`, `pages`, `queries`, `types`).
3. **Defensive UI & Type Safety**: Strict type boundaries matching backend DTOs with consistent loading & error states.
4. **Responsive First**: Smooth sidebar collapse, mobile drawer backdrops, and flexible screen breakpoint handling.
