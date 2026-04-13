# Setup Guide

## Prerequisites

- **Node.js**: v22.12.0 or higher
- **pnpm**: Package manager (recommended over npm/yarn)
- **Cloudflare Account**: For deploying to Cloudflare Workers/D1

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd iff
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .dev.vars.example .dev.vars
   ```

   Fill in the required environment variables in `.env.local`:
   - Database configuration
   - Authentication secrets
   - API keys (if needed)

## Development

### Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:4321`

### Project Structure

```
src/
├── api/              # API routes and endpoints
├── components/       # Reusable React/Astro components
│   └── ui/          # Shared UI components (shadcn)
├── layouts/         # Astro layout templates
├── lib/             # Utility functions and helpers
│   ├── auth.ts      # Authentication setup
│   ├── db.ts        # Database configuration
│   └── ...
├── pages/           # Astro pages (routing)
│   ├── admin/       # Admin dashboard pages
│   ├── api/         # API endpoints
│   └── campaigns/   # Campaign pages
└── styles/          # Global styles and Tailwind config
```

## Database

This project uses **Cloudflare D1** with **Kysely** as the query builder.

### Running Migrations

```bash
wrangler d1 migrations apply [database-name]
```

### Viewing Database

```bash
wrangler d1 execute [database-name] --interactive
```

## Building for Production

### Build the Project

```bash
pnpm build
```

This generates optimized static and dynamic assets in the `dist/` folder.

### Preview Build Locally

```bash
pnpm preview
```

Allows you to preview the production build before deployment.

## Deployment

This project is configured for **Cloudflare Pages** with **Cloudflare Workers** integration.

### Deploy to Cloudflare

```bash
pnpm build
wrangler deploy
```

Or use Cloudflare's Git integration for automatic deployments.

## Key Technologies

- **Astro 6**: Modern web framework
- **React 19**: Component library
- **Tailwind CSS 4**: Utility-first CSS
- **Better Auth**: Authentication system
- **Kysely + D1**: Type-safe database queries
- **TipTap**: Rich text editor
- **Sonner**: Toast notifications
- **shadcn/ui**: UI component library

## Useful Commands

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `pnpm dev`            | Start development server         |
| `pnpm build`          | Build for production             |
| `pnpm preview`        | Preview production build         |
| `pnpm astro add`      | Add integrations to Astro        |
| `pnpm generate-types` | Generate Cloudflare Worker types |

## Troubleshooting

### Port Already in Use

If port 4321 is already in use:

```bash
pnpm dev -- --port 3000
```

### Database Connection Issues

- Ensure Cloudflare credentials are properly configured in `wrangler.jsonc`
- Check that the D1 database name matches your configuration
- Run `wrangler login` to authenticate with Cloudflare

### Build Errors

- Clear the build cache: `rm -rf .astro dist`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Contributing

When making changes:

1. Follow the existing code style
2. Test locally with `pnpm dev`
3. Build and preview with `pnpm build && pnpm preview`
4. Ensure no TypeScript errors: `pnpm astro check`

## Support

For Astro documentation, visit [docs.astro.build](https://docs.astro.build)
