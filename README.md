<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/8b07731e-4307-4d01-9100-e6d742173428

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Zeabur

This repository is a full-stack Express + Vite application. Deploy the GitHub
repository as the service source. The root `zbpack.json` explicitly selects the
root `Dockerfile` so `/api/*` routes are served by Express.

Do not redeploy the AI Studio preview or Chrome-extension snapshot to the same
Zeabur service. Those snapshots are static Vite builds and will replace the
Express backend.
