# Bijjam Enterprises ERP - Supabase Backend Database Integration Guide

This guide explains how to connect your ERP application (Web + Mobile APK) to your **Supabase** cloud database via backend configuration for multi-device real-time data persistence.

---

## 🚀 3 Simple Steps to Connect

### Step 1: Create a Project in Supabase
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and name it (e.g. `Bijjam-ERP`).
3. Set your database password and choose your region (e.g. `South Asia (Mumbai)`).

---

### Step 2: Run the SQL Setup Script
1. In your Supabase Dashboard, click on **SQL Editor** from the left navigation menu.
2. Click **New Query**.
3. Copy and paste the contents of [`supabase_setup.sql`](./supabase_setup.sql).
4. Click **Run** (or `Cmd + Enter` / `Ctrl + Enter`).
5. The `erp_state` table, security policies, and Supabase Realtime publication are now active!

---

### Step 3: Configure via Backend Environment (.env)

The application connects to Supabase entirely through backend environment variables without exposing any keys or modal dialogues to end-users in the UI.

In the project root, create or edit your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

*(You can copy `.env.example` as a template)*

### That's it!
- When you run the application (`npm run dev` or `npm run build`), it automatically connects to your Supabase project in the background.
- On first launch, it automatically seeds your existing ERP data into Supabase if empty.
- When any record (milk procurement, retail sale, customer bill, delivery route) is added or modified on any device, it syncs seamlessly in the background.
- Real-time PostgreSQL notifications ensure all connected screens and APKs update immediately.
