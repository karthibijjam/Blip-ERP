# Bijjam Enterprises ERP - APK Conversion Guide

This guide details how to turn this React web application into an installable Android APK.

---

## Prerequisites
- **Node.js**: v18 or newer (Installed)
- **Android Studio**: Download and install [Android Studio](https://developer.android.com/studio) if you haven't already.
- **Java JDK**: Included with Android Studio.

---

## Method 1: Using Capacitor (Recommended - Turnkey)

Capacitor wraps your production Vite React build into a native Android Studio project.

### Step 1: Install Capacitor Dependencies
Run this in the project root:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Build the React Application
```bash
npm run build
```
*(This produces the optimized production bundle in the `dist` folder)*

### Step 3: Initialize & Add Android Platform
`capacitor.config.json` is already preconfigured in this project. Run:
```bash
npx cap add android
```
*(This creates an `android/` directory containing a full native Android project)*

### Step 4: Sync Web Code into Android Project
Whenever you make updates to the React app:
```bash
npm run build
npx cap sync android
```

### Step 5: Open Android Studio and Build APK
```bash
npx cap open android
```
Inside Android Studio:
1. Wait for Gradle sync to complete (1-2 minutes on first run).
2. Go to **Build** menu > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Once completed, a notification will appear with a **locate** link to your `.apk` file (usually located at `android/app/build/outputs/apk/debug/app-debug.apk`).
4. Transfer this `.apk` to any Android phone and install!

---

## Method 2: PWA (Installable Web App without Android Studio)
This application includes responsive viewports, full offline localStorage support, and mobile touch optimization. You can host this website (on Vercel, Netlify, or your local server) and on any Android phone in Chrome:
- Tap the **3 dots menu** > **Install app** or **Add to Home screen**.
- It opens full-screen without URL bar, just like an APK.

---

## Method 3: PWABuilder (Online Free APK Generator)
1. Deploy your React build to any web host (Vercel, Firebase, Render, etc.).
2. Go to [PWABuilder.com](https://www.pwabuilder.com/).
3. Enter your deployed URL and click **Build APK / Android package**.
4. Download the ready-to-install signed APK!
