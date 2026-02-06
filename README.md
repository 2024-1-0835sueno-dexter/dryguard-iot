This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Real-time Backend (Render)

This app expects a separate real-time backend (Express + WebSocket + MQTT) that lives in
the [server](server) folder.

### Deploy the backend to Render

1. Create a new **Web Service** on Render, and connect the same GitHub repo.
2. Use these settings:
	- Root Directory: `.`
	- Build Command: `npm install`
	- Start Command: `node server/server.js`
	- Health Check Path: `/health`
3. Add environment variables in Render (see [.env.example](.env.example)):
	- `MQTT_URL`
	- `MQTT_SENSORS_TOPIC`
	- `MQTT_ACTIONS_TOPIC`
	- `MONGODB_URI` (optional)
	- `MONGODB_DB` (optional)

### Point the frontend to Render

In Vercel (Project Settings 5d4 Environment Variables):

```
NEXT_PUBLIC_API_BASE=https://YOUR-RENDER-SERVICE.onrender.com
NEXT_PUBLIC_WS_URL=wss://YOUR-RENDER-SERVICE.onrender.com
```

After redeploy, the dashboard, notifications, and settings pages will use the live
WebSocket + REST API and update in real time.
