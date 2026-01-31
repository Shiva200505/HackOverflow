# 🏠 Smart Hostel Tracker

> **HackOverflow 2026** - Advanced AI-Powered Hostel Management System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-00C7B7?style=for-the-badge&logo=render)](https://hackoverflow-ly4v.onrender.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

A modern, AI-powered platform for streamlining hostel management, issue reporting, and communications between students and administration. Built for **HackOverflow 2026**.

## 🌐 Live Demo

**🚀 [Visit Live Application](https://hackoverflow-ly4v.onrender.com)**

> **Note**: The free-tier Render deployment spins down after 15 minutes of inactivity. First load may take 30 seconds to wake up.

---

## ✨ Key Features

### 🎙️ AI Voice Reporting
- **Hands-free Issue Reporting**: Speak your issue naturally (e.g., "The fan in room 103 is broken and dangerously loose")
- **Groq AI Integration**: Powered by Llama models (`llama-3.3-70b-versatile`) to intelligently parse voice input
- **Auto-Categorization**: AI automatically detects:
  - **Category**: Electrical, Plumbing, Cleanliness, Internet, Furniture, Security
  - **Priority Level**: Low, Medium, High, Emergency
  - **Location**: Hostel, Block, and Room number extraction
- **Smart Field Extraction**: Automatically fills form fields from natural language

### 📢 Smart Announcements System
- **Targeted Broadcasting**: Send announcements to specific audiences
  - Filter by Hostel (e.g., "Boys Hostel A", "Girls Hostel B")
  - Filter by Block (e.g., "Block A", "Block B")
  - Filter by User Role (Students vs Management)
- **Structured Types**: Categorized updates
  - 🧹 Cleaning Schedules
  - 🐛 Pest Control Notifications
  - ⚠️ Downtime Alerts
  - 🔧 Maintenance Updates
  - 📢 General Announcements
- **Interactive Engagement**: Comment and react to announcements

### 🛠️ Comprehensive Issue Management
- **Real-time Status Tracking**: Monitor issues through their lifecycle
  - 📝 Reported → 📋 Assigned → 🔄 In Progress → ✅ Resolved → 🔒 Closed
- **Visual Analytics Dashboard**:
  - Issue distribution by category and priority
  - Resolution time tracking
  - Trends and insights with interactive charts
- **Leaderboard System**: Recognize most active contributors
- **Privacy Controls**: Public vs Private issue visibility
- **Image Upload Support**: Multi-image attachments via UploadThing
- **QR Code Scanner**: Quick access to issue details

### 📦 Lost & Found System
- **Digital Lost & Found Board**: Report lost items or claim found ones
- **Image Support**: Upload pictures of lost/found items
- **Status Tracking**: Active → Claimed → Closed
- **Contact Information**: Secure contact details for item recovery
- **Claim Management**: Approval workflow for item claims

### 📊 Analytics & Insights
- **Real-time Dashboards**: Track hostel performance metrics
- **Sentiment Analysis**: Gauge student satisfaction
- **Category Distribution**: Visual breakdown of issue types
- **Response Time Metrics**: Monitor resolution efficiency

---

## 🚀 Tech Stack

### Frontend
- **[Next.js 16.1](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn UI](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Recharts](https://recharts.org/)** - Interactive data visualization

### Backend
- **Next.js Server Actions** - Type-safe server functions
- **Next.js API Routes** - RESTful API endpoints
- **[NextAuth.js v5](https://authjs.dev/)** - Secure authentication

### Database & ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Supabase](https://supabase.com/)** - Database hosting & connection pooling
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM

### AI & Media
- **[Groq SDK](https://groq.com/)** - Ultra-fast AI inference (Llama 3.3 70B)
- **[UploadThing](https://uploadthing.com/)** - File upload service
- **[qrcode.react](https://www.npmjs.com/package/qrcode.react)** - QR code generation

### State Management & Forms
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Deployment
- **[Render](https://render.com/)** - Production hosting
- **[GitHub](https://github.com/)** - Version control & CI/CD

---

## 📁 Project Structure

```
hostel-tracker/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   ├── analytics/       # Analytics & insights
│   │   ├── announcements/   # Announcement management
│   │   ├── dashboard/       # Main dashboard
│   │   ├── issues/          # Issue tracking
│   │   ├── leaderboard/     # User leaderboard
│   │   ├── lost-found/      # Lost & Found system
│   │   └── qr-scanner/      # QR code scanner
│   ├── api/                 # API routes
│   │   ├── ai/              # AI processing endpoints
│   │   ├── analytics/       # Analytics endpoints
│   │   ├── announcements/   # Announcement APIs
│   │   ├── auth/            # NextAuth handlers
│   │   ├── issues/          # Issue management APIs
│   │   ├── leaderboard/     # Leaderboard APIs
│   │   ├── lost-found/      # Lost & Found APIs
│   │   └── uploadthing/     # File upload handlers
│   └── page.tsx             # Landing page
├── components/              # Reusable React components
│   ├── analytics/           # Analytics components
│   ├── announcements/       # Announcement components
│   ├── dashboard/           # Dashboard widgets
│   ├── issues/              # Issue components
│   ├── lost-found/          # Lost & Found components
│   └── ui/                  # Base UI components (Shadcn)
├── lib/                     # Utilities & configurations
│   ├── auth.ts              # NextAuth configuration
│   ├── groq.ts              # Groq AI client
│   ├── prisma.ts            # Prisma client
│   ├── uploadthing.ts       # UploadThing config
│   └── validations.ts       # Zod schemas
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── package.json
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 20.x or higher
- **PostgreSQL** database (or Supabase account)
- **npm** or **pnpm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Shiva200505/HackOverflow.git
cd HackOverflow/hostel-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_generated_secret_key"
# Generate secret: openssl rand -base64 32

# Groq AI (for voice-to-text processing)
GROQ_API_KEY="gsk_xxxxx"
# Get from: https://console.groq.com

# UploadThing (for media uploads)
UPLOADTHING_SECRET="sk_live_xxxxx"
UPLOADTHING_APP_ID="xxxxx"
# Get from: https://uploadthing.com

# Supabase Public Keys (optional)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
```

### 4. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🌐 Deployment

### Deploying to Render

1. **Push to GitHub**: Ensure your code is on GitHub
2. **Create Web Service** on [Render Dashboard](https://dashboard.render.com)
3. **Connect Repository**: Link your GitHub repository
4. **Configure Build**:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `20`
5. **Add Environment Variables**: Copy all `.env` variables to Render
   - ⚠️ Update `NEXTAUTH_URL` to your Render URL (e.g., `https://your-app.onrender.com`)
6. **Deploy**: Click "Create Web Service"

### Important: NextAuth v5 Configuration

For deployment on Render, Vercel, or other platforms, ensure `trustHost: true` is set in your NextAuth configuration:

```typescript
// lib/auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Required for production deployments
  // ... other config
})
```

---

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following models:

- **User**: Student/Management accounts with role-based access
- **Issue**: Issue reports with status tracking and categorization
- **Announcement**: Targeted communication system
- **LostFound**: Lost & Found item management
- **Comment**: Threaded comments on issues and announcements
- **Reaction**: Emoji reactions for engagement

See [`prisma/schema.prisma`](./prisma/schema.prisma) for full schema details.

---

## 🎯 Use Cases

### For Students
- 🗣️ Report maintenance issues via voice or text
- 📢 Receive hostel announcements and updates
- 📦 Report lost items or claim found ones
- 📊 Track issue resolution progress
- 🏆 View contribution leaderboard

### For Management
- 📋 Manage and assign reported issues
- 📣 Broadcast targeted announcements
- 📈 View analytics and performance metrics
- ✅ Track resolution times and trends
- 👥 Monitor student engagement

---

## 🔒 Security Features

- ✅ **Secure Authentication**: NextAuth v5 with JWT sessions
- ✅ **Password Hashing**: bcrypt for password security
- ✅ **Role-Based Access Control**: Student vs Management permissions
- ✅ **Privacy Controls**: Public/Private issue visibility
- ✅ **Input Validation**: Zod schema validation on all forms
- ✅ **SQL Injection Protection**: Prisma ORM parameterized queries
- ✅ **CSRF Protection**: Built-in Next.js security

---

## 🤝 Contributing

We welcome contributions! This project was built for **HackOverflow 2026**.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is built for educational purposes as part of **HackOverflow 2026**.

---

## 👥 Team

Built with ❤️ for **HackOverflow 2026**

---

## 🐛 Known Issues & Troubleshooting

### Free Tier Render Limitations
- ⚠️ Service spins down after 15 minutes of inactivity
- First request may take 30 seconds to wake up
- Upgrade to paid plan ($7/month) for always-on service

### Development Issues
- **Port 3000 already in use**: Kill the process or use a different port
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```
- **Prisma Client not generated**: Run `npx prisma generate`
- **Database connection failed**: Verify `DATABASE_URL` in `.env`

---

## 📧 Support

For questions or issues:
- Open an issue on [GitHub](https://github.com/Shiva200505/HackOverflow/issues)
- Contact the development team

---

**⭐ If you found this project helpful, please give it a star!**
