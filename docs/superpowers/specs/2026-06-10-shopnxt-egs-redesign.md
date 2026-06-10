# BitWorld EGS Design Redesign

## Overview

Complete UI redesign of the BitWorld digital game store inspired by the Epic Games Store aesthetic. All pages — storefront, auth, profile, and admin dashboard — get the treatment.

## Inspiration

- **Epic Games Store** — dark theme, dramatic full-bleed hero, clean typography, card-based catalog
- **Vibe:** Premium, dark, gamer-focused, high-contrast, minimal chrome
- **App:** BitWorld (Portuguese-language digital game store, Next.js 16 + Tailwind v4 + MongoDB)

## Color Palette

### Background scale (dark → light)
| Token | Hex | Usage |
|-------|-----|-------|
| `dark-100` | `#07080a` | Deepest, admin sidebar |
| `dark-200` | `#0f1117` | Page background |
| `dark-300` | `#151821` | Card backgrounds |
| `dark-400` | `#1a1d2e` | Elevated surfaces, inputs |
| `dark-500` | `#212734` | Borders, subtle separators |
| `dark-600` | `#2a2d3e` | Hover states, active items |

### Cyan accent (EGS-inspired)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-DEFAULT` | `#00b4d8` | Primary buttons, links, highlights |
| `accent-hover` | `#48d1e0` | Hover states |
| `accent-active` | `#0096b8` | Active/pressed |
| `accent-subtle` | `#035b7a` | Subtle backgrounds, badges |

### Text scale
| Token | Hex | Usage |
|-------|-----|-------|
| `text-high` | `#f1f5f9` | Headings, primary text |
| `text-body` | `#94a3b8` | Body text |
| `text-muted` | `#64748b` | Secondary, metadata |

### Status colors
- Success: emerald-500 (#10b981)
- Error: red-500 (#ef4444)
- Warning: amber-500 (#f59e0b)

## Typography

- **Headings:** Space Grotesk (700/800 weight, tight letter-spacing)
- **Body:** Inter (400/500/600 weight)
- **Scale:** Keep current font families, adjust weights and sizes for EGS proportions

## Page Layout

### Shared Chrome
- **Top nav:** Minimal bar, `#0f1117` bg, `1px` bottom border `#1a1d2e`. Logo left, categories center, search/user right.
- **Admin nav:** Same top bar + left sidebar (`#07080a` bg, `bento`-style menu items)
- **Footer:** Minimal, dark, subtle links
- **Max width:** 1400px content container (MaxWidthWrapper)

### Component Architecture

```
Navigation
├── Navbar (storefront)
│   ├── Logo (BitWorld + joystick icon)
│   ├── NavItems (Descobrir, Navegar, Sobre)
│   ├── SearchBar (inline pill)
│   ├── CartIcon (cyan badge)
│   └── UserMenu (dropdown)
├── AdminNav (dashboard)
├── LeftSidebar (dashboard nav)
│   ├── User greeting
│   ├── Dashboard link (cyan active indicator)
│   ├── Products / Orders / Users / Genres
│   └── Vendas (Sales) link
```

### Homepage
```
Homepage
├── Hero Carousel (embla-carousel)
│   ├── Full-bleed product image + gradient overlay
│   ├── Product info overlay (title, description, price, CTA)
│   ├── Badges: "Em destaque", "Novo", "Promoção"
│   └── Thumbnail strip for next items
├── "Jogos em destaque" section
│   └── Horizontal scroll product cards
├── Product grid (featured/promoted)
└── Optional: genre browsing section
```

### Browse/Catalog
```
Browse
├── SearchBar (top)
├── Sidebar filters (left, 200px)
│   ├── Categories (Todos, Ação, Aventura, RPG, Estratégia...)
│   └── Price range
└── Product grid (right, 3-4 columns)
    └── ProductCard
        ├── Image thumbnail (with hover zoom)
        ├── Title
        ├── Price (cyan) / "Grátis" (emerald badge)
        ├── Platform icons
        └── Rating
```

### Product Detail
```
Product Detail
├── Hero header
│   ├── Product image as background + gradient overlay
│   ├── Title, genres (as pills), description excerpt
│   ├── Price card (floating right)
│   │   ├── Price in cyan
│   │   └── "Adicionar ao carrinho" button (cyan)
│   └── Wishlist toggle
├── Content (below fold)
│   ├── "Sobre" section (rich text, TinyMCE output)
│   ├── System requirements
│   ├── Developer / Publisher / Release date metadata
│   └── Related products row
```

### Auth Pages (sign-in / sign-up / reset-password)
```
Auth
├── Centered card (#151821 bg, 1px #1a1d2e border)
│   ├── "Acesso do cliente" heading
│   ├── Form inputs (dark-400 bg, cyan focus ring)
│   ├── Submit button (cyan solid)
│   └── Links: reset password, create account
└── Dark page background (no nav chrome)
```

### Cart & Checkout
```
Cart
├── Split layout
│   ├── Left: Product list with ProductCartCard
│   └── Right: Summary panel (#151821 bg)
│       ├── Subtotal, total
│       └── "Finalizar a compra" button
└── Empty state: centered icon + muted text
```

### Dashboard
```
Dashboard
├── Layout: sidebar (left) + content (right)
├── Sidebar (#07080a)
│   ├── Logo + "BitWorld Admin"
│   ├── Nav items with icons
│   └── Active state: left cyan border
├── Content area
│   ├── Metric cards (3-column grid)
│   │   ├── Card (#151821 bg, 1px #1a1d2e border)
│   │   ├── Label (muted)
│   │   └── Value (cyan for money, white for numbers)
│   ├── Tables (CRUD pages)
│   │   ├── #151821 bg, 1px #1a1d2e borders
│   │   ├── Header: uppercase, muted, small
│   │   └── Row hover: #1a1d2e
│   └── Empty states: icon + "Nenhum [item] cadastrado."
```

### Profile & User Area
```
Profile/User
├── Layout: consistent with storefront (no sidebar)
├── Tabs or sections
│   ├── Profile info (ProfileForm)
│   ├── Orders (accordion list)
│   │   ├── Order number + date
│   │   └── Product images, names, prices
│   └── Wishlist (ProductCartCard list)
│       └── Empty: "Sua lista está vazia..."
```

## Component Updates

### ProductCard
- Current: Blue-950 bg, white card, standard Tailwind shadow
- New: #151821 bg, 1px #1a1d2e border, hover border → #2a2d3e, image hover scale, overlay CTA

### Navbar
- Current: Fixed blue-950 bg, full search bar
- New: #0f1117 bg matching page, inline pill search, cyan cart badge, text auth links

### Footer
- Current: Simple text line
- New: Dark bg (#07080a), subtle links, copyright

### Dashboard cards (QuantitySales, TotalSales, QuantityUsers)
- Current: Blue-900 bg cards
- New: #151821 bg, cyan value numbers, muted labels

## Color Token Mapping (CSS @theme)

```css
@theme {
  --color-dark-100: #07080a;
  --color-dark-200: #0f1117;
  --color-dark-300: #151821;
  --color-dark-400: #1a1d2e;
  --color-dark-500: #212734;
  --color-dark-600: #2a2d3e;
  --color-accent-DEFAULT: #00b4d8;
  --color-accent-hover: #48d1e0;
  --color-accent-active: #0096b8;
  --color-accent-subtle: #035b7a;
  --color-text-high: #f1f5f9;
  --color-text-body: #94a3b8;
  --color-text-muted: #64748b;
}
```

## Motion & Interactions

- Hover: card scale(1.02) on image, border color transition (200ms ease-out)
- Hero: auto-play carousel (embla-carousel, 6s interval)
- Buttons: instant color change, no fancy animation
- Sidebar: instant swap, no slide animation
- Input focus: cyan ring, 150ms transition

## Out of Scope

- Changing product data model or MongoDB schema
- Adding new pages/routes not already existing
- Auth flow logic changes
- Database migrations or new backend services

## Implementation Plan

The work should proceed in this order, matching dependency:
1. **Foundation** — Update globals.css with new color palette (@theme tokens), remove old color tokens
2. **Navigation** — Restyle Navbar, LeftSidebar, AdminNav with new colors and EGS-minimal style
3. **Homepage** — Redesign hero carousel + product sections
4. **Browse** — Restyle browse page with sidebar + card grid
5. **Product Detail** — Restyle product detail with hero header + floating price card
6. **Auth pages** — Restyle sign-in, sign-up, reset-password with centered dark card
7. **Cart & Checkout** — Restyle cart and checkout pages
8. **Dashboard** — Restyle all dashboard pages with new sidebar + cards + tables
9. **Profile & User Area** — Restyle profile, orders, wishlist
10. **Footer & remaining** — Restyle footer, about page, remaining pages
