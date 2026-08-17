# Design System & Craft Guidelines — Base FE

<!-- impeccable:design-schema 1 -->

## Design Intent & Persona

Designed for enterprise administrators in Vietnam needing high legibility, clear visual hierarchy, zero clutter, and high contrast for users with vision constraints.

Inspired by Facebook Light Theme:

- Crisp high-contrast black typography (`#050505`)
- Soft off-white layout background (`#f0f2f5`)
- Vibrant Facebook primary blue (`#0866ff`)
- Wide, clear navigation sidebar (`260px`)
- Increased global font scaling (`fontSize: 15px`)

---

## Token System

### Colors

| Role           | Token / Value                        | Usage                                                |
| -------------- | ------------------------------------ | ---------------------------------------------------- |
| Primary        | `#0866ff`                            | Buttons, active menu item, link text, active avatars |
| Layout BG      | `#f0f2f5` (Light) / `#0b0f19` (Dark) | Page background                                      |
| Container BG   | `#ffffff` (Light) / `#151d2a` (Dark) | Cards, Modals, Tables, Header                        |
| Primary Text   | `#050505` (Light) / `#f0f2f5` (Dark) | Headings, table cells, primary labels                |
| Secondary Text | `#55575c` (Light) / `#a0a6b1` (Dark) | Subtitles, timestamps, metadata                      |
| Border         | `#e4e6eb` (Light) / `#263347` (Dark) | Cards, table row dividers, header bottom border      |

### Typography Scale

- **H1 / Page Title**: 20px (Bold 700)
- **H2 / Card Title**: 16px (Semi-bold 600)
- **Body Text**: 15px (Regular 400 / Medium 500)
- **Caption / Meta**: 13px - 14px (Regular 400)

### Layout & Spacing

- **Sidebar Width**: 260px
- **Header Height**: 64px
- **Control Height**: 40px
- **Border Radius**: 6px - 8px
- **Content Padding**: 24px (Desktop) / 16px (Mobile)

---

## Craft Execution Checklist

- [x] High-contrast legible text for accessibility
- [x] Broad 260px Sider with bold active indicators
- [x] Responsive layout collapse with mobile drawer backdrop
- [x] Zero AI-generated decorative clutter or unnecessary gradients
- [x] Clean, semantic Table & Form layouts
