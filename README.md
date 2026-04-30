# NeuroTrack AI 🧠

NeuroTrack AI is a premium study session tracker and analyzer that leverages AI to help students optimize their learning patterns. Track your study sessions, visualize progress with interactive charts, and get personalized AI-driven insights to boost productivity.

## 🚀 Features

- **AI Study Insights**: Generate personalized summaries and focus suggestions based on your recent activity.
- **Note Summarization**: Instantly condense session notes into key bullet points using Gemini AI.
- **Advanced Dashboard**: Visualize study time, subject distribution, and weekly progress with Recharts.
- **Secure Authentication**: Robust JWT-based auth system for user privacy.
- **Session Management**: Full CRUD functionality for logging and editing study sessions.
- **Premium UI**: Modern dark-mode aesthetic with glassmorphism, smooth animations, and responsive design.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js API Routes, Mongoose (MongoDB).
- **AI**: Google Gemini 1.5 Flash.
- **Validation**: Zod.
- **Auth**: Jose (JWT).

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Navya-shaji/NeuroTrack-AI.git
   cd NeuroTrack-AI
   ```

2. **Install dependencies**:
   ```bash
   # Root
   npm install
   
   # Frontend
   cd frontend
   npm install
   
   # Backend (if separate)
   cd ../backend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` in the `frontend` folder:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_gemini_api_key
   ```

4. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🔄 Git Workflow

We follow a structured branching and merging strategy:

- **Feature-based branching**: Create a new branch for every feature or fix (e.g., `feature/ai-insights`).
- **PR-based merging**: All features must be merged into the `dev` branch via Pull Requests.
- **Production Branch**: The `main` branch is our stable production environment. Only tested and approved code from `dev` is merged here.

## 📝 Commit Convention

To keep our history clean and readable, please use the following prefixes:

- `feat:` for new features or functionality.
- `fix:` for bug fixes.
- `refactor:` for code changes that neither fix a bug nor add a feature.

## 🤖 CI/CD

The project uses GitHub Actions for automated quality checks:
- **Linting & Type Checking**: Runs on every Pull Request to `dev` or `main`.
- **Build Validation**: Ensures the application builds correctly before merging.

---
Built with ❤️ by [Navya Shaji](https://github.com/Navya-shaji)
