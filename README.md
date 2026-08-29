# Aathithi Aangan

A fast, one-page property website for Aathithi Aangan, a peaceful Ranchi stay surrounded by greenery.

## Stack

- Astro with TypeScript
- Tailwind CSS 4
- Static output, ready for Cloudflare Pages

## Local development

```sh
npm run dev
```

Run a production validation with:

```sh
npm run check && npm run build
```

## Project structure

```text
src/
├── components/    # Independent page sections and shared interface elements
├── content/       # Property facts, copy, destinations, and public contact links
├── layouts/       # Shared document metadata and structured data
├── pages/         # Astro routes
└── styles/        # Brand design tokens and global styles
images/            # Original AVIF property photography, built into the site by Astro
public/brand/      # Reusable logo mark for social profiles and the site
```

## Updating public details

Update the single content source in [src/content/property.ts](src/content/property.ts) for the Airbnb destination, contact number, Instagram handle, stay facts, and property copy. This keeps content changes separate from page design.

## Deploying to production with Cloudflare Pages

The repository includes an automated GitHub Actions deployment pipeline. Pull requests are checked, and every push to the `main` branch builds and deploys the site to Cloudflare Pages production.

### First-time setup

1. Create a new, empty GitHub repository named `aathithi-aangan`.
2. Create a **Direct Upload** Cloudflare Pages project named `aathithi-aangan`. Do not connect the repository through the Cloudflare Git integration, because GitHub Actions owns deployments for this project.
3. In Cloudflare, create an API token named `aathithi-aangan-github-deploy` with the **Account → Cloudflare Pages → Edit** permission.
4. Copy the Cloudflare **Account ID** from the dashboard.
5. In GitHub, open the repository’s **Settings → Environments**, create an environment named `production`, then add these environment secrets:
	- `CLOUDFLARE_API_TOKEN` — the token from step 3
	- `CLOUDFLARE_ACCOUNT_ID` — the ID from step 4
6. Push the `main` branch. The [production deploy workflow](.github/workflows/deploy-production.yml) publishes the generated `dist` folder and reports the live URL in the Actions run.

After the first successful deployment, attach a custom domain from the Pages project’s **Custom domains** settings. Cloudflare creates and renews HTTPS automatically.

### Delivery workflow

- A pull request into `main` runs `npm run check` and `npm run build` through [CI](.github/workflows/ci.yml).
- A push to `main` repeats those checks and automatically deploys to production through [CD](.github/workflows/deploy-production.yml).
- Commits to any other branch do not change production.

Before changing public property details, review the values in [src/content/property.ts](src/content/property.ts), especially the placeholder `airbnbUrl`.
