# Cloudflare deployment

This deployment runs the full Next.js site on Cloudflare Workers. Material
metadata (`data/materials.json`) and uploads (`uploads/`) are stored in the
private R2 bucket `maralik2-school-content` and served through `/api/files/...`.
Without the R2 binding (local dev, Vercel) the site keeps using Vercel Blob.

1. Create the bucket: `npx wrangler r2 bucket create maralik2-school-content`
2. Sign in with `npx wrangler login` on the deployment machine.
3. Set the admin credentials as Worker secrets (use the existing secure values):
   `npx wrangler secret put ADMIN_LOGIN` and `npx wrangler secret put ADMIN_TOKEN`.
   Do not commit these values.
4. Run `npm ci` and `npm run deploy:cloudflare`. Verify `/hy`, `/admin/login`,
   `/api/materials` and an authenticated upload on the `workers.dev` URL before
   switching the domain.
5. Add `maralik2school.am` (and `www`) as Worker custom domains.

When importing old Vercel Blob material, merge entries into the existing R2
list and copy files first. Never overwrite the R2 JSON with an old archive.
