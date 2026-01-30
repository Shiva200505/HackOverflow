# 🏠 Smart Hostel Tracker

> **HackOverflow 2026** - Advanced Issue Tracking & Hostel Management System

A modern, AI-powered platform for streamlining hostel management, issue reporting, and communications between students and administration.

## ✨ Key Features

### 🎙️ AI Voice Reporting
-   **Hands-free Reporting**: Speak your issue naturally (e.g., "The fan in room 103 is broken and dangerously loose").
-   **Groq AI Integration**: Powered by `gpt-oss-120b` to intelligently parse your voice note.
-   **Auto-Categorization**: AI automatically detects the category (Electrical, Plumbing, etc.) and Priority level (High, Emergency).

### 📢 Smart Announcements
-   **Targeted Broadcasts**: Send announcements to specific Hostels, Blocks, or User Roles (Students vs Management).
-   **Structured Types**: categorized updates like Cleaning, Maintenance, Events, etc.

### 🛠️ Issue Management
-   **Real-time Tracking**: Monitor status from Reported → In Progress → Resolved.
-   **Visual Dashboard**: Analytics and leaderboard for most active contributors.
-   **Privacy Controls**: Public vs Private issue visibility.

### 📦 Lost & Found
-   **Digital Lost & Found**: Report lost items or claim found ones with image support.

## 🚀 Tech Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), TailwindCSS, Shadcn UI
-   **Backend**: Next.js Server Actions & API Routes
-   **Database**: PostgreSQL (via Supabase) with Prisma ORM
-   **AI**: [Groq SDK](https://groq.com/) (Llama 3 / GPT-OSS models)
-   **Auth**: NextAuth.js v5

## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Shiva200505/HackOverflow.git
    cd HackOverflow/hostel-tracker
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    # Database (Supabase)
    DATABASE_URL="your_postgres_connection_string"
    DIRECT_URL="your_direct_connection_string"

    # Auth
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your_secret_key"

    # AI (Groq)
    GROQ_API_KEY="your_groq_api_key"
    ```

4.  **Run Database Migrations**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start Development Server**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

Built with ❤️ for **HackOverflow 2026**.
