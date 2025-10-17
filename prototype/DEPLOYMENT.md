# DEPLOYMENT GUIDE

## Local Development

```bash
cd prototype
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Building for Production

```bash
npm run build
```

This generates a `dist/` folder with optimized, minified assets ready for deployment.

## Deployment Options

### Option 1: GitHub Pages (Free)

1. Create a GitHub repository.
2. Push the project to GitHub.
3. Create a `gh-pages` branch:
   ```bash
   npm run build
   git subtree push --prefix dist origin gh-pages
   ```
4. Enable GitHub Pages in repository settings → branch: gh-pages.
5. Site will be available at `https://username.github.io/repo-name`.

### Option 2: Netlify (Free to Premium)

1. Connect your GitHub repo to Netlify.
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on every push.

### Option 3: Vercel (Free to Premium)

1. Import project from GitHub.
2. Vercel auto-detects Vite config.
3. One-click deployment.

### Option 4: AWS S3 + CloudFront

```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Option 5: Docker + AWS ECS / Kubernetes

Build and push Docker image:
```bash
docker build -t cyberhubs-assessment .
docker tag cyberhubs-assessment:latest YOUR_REGISTRY/cyberhubs-assessment:latest
docker push YOUR_REGISTRY/cyberhubs-assessment:latest
```

Deploy to ECS or Kubernetes cluster.

### Option 6: Azure Static Web Apps

1. Create Azure Static Web App resource.
2. Connect GitHub repo.
3. Configure build settings (auto-detected from package.json).
4. Deploy.

## Environment Configuration

For production deployments, optionally set environment variables:

```bash
# .env.production
VITE_API_URL=https://api.example.com  # (for future backend integration)
VITE_ANALYTICS_KEY=your-key
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Monitoring & Analytics

### Optional: Add Sentry for Error Tracking

```bash
npm install @sentry/react @sentry/tracing
```

In `src/main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new Sentry.Replay()],
  tracesSampleRate: 0.1,
});
```

### Optional: Add Google Analytics

Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Post-Deployment Checklist

- [ ] Test all 8 language options.
- [ ] Verify assessment flow works end-to-end.
- [ ] Check mobile responsiveness.
- [ ] Run Lighthouse audit (target: 90+ performance, 100 accessibility).
- [ ] Test on various browsers (Chrome, Firefox, Safari, Edge).
- [ ] Verify HTTPS certificate is valid.
- [ ] Set up error logging/monitoring.
- [ ] Announce to CyberHubs network.

## Performance Optimization Tips

1. **Enable Gzip Compression** — Configure on your hosting.
2. **Set Cache Headers** — Dist assets can be cached aggressively.
3. **CDN Delivery** — Use CloudFront, Cloudflare, or jsDelivr.
4. **Lazy Loading** — For future feature expansion, use React.lazy().

## Rollback Plan

If issues arise post-deployment:

1. Revert to previous commit in version control.
2. Rebuild and redeploy.
3. Or roll back to previous CloudFront/CDN cache version if available.

## Support

For deployment questions or issues, open an issue in the repository or contact the development team.
