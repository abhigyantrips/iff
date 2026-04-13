# IFF Email Campaign Manager

A modern web application for managing and launching email campaigns for the Internet Freedom Foundation (IFF).

![Demo Screenshot](/public/screenshot.png)

## Disclaimer

This is an independent concept project and is not affiliated with, endorsed by, or officially connected to the Internet Freedom Foundation. All trademarks, logos, and brand assets displayed belong to their respective owners.

## Overview

This project provides a comprehensive platform for creating, managing, and tracking email campaigns. It started as a response to IFF's need for a branded, reliable alternative to one-time-use campaign tools.

**Key Features:**

- 📧 Campaign creation and management
- 👥 User authentication and authorization
- ✏️ Rich text editor for email templates
- 📊 Campaign tracking and analytics
- 🎨 Modern, accessible UI with Tailwind CSS
- 🔒 Secure backend with Cloudflare Workers
- 💾 Type-safe database queries with Kysely

## Quick Start

### Prerequisites

- Node.js v22.12.0 or higher
- pnpm package manager

### Installation

1. Clone and install:

   ```bash
   git clone <repository-url>
   cd iff
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   cp .dev.vars.example .dev.vars
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:4321](http://localhost:4321) to view the application.

## 🏗️ Project Structure

```
src/
├── api/                    # API routes and endpoints
│   ├── auth/              # Authentication endpoints
│   └── campaigns/         # Campaign API routes
├── components/            # Reusable components
│   ├── admin-*            # Admin layout components
│   ├── campaign-*         # Campaign-specific components
│   └── ui/                # shadcn UI components
├── layouts/               # Astro layout templates
├── lib/                   # Utilities and helpers
│   ├── auth.ts           # Authentication configuration
│   ├── db.ts             # Database setup
│   ├── campaigns.ts      # Campaign logic
│   └── ...
├── pages/                 # Astro page routes
│   ├── admin/            # Admin dashboard
│   ├── campaigns/        # Campaign pages
│   └── api/              # API endpoints
└── styles/               # Global styles
```

## 🧞 Available Commands

| Command        | Action                             |
| :------------- | :--------------------------------- |
| `pnpm dev`     | Start dev server at localhost:4321 |
| `pnpm build`   | Build for production               |
| `pnpm preview` | Preview production build locally   |

For detailed setup and deployment instructions, see [SETUP.md](SETUP.md).

## 🛠️ Tech Stack

- **Frontend**: Astro 6, React 19, Tailwind CSS 4
- **Backend**: Cloudflare Workers, Cloudflare D1
- **Database**: Kysely with D1
- **Authentication**: Better Auth
- **UI Components**: shadcn/ui
- **Editor**: TipTap (rich text)
- **Notifications**: Sonner (toasts)

## 📝 Database

Migrations are in the `migrations/` directory. Apply them with:

```bash
wrangler d1 migrations apply [database-name]
```

## 🚀 Deployment

Deploy to Cloudflare Pages:

```bash
pnpm build
wrangler deploy
```

## 📖 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Setup Guide](SETUP.md)
- [Internet Freedom Foundation](https://internetfreedom.in)
