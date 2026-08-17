# Base FE — Hệ Thống Quản Trị Enterprise (2026 Administrative Standard)

Enterprise-grade, responsive administration web dashboard ("Quản trị hệ thống") built with React 19, TypeScript 6, Vite 8, and Ant Design 6. Optimized for high contrast, legibility, and Facebook-inspired light theme standards.

---

## ✨ Features & Modules

- **🎨 High-Contrast Design System**:
  - Facebook Light Theme (`#0866ff` primary blue, `#f0f2f5` layout background, `#050505` high-contrast text).
  - 15px-16px base typography scale for optimal legibility.
  - 260px expanded navigation Sider.
- **📊 Dashboard (`/`)**: System KPI metrics (`MetricCard`), recent activity feed, quick administration shortcuts, and live system status.
- **👥 User Management (`/users`)**: Paginated user table, search/role filter, detail editor, account status toggle (`ActiveTag`), and `UserAvatar` display.
- **🔍 Audit Logs (`/audit`)**: System traceability log, date range & category filters, IP tracking, risk level tags, and detailed JSON payload inspection drawer.
- **⚙️ System Settings (`/settings`)**: General parameters, security policies (Session Timeout, 2FA, password min length), SMTP email config, and role permissions matrix.

---

## 🚀 Tech Stack

- **Core**: React 19, TypeScript 6, Vite 8
- **UI & Icons**: Ant Design 6, @ant-design/icons
- **State & Data Fetching**: TanStack React Query 5, Axios (with mock layer)
- **Routing**: React Router 7
- **Code Quality**: Oxlint, Prettier, Husky

---

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Run Oxlint linter
npm run lint

# Format code with Prettier
npm run format

# Production Build Check
npm run build
```
