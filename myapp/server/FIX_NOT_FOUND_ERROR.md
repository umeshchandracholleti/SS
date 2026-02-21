# 🔧 FIX: "Not Found" Error on Render Deployment

## Problem
Getting "Not Found" when accessing `https://saiscientifics-api.onrender.com/api/health`

## Root Cause
Most likely: **Environment variables not properly set** OR **database connection string incorrect**

---

## SOLUTION: Step-by-Step Fix

### **Step 1: Verify Render Configuration**

Go to: https://dashboard.render.com → Your Service → Settings

Verify these are EXACTLY correct:

```
Name:              saiscientifics-api
Environment:       Node
Region:            Oregon (or your choice)
Branch:            main
Root Directory:    myapp/server    ← CRITICAL!
Build Command:     npm install
Start Command:     npm start
```

If Root Directory is wrong, FIX IT NOW:
1. Click "Settings"
2. Find "Root Directory"
3. Change to: `myapp/server`
4. Click "Save"
5. Render will redeploy automatically

---

### **Step 2: Check Environment Variables**

Go to: https://dashboard.render.com → Your Service → Environment

**Delete all variables first**, then add these EXACTLY:

```
DATABASE_URL
postgresql://postgres:YOUR_DB_PASSWORD@oregon-postgres.render.com:5432/myapp

NODE_ENV
production

PORT
10000

JWT_SECRET
550e8400-e29b-41d4-a716-446655440000

RAZORPAY_KEY_ID
rzp_test_YOUR_KEY_ID

RAZORPAY_KEY_SECRET
test_YOUR_KEY_SECRET

GMAIL_USER
your-email@gmail.com

GMAIL_PASSWORD
your_16_char_app_password

CORS_ORIGIN
https://saiscientifics-api.onrender.com

UPLOAD_DIR
uploads
```

⚠️ **CRITICAL**: Ensure DATABASE_URL is 100% correct:
- User: `postgres`
- Password: What you created in Render PostgreSQL
- Host: Check Render PostgreSQL dashboard
- Port: `5432`
- Database: `myapp`

**After adding all variables:**
1. Click "Save"
2. Render will restart the service (watch logs)

---

### **Step 3: Redeploy**

Go to: https://dashboard.render.com → Your Service

Scroll to top, click:
```
Manual Deploy → Deploy latest commit
```

Watch the logs. Should show:
```
Building...
npm install ✓
Starting...
Server started on port 10000 ✓
```

---

### **Step 4: Test**

Open in browser:
```
https://saiscientifics-api.onrender.com/api/health
```

Should show:
```json
{"status":"ok","timestamp":"2026-02-21...","database":"connected","environment":"production"}
```

---

## Troubleshooting

### If still showing "Not Found"

Check logs in Render dashboard:

1. Go to "Logs" tab
2. Look for errors like:
   - `ECONNREFUSED` → Database connection failed
   - `ENODENT` → File not found
   - `listen EADDRINUSE` → Port already in use
   - `MODULE NOT FOUND` → Missing dependency

### Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `ECONNREFUSED: connect ECONNREFUSED 127.0.0.1:5432` | Database URL wrong or PostgreSQL not created |
| `DATABASE_URL not set` | Add DATABASE_URL to Environment Variables |
| `Module not found: pg` | Run `npm install` locally first, then push |
| `Cannot find module '../middleware/auth'` | Check Root Directory is `myapp/server` |
| `listen EADDRINUSE: port 10000` | Port conflict - rebuild service |

---

## Quick Checklist

- [ ] Root Directory = `myapp/server`
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] DATABASE_URL set and formatted correctly
- [ ] NODE_ENV = production
- [ ] PORT = 10000
- [ ] All 9 environment variables filled
- [ ] Manual Deploy clicked
- [ ] Logs show "Server started on port 10000"
- [ ] Health check returns JSON response

---

## If Still Not Working

**DO THIS:**

1. Delete the current web service in Render
2. Create new web service from scratch
3. Follow exact steps above
4. Test

---

## Alternative: Test Locally First

Before deploying to Render, test locally:

```bash
cd myapp/server

# Set environment variables (Windows)
$env:DATABASE_URL='postgresql://postgres:010101@localhost:5432/myapp'
$env:JWT_SECRET='test-secret'
$env:RAZORPAY_KEY_ID='test'
$env:RAZORPAY_KEY_SECRET='test'
$env:NODE_ENV='production'

# Start server
npm start

# In another terminal, test:
# PowerShell: Invoke-WebRequest http://localhost:4000/api/health
```

If it works locally, use same configuration for Render.

---

**Status**: Ready to deploy!
Tell me when you've made these changes and I'll help verify! 💪
