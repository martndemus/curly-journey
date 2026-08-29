# curly-journey

A static site built by `scripts/build-site.sh` into `_site/` and deployed to GitHub Pages.

## Deployment

- **Main site** (`.github/workflows/deploy.yml`) — deploys `_site/` to GitHub Pages on every push to `main`.
- **PR previews** (`.github/workflows/pr-preview.yml`) — on PR open/sync/reopen, builds the PR's `_site/`, merges it into the live Pages artifact under `preview/<pr-number>/`, and redeploys. The preview is registered as a `preview` deployment on the PR with a direct link to `https://martndemus.github.io/curly-journey/preview/<pr-number>/`.
- **PR preview cleanup** (`.github/workflows/pr-preview-cleanup.yml`) — on PR close (merged or not), removes `preview/<pr-number>/` from the artifact and redeploys.

All three workflows share the `pages` concurrency group so they never run at the same time and clobber each other's changes to the shared Pages artifact.

Live site: https://martndemus.github.io/curly-journey/
