# Deployment Instructions

## Problem Fixed

The server was returning HTML instead of JavaScript files for module scripts, causing the error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

## Root Cause

The server at `preview.xterraengine.com` was likely using a misconfigured web server (nginx/apache) that was redirecting ALL routes (including `/assets/*.js`) to `index.html` as part of SPA routing configuration.

## Changes Made

1. **vite.config.js** - Added proper build configuration with manifest and caching
2. **Dockerfile** - Uses `serve` which automatically sets correct Content-Type headers for JavaScript files

NOTE: The `serve` package automatically handles SPA routing AND serves static assets with correct MIME types. No additional configuration needed.

## How to Rebuild and Deploy

### 1. Build locally (test first)

```bash
cd /Users/luiscifuentes/WebstormProjects/xt-video-preview

# Install dependencies
npm install

# Build for production
npm run build

# Test locally with serve
npx serve -s dist -l 5225
```

Visit http://localhost:5225 to verify it works.

### 2. Build and deploy with Docker

```bash
# Build Docker image
docker build -t xt-video-preview:latest .

# Run locally to test
docker run -p 5225:5225 xt-video-preview:latest
```

Visit http://localhost:5225 to verify it works.

### 3. Deploy to production

Push the changes to git and rebuild the container on your server:

```bash
# On your development machine
git add .
git commit -m "fix: Configure serve to properly serve JavaScript module files"
git push

# On your server (preview.xterraengine.com)
git pull
docker-compose down
docker-compose up -d --build
```

## Verification

After deployment, check that:
1. The page loads without JavaScript errors
2. The WebView in Android app shows content (not blank white screen)
3. Browser console shows no "Failed to load module script" errors

## Cache Note

The WebView in the Android app has caching enabled (`LOAD_CACHE_ELSE_NETWORK`), so after fixing the server:
- First load: Will download and cache the corrected version
- Subsequent loads: Will use the cached version (instant load)
- Updates: Will be detected automatically and re-downloaded
