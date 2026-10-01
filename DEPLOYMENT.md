# Burnly — Deployment Guide

This guide details step-by-step instructions for deploying Burnly to production infrastructure:
- **Database**: MongoDB Atlas
- **Backend API**: Render or Railway
- **Frontend SPA**: Vercel or Netlify

---

## 1. Database Setup (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write credentials.
3. In Network Access, add IP whitelist `0.0.0.0/0` (or Render/Railway egress IPs).
4. Copy the connection string:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/burnly?retryWrites=true&w=majority`

---

## 2. Backend API Deployment (Render / Railway)

### Environment Variables
Configure the following environment variables in your deployment dashboard:

| Variable | Recommended Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables secure `httpOnly` cookies & optimized logs |
| `PORT` | `10000` or assigned by platform | Listening port |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas URI |
| `JWT_SECRET` | 64-char random hex string | Access token signing |
| `JWT_REFRESH_SECRET` | 64-char random hex string | Refresh token signing |
| `CLIENT_URL` | `https://your-app.vercel.app` | **Must match production frontend domain** |
| `GEMINI_API_KEY` | `AIzaSy...` | Google AI Studio key |
| `LLM_MODEL` | `gemini-1.5-flash` | Production LLM model |
| `REPORT_DAILY_LIMIT` | `10` | Daily cap per user |

### Build & Start Commands
- **Build Command**: `npm ci`
- **Start Command**: `node server.js`

---

## 3. Frontend SPA Deployment (Vercel / Netlify)

### Environment Variables & Proxy Configuration
In production cross-origin setups (e.g. frontend on `app.vercel.app` and backend on `api.onrender.com`):
1. Ensure `CLIENT_URL` in backend environment matches `https://app.vercel.app`.
2. Configure `vercel.json` rewrites or proxy settings if using relative paths:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 4. Cross-Origin Cookie & CORS Security Notes

- In production cross-origin setups, refresh token cookies use `sameSite: 'none'` and `secure: true`.
- Browsers require HTTPS for `secure` cookies.
- Ensure CORS on backend is configured with `credentials: true` and explicit origin string matching the production frontend URL.
