# 🚀 Deploying to Vercel

Follow these steps to deploy your **Smart Hostel Tracker** to the web.

## 1. Prerequisites
-   Ensure your code is pushed to GitHub (Done!).
-   Have a [Vercel Account](https://vercel.com).

## 2. Import Project
1.  Go to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2.  Click **"Add New..."** -> **"Project"**.
3.  Find `HackOverflow` in the list (you may need to search for it).
4.  Click **"Import"**.

## 3. Configure Project
-   **Framework Preset**: Next.js (Default)
-   **Root Directory**: `hostel-tracker` (IMPORTANT: Since your code is inside a subfolder, you must verify this. If the UI asks, select the `hostel-tracker` folder).

## 4. Environment Variables
Copy and paste the following values into the **Environment Variables** section.

> **⚠️ IMPORTANT:**
> -   **`NEXTAUTH_URL`**: Vercel automatically sets the URL, but for NextAuth v5 stability, it's good to add `AUTH_TRUST_HOST=true` or set the specific URL after deployment.
> -   **Copy valid values**: Ensure you copy the *actual values* from your local `.env` file for the database connection strings.

```env
# 1. Database (Supabase)
DATABASE_URL="postgresql://postgres.[YOUR-USER]:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-USER]:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres"

# 2. Auth
NEXTAUTH_SECRET="your-production-secret-key"
# Vercel handles the URL automatically, but adding this helps:
AUTH_TRUST_HOST="true"

# 3. Supabase Client
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# 4. AI (Groq)
GROQ_API_KEY="[YOUR-GROQ-API-KEY]"
```

## 5. Deploy
1.  Click **"Deploy"**.
2.  Wait for the build to complete (usually 1-2 minutes).
3.  🎉 **Success!** Your app is live.

## 6. Post-Deployment Check
-   Click the screenshot to visit your live site.
-   Test the **Login**.
-   Test **Voice Reporting** (mic permission will be asked again for the new domain).
