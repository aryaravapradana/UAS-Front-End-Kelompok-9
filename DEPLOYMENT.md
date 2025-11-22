# 🚀 DEPLOYMENT GUIDE: Railway + Vercel

## ✅ COMPLETED STEPS

### 1. Frontend URL Replacement

- ✅ Created centralized API configuration (`frontend/lib/api.js`)
- ✅ Replaced all 45+ hardcoded localhost URLs
- ✅ Added environment variable support
- ✅ Created `.env.local` for development
- ✅ Created `.env.production.template` for production

---

## 📋 DEPLOYMENT CHECKLIST

### PHASE 1: Backend Deployment (Railway)

#### Step 1: Update Backend CORS

File: `backend/index.js`

Replace the CORS section with:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
```

#### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)** → Login with GitHub

2. **New Project** → **Deploy from GitHub repo**

   - Select: `UAS-Front-End-Kelompok-9`

3. **Configure Service:**

   - Settings → **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

4. **Add Environment Variables** (copy from `backend/.env`):

   ```
   DATABASE_URL=mongodb+srv://arya:arya@aryaravapradana.r39b2.mongodb.net/UCCD?retryWrites=true&w=majority
   JWT_SECRET=thisisasecretkeythatshouldbechanged
   CLOUDFLARE_ENDPOINT=https://3760decf39ba4d09d0252a7a33b7d78b.r2.cloudflarestorage.com
   CLOUDFLARE_ACCESS_KEY_ID=6fa4e0397f6ae0ef34cefc7fdfa299bc
   CLOUDFLARE_SECRET_ACCESS_KEY=bf5a60e573d43955ded3e04a93a72829fdcaf83531b537863062d2dcf5d2165e
   CLOUDFLARE_BUCKET_NAME=uccd
   CLOUDFLARE_WORKER_DOMAIN=https://uccdphoto.aryaravathird.workers.dev/
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=tolakangincinta@gmail.com
   EMAIL_PASS=rpsxdmsrwvbaeknw
   EMAIL_FROM=noreply@example.com
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Deploy** → Wait for completion (~3-5 minutes)

6. **Get Railway URL:**

   - Settings → Networking → Copy **Public Domain**
   - Example: `uccd-backend.up.railway.app`

7. **Update Environment Variable:**

   - Add `BACKEND_URL` = `https://your-backend.up.railway.app`

8. **Test Backend:**
   ```bash
   curl https://your-backend.up.railway.app/api/lombas
   ```

---

### PHASE 2: Frontend Deployment (Vercel)

#### Step 1: Update Production Environment

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
```

Replace `your-backend.up.railway.app` with your actual Railway URL.

#### Step 2: Test Build Locally

```bash
cd frontend
npm run build
npm start
```

Open `http://localhost:3000` and test:

- Login
- Dashboard
- API calls working

#### Step 3: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [vercel.com](https://vercel.com) → Login with GitHub

2. **Import Project** → Select `UAS-Front-End-Kelompok-9`

3. **Configure Project:**

   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Environment Variables:**

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```

5. **Deploy** → Wait (~2-3 minutes)

6. **Get Vercel URL** (e.g., `uccd-app.vercel.app`)

**Option B: Via Vercel CLI**

```bash
cd frontend
npm i -g vercel
vercel login
vercel --prod
```

#### Step 4: Update Backend CORS

Go back to Railway → Environment Variables:

- Update `FRONTEND_URL` = `https://your-app.vercel.app`
- Redeploy backend

---

### PHASE 3: MongoDB Configuration

#### Update MongoDB Atlas IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Network Access → Add IP Address
3. Add: `0.0.0.0/0` (Allow from anywhere)
   - Or add specific Railway IPs if you want more security

---

### PHASE 4: Testing

#### Test Checklist:

**Frontend (Vercel):**

- [ ] Homepage loads
- [ ] Login works
- [ ] Register works
- [ ] Dashboard loads with data
- [ ] Profile picture upload works
- [ ] All pages load correctly

**Backend (Railway):**

- [ ] API endpoints respond
- [ ] Database connections work
- [ ] File uploads to Cloudflare R2 work
- [ ] Email sending works

**Integration:**

- [ ] No CORS errors
- [ ] Authentication works
- [ ] All API calls successful
- [ ] Images load from Cloudflare

---

## 🔧 TROUBLESHOOTING

### Common Issues:

**1. CORS Error**

```
Access to fetch at 'https://backend.railway.app' from origin 'https://app.vercel.app' has been blocked by CORS
```

**Solution:** Update `FRONTEND_URL` in Railway env vars and redeploy

**2. API Not Found (404)**

```
GET https://your-backend.railway.app/api/lombas 404
```

**Solution:** Check Railway logs, ensure backend deployed correctly

**3. Database Connection Error**

```
PrismaClientInitializationError: Can't reach database server
```

**Solution:**

- Check `DATABASE_URL` in Railway
- Verify MongoDB Atlas IP whitelist
- Check MongoDB connection string

**4. Environment Variable Not Working**

```
NEXT_PUBLIC_API_URL is undefined
```

**Solution:**

- Ensure variable starts with `NEXT_PUBLIC_`
- Redeploy Vercel after adding env vars
- Clear Next.js cache: `rm -rf .next`

**5. Build Error on Vercel**

```
Module not found: Can't resolve '@/lib/api'
```

**Solution:** Ensure `jsconfig.json` has correct paths configuration

---

## 📊 DEPLOYMENT URLS

After deployment, update these:

**Frontend (Vercel):**

- Production: `https://your-app.vercel.app`
- Preview: `https://your-app-git-branch.vercel.app`

**Backend (Railway):**

- Production: `https://your-backend.up.railway.app`

**Database:**

- MongoDB Atlas: `mongodb+srv://...`

---

## 🎯 POST-DEPLOYMENT

### 1. Update README

Add deployment URLs to your README.md

### 2. Monitor Logs

- Vercel: Dashboard → Logs
- Railway: Dashboard → Deployments → View Logs

### 3. Set up Custom Domain (Optional)

- Vercel: Settings → Domains
- Railway: Settings → Networking → Custom Domain

### 4. Enable Analytics (Optional)

- Vercel Analytics
- Railway Metrics

---

## 📝 NOTES

- **Free Tier Limits:**

  - Vercel: 100GB bandwidth/month
  - Railway: $5 free credit/month
  - MongoDB Atlas: 512MB storage (free tier)

- **Cold Starts:**

  - Railway may have cold starts (~5-10s) on free tier
  - First request after inactivity might be slow

- **Environment Variables:**
  - Never commit `.env` files
  - Use `.env.example` for documentation
  - Vercel env vars are encrypted

---

## ✅ COMPLETION CHECKLIST

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] MongoDB accessible
- [ ] All features tested
- [ ] URLs updated in README
- [ ] Team notified of deployment

---

**Need help?** Check:

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
