# Racko Game - Deployment Guide

## Complete Deployment Instructions

This guide will walk you through deploying your Racko multiplayer game using:
- **Cloudflare Pages** (Frontend)
- **Render.com** (Backend)

---

## Part 1: Deploy Backend to Render.com

### Step 1: Prepare Your Backend Files

Create a folder called `racko-backend` with these files:
- `server.js`
- `package.json`
- `.gitignore`

### Step 2: Push to GitHub

1. Go to GitHub and create a new repository called `racko-backend`
2. In your backend folder, run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/racko-backend.git
git push -u origin main
```

### Step 3: Deploy on Render.com

1. Go to [render.com](https://render.com) and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your `racko-backend` repository
5. Configure:
   - **Name:** `racko-game` (or whatever you want)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. **Copy your URL!** It will be something like: `https://racko-game-xxxx.onrender.com`

---

## Part 2: Deploy Frontend to Cloudflare Pages

### Step 1: Update the Backend URL

1. Open `racko-client.js`
2. Find this line (near the top):
```javascript
const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000'
  : 'https://YOUR-APP-NAME.onrender.com'; // UPDATE THIS!
```
3. Replace `YOUR-APP-NAME.onrender.com` with your actual Render.com URL

### Step 2: Prepare Frontend Files

Create a folder called `racko-frontend` with these files:
- `index.html`
- `racko-client.js` (with updated URL)

### Step 3: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/racko-frontend.git
git push -u origin main
```

### Step 4: Deploy on Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up/login (free)
3. Go to "Workers & Pages" → "Create application" → "Pages"
4. Connect to Git → Select your `racko-frontend` repo
5. Configure:
   - **Project name:** `racko-game`
   - **Production branch:** `main`
   - **Build settings:** None (it's static files)
6. Click "Save and Deploy"
7. Wait for deployment (1-2 minutes)
8. Your site will be live at: `https://racko-game.pages.dev`

---

## Part 3: Testing

1. Open your Cloudflare Pages URL
2. Create a game
3. Share the room code with a friend
4. Play!

---

## Troubleshooting

### "Connection error" message
- Check that the SOCKET_URL in `racko-client.js` matches your Render.com URL exactly
- Make sure your Render.com service is running (it may sleep after 15 min of inactivity on free plan)

### Render.com app sleeping
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleeping takes 30-60 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on service

### Can't connect to game
- Check browser console for errors (F12)
- Verify both services are deployed and running
- Make sure CORS is enabled in server.js (it should be)

---

## Alternative: Deploy Both Together

If you want simpler deployment, you can use Render.com for both:

1. Put both frontend and backend files in one repo
2. Move `index.html` and `racko-client.js` to a `public` folder
3. Change SOCKET_URL to use relative paths
4. Deploy as one service on Render.com

---

## Cost Summary

**Free Option:**
- Render.com: Free (sleeps after 15 min)
- Cloudflare Pages: Free (always on)
- Total: $0/month

**Upgrade Option:**
- Render.com: $7/month (always on, faster)
- Cloudflare Pages: Free
- Total: $7/month

---

## Next Steps

After deployment, you can:
1. Add custom domain to Cloudflare Pages
2. Enable analytics
3. Add more features to your game
4. Set up a database (MongoDB, PostgreSQL) for persistent game history

Enjoy your deployed Racko game!
