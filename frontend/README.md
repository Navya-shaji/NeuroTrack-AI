# 🧠 NeuroTrack AI - Advanced Study Management System

NeuroTrack AI is a sophisticated, AI-powered study tracking platform built with **Next.js 16**, designed to move beyond basic CRUD applications by providing intelligent insights and resilient data management for students.

## 🚀 Key Features

- **Smart CRUD**: Full lifecycle management of study sessions with subject-based filtering and analytics.
- **AI-Powered Insights**: Integrated **Google Gemini AI** to analyze study patterns and provide personalized recommendations.
- **Data Visualization**: Interactive progress tracking using **Recharts** for weekly and subject-specific analysis.
- **Enterprise-Grade Auth**: Secure authentication via **Google OAuth** and **JWT-based** session management.
- **Premium UI/UX**: A clean, monochromatic "White & Light Purple" design system built with **Tailwind CSS**.

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4.0
- **Database**: MongoDB (Mongoose ORM)
- **AI Library**: Google Generative AI SDK
- **Icons/Charts**: Lucide React, Recharts

## 💡 Sophisticated Problem Solving

Unlike a standard task manager, NeuroTrack AI addresses real-world challenges:
1. **AI Resilience**: Implemented sophisticated fallback mechanisms (Demo Mode) to ensure high availability even when external AI quotas are exceeded.
2. **Security**: Multi-layered auth strategy using HTTP-only cookies and decryption middleware for protected routes.
3. **Optimized Routing**: Leveraging Next.js 16's latest async patterns for dynamic API parameters and server-side rendering.
4. **Data Sanitization**: Robust validation using **Zod** to prevent injection and ensure data integrity.

## 📦 Getting Started

1. **Clone and Install**:
   ```bash
   git clone https://github.com/Navya-shaji/NeuroTrack-AI.git
   cd NeuroTrack-AI/frontend
   npm install
   ```

2. **Environment Setup**:
   Create a `.env.local` with:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_API_KEY` (Gemini)

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---
Developed by **Navya Shaji** | [LinkedIn](https://linkedin.com/in/navya-shaji) | [GitHub](https://github.com/Navya-shaji)
