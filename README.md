# Above Below Monorepo

**Above Below** is a modular e-commerce monorepo designed for a headless streetwear brand platform. Built with **Next.js 14**, **Shopify Storefront API**, **Sanity Studio**, **styled-components**, **Zustand**, and **graphql-request**, it includes a design system, commerce abstraction layer, CI workflows, Netlify deployment config, and a modern Turborepo setup.

---

## 🏗️ Tech Stack

- **Monorepo**: Turborepo + PNPM workspaces
- **Frontend**: Next.js 14 (App Router)
- **CMS**: Sanity Studio v3
- **Commerce Backend**: Shopify Storefront API
- **GraphQL Client**: `graphql-request`
- **Styling**: styled-components + Theme package
- **State Management**: Zustand (for cart and UI)
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Netlify (for apps/web)

---

## 🧱 Repository Structure

```
apps/
  web/              # Next.js storefront app (public-facing)
  landing/          # Optional landing site (static splash site)
  studio/           # Sanity Studio CMS app

packages/
  ui/               # Shared styled-components-based UI library
  commerce/         # Shopify Storefront abstraction, GraphQL client, Zustand cart
  theme/            # Design tokens and ThemeProvider for styled-components
  assets/           # Fonts, logos, icons, glyphs

configs/
  eslint/           # Shared ESLint config
  styled-components/
  postcss/
  tsconfig/         # Shared TypeScript configuration
```

---

## 🔧 Setup Instructions

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set environment variables

Create the following files and populate them with your credentials:

- `apps/web/.env.local`

```env
SHOPIFY_STORE_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token
MAILCHIMP_API_KEY=your-mailchimp-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
MAILCHIMP_SERVER_PREFIX=usX
```

- `apps/studio/sanity.config.ts` → Set project ID and dataset

### 3. Run all dev servers

```bash
pnpm dev
```

| App        | URL                   |
| ---------- | --------------------- |
| Web Store  | http://localhost:3000 |
| Landing    | http://localhost:3001 |
| Sanity CMS | http://localhost:3333 |

---

## 📦 Features

### Web Storefront (`apps/web`)

- Product listing and detail pages
- Cart functionality using Zustand
- Email capture (Mailchimp)
- GraphQL calls via `graphql-request`
- Shared theme and components

### CMS Studio (`apps/studio`)

- Lookbook schema
- Drops schema
- Product metadata
- GROQ testing with Vision plugin

### Commerce Package (`packages/commerce`)

- Shopify API abstraction
- Zustand cart logic
- Hooks: `useProducts`, `useProduct`, `useCart`

### UI Package (`packages/ui`)

- Reusable components: `Button`, `Card`, `ProductGrid`, etc.
- Jest + RTL tested

### Theme Package (`packages/theme`)

- Centralized colors, typography, spacing
- Typed theme object + ThemeProvider

---

## 🚀 Deployment

### Netlify

The project includes a `netlify.toml` for deploying the `web` app:

```toml
[build]
  base = "apps/web"
  publish = ".next"
  command = "pnpm build"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### GitHub Actions

CI workflow is located at `.github/workflows/ci.yml`:

- Lint, build, and test all apps/packages
- Dependabot updates enabled for dependencies

---

## 🧪 Testing

```bash
pnpm test
```

Tests are configured in `web`, `ui`, and `commerce`.

---

## 🧠 Contributing

- Use consistent code style (`pnpm lint` / `pnpm format`)
- Place new UI components in `packages/ui`
- Add new GraphQL logic to `packages/commerce`
- Use `theme` tokens for all component styling
- Run `pnpm dev` to develop across apps simultaneously

---

## 🤝 License

MIT

---

## ✨ Credits

Created by @trev — built to launch the Above Below brand as a modern, flexible headless commerce experience.
