# 🚀 Deployment Guide - NeuroTrack AI

## Git Push Commands

### First Time Setup (if not already done)
```bash
# Navigate to project root
cd "c:\Users\91859\NeuroTrack AI"

# Initialize git (if not already initialized)
git init

# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/NeuroTrack-AI.git

# Check current branch
git branch
```

### Standard Push Workflow

#### 1. Check Status
```bash
git status
```

#### 2. Add All Changes
```bash
# Add all files
git add .

# OR add specific files
git add frontend/actions/ai.ts
git add frontend/.env.example
```

#### 3. Commit Changes
```bash
# Use conventional commit messages
git commit -m "feat: migrate to server actions and better-auth"

# OR more detailed
git commit -m "feat: complete migration to Next.js-only architecture

- Remove backend folder
- Migrate to server actions (auth, sessions, ai)
- Implement better-auth with Google OAuth
- Update AI to use Gemini 2.5 Flash
- Add environment variable examples"
```

#### 4. Push to GitHub
```bash
# Push to main branch
git push origin main

# OR push to dev branch
git push origin dev

# Force push (use carefully!)
git push -f origin main
```

### Complete Push Command (All-in-One)
```bash
cd "c:\Users\91859\NeuroTrack AI"
git add .
git commit -m "feat: complete migration to server actions and better-auth"
git push origin main
```

---

## Branch Management

### Create and Push New Branch
```bash
# Create new branch
git checkout -b feature/new-feature

# Make changes, then push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

### Switch Between Branches
```bash
# Switch to main
git checkout main

# Switch to dev
git checkout dev

# Create and switch to new branch
git checkout -b feature/ai-improvements
```

---

## Deploy to Vercel

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend
cd "c:\Users\91859\NeuroTrack AI\frontend"

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration (Easiest)
1. Push code to GitHub (use commands above)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables (see below)
7. Click "Deploy"

---

## Environment Variables for Vercel

### Add in Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```env
MONGODB_URI=mongodb://your-username:your-password@host:27017/...
BETTER_AUTH_SECRET=your-random-secret-32-chars
BETTER_AUTH_URL=https://your-app.vercel.app
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_API_KEY=your-gemini-api-key
```

### Important Notes:
- Set environment for: **Production**, **Preview**, and **Development**
- Update `BETTER_AUTH_URL` to your actual Vercel URL after first deployment
- Redeploy after adding environment variables

---

## Post-Deployment Checklist

### 1. Update Google OAuth Redirect URIs
Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
Add authorized redirect URI:
```
https://your-app.vercel.app/api/auth/callback/google
```

### 2. Update MongoDB Network Access
Go to [MongoDB Atlas](https://cloud.mongodb.com)
- Network Access → Add IP Address
- Allow access from anywhere: `0.0.0.0/0`

### 3. Test Your Deployment
- Visit your Vercel URL
- Test login with email/password
- Test Google OAuth login
- Create a study session
- Test AI features (Generate Insights, Summarize Notes)

---

## Troubleshooting

### Push Rejected
```bash
# Pull latest changes first
git pull origin main --rebase

# Then push
git push origin main
```

### Merge Conflicts
```bash
# See conflicted files
git status

# Resolve conflicts in your editor
# Then:
git add .
git commit -m "fix: resolve merge conflicts"
git push origin main
```

### Vercel Build Failed
1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Test build locally:
```bash
cd frontend
npm run build
```

### MongoDB Connection Failed
- Check `MONGODB_URI` format
- Verify IP whitelist in MongoDB Atlas
- Test connection locally first

---

## Quick Reference

### Most Common Commands
```bash
# Status
git status

# Add all changes
git add .

# Commit
git commit -m "feat: your message"

# Push
git push origin main

# Pull latest
git pull origin main

# Deploy to Vercel
vercel --prod
```

### Conventional Commit Prefixes
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Git Docs**: https://git-scm.com/doc
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
