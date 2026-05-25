# ivolina — Deployment Guide

This guide walks you through hosting your ivolina app online with a public URL. Every step is explained. Total time: about 30 minutes.

You'll end up with:
- A URL like `https://ivolina-yourname.vercel.app` that both of you can open on your iPhones
- A Supabase database so your data syncs live between both phones
- Free hosting forever (Vercel + Supabase have generous free tiers)

---

## Part 1 — Set up Supabase (the database) · ~10 min

Supabase is where your shared data lives (questions, drawings, coins, profiles).

### Step 1.1 — Create the Supabase account

1. Open https://supabase.com in your browser
2. Click **Start your project** (top right)
3. Sign up with your GitHub account (easiest) — click **Continue with GitHub** and authorize
4. You'll land on the Supabase dashboard

### Step 1.2 — Create a new project

1. Click **New project** (green button)
2. If asked to create an organization first, just use the default name and click Create
3. Fill in the form:
   - **Name:** `ivolina`
   - **Database Password:** Click "Generate a password" and **copy it somewhere safe** (you won't need it for this app, but Supabase requires it)
   - **Region:** Choose the one closest to you (e.g. "Central EU (Frankfurt)" for Switzerland)
   - **Plan:** Free
4. Click **Create new project**
5. Wait ~2 minutes while Supabase sets things up

### Step 1.3 — Run the database setup script

1. In the left sidebar, click the **SQL Editor** icon (it looks like a small terminal/database icon)
2. Click **+ New query** (top of the page)
3. Open the file `supabase-schema.sql` from this project on your computer
4. Copy the entire contents of that file
5. Paste it into the Supabase SQL Editor
6. Click **Run** (bottom right, or press Ctrl+Enter)
7. You should see "Success. No rows returned" at the bottom — that means it worked ✓

### Step 1.4 — Copy your API keys (you'll need these in Part 3)

1. In the left sidebar, click the **gear icon** (Project Settings) at the very bottom
2. Click **API** in the settings menu
3. You'll see two values you need to copy. Keep this tab open:
   - **Project URL** — looks like `https://abcdefghij.supabase.co`
   - **anon public** key (under "Project API keys") — a long string starting with `eyJ...`

Leave this tab open. You'll come back here.

---

## Part 2 — Get the code onto GitHub · ~5 min

### Step 2.1 — Create a new GitHub repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `ivolina`
   - **Description:** (optional)
   - Choose **Private** (only you and people you invite can see the code)
   - Leave "Add a README file" **unchecked**
3. Click **Create repository**
4. You'll see a page with setup instructions. Leave it open.

### Step 2.2 — Upload the project to GitHub

You have two options.

**Option A — Drag and drop in the browser (easiest, no Git needed):**

1. On your new empty GitHub repository page, click the link **uploading an existing file** (it's in the middle of the page)
2. Open the `ivolina-app` folder on your computer
3. Select **all the files and folders inside it** (Ctrl+A) — make sure you grab `src`, `public`, `package.json`, `next.config.js`, `.gitignore`, `.env.example`, `supabase-schema.sql`, and this `README.md`
4. Drag them all onto the GitHub upload area
5. Wait for them to finish uploading
6. Scroll down, write a commit message like "first version", and click **Commit changes**

**Option B — With Git in the terminal (faster if you know it):**

```bash
cd path/to/ivolina-app
git init
git add .
git commit -m "first version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ivolina.git
git push -u origin main
```

(Replace `YOUR-USERNAME` with your actual GitHub username.)

---

## Part 3 — Deploy to Vercel · ~5 min

### Step 3.1 — Import the project to Vercel

1. Go to https://vercel.com/new
2. You should see a list of your GitHub repositories
3. Find `ivolina` in the list and click **Import** next to it
   - If you don't see it: click **Adjust GitHub App Permissions** and give Vercel access to the repo, then come back

### Step 3.2 — Add your Supabase keys

1. On the import page, expand **Environment Variables**
2. Add the first one:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Project URL from Step 1.4 (the `https://abcdefghij.supabase.co` one)
   - Click **Add**
3. Add the second one:
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your anon public key from Step 1.4 (the long `eyJ...` string)
   - Click **Add**
4. Leave all other settings as they are
5. Click **Deploy**

### Step 3.3 — Wait for the build

1. Vercel will now build your app. This takes about 1-2 minutes.
2. When it's done, you'll see fireworks 🎉 and a preview
3. Click **Continue to Dashboard** or visit the URL shown — something like `https://ivolina-xyz.vercel.app`

**That's it. Your app is live.**

---

## Part 4 — Use it on your iPhones

1. On your iPhone, open Safari
2. Go to your Vercel URL
3. Tap the **Share** button (square with arrow up)
4. Scroll down and tap **Add to Home Screen**
5. The ivolina icon will appear on your home screen like a real app
6. Tell Nikolina to do the same on her iPhone

Both of you log in with your respective passwords. When one of you adds a question or a drawing, the other sees it live thanks to Supabase realtime.

---

## Updating the app later

Whenever you want to make changes:

1. Edit a file (or have Claude give you a new version)
2. Upload it to GitHub (drag-and-drop replaces the old version)
3. Vercel **automatically rebuilds and deploys** within ~1 minute
4. Refresh the app on your phone to see changes

---

## Custom domain (optional, later)

Want `ivolina.com` or `ivonik.ch` instead of `ivolina-xyz.vercel.app`?

1. Buy a domain (Namecheap, Cloudflare Registrar, etc.) — about $10-15/year
2. In Vercel, go to your project → **Settings → Domains** → add your domain
3. Vercel shows you DNS records to add at your domain registrar
4. Wait a few minutes for DNS to propagate

---

## Troubleshooting

**"Setup needed" screen appears on the app**
The Supabase env vars aren't set correctly. Go to Vercel → your project → Settings → Environment Variables. Make sure both keys are there, then trigger a redeploy from the Deployments tab.

**Login works but no data syncs between phones**
The Supabase SQL script didn't run fully. Go back to Supabase SQL Editor and re-run the contents of `supabase-schema.sql`.

**Build fails on Vercel**
Open the build log, scroll to the error. Most often: a typo in env var names. They must be exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

**I can't see my GitHub repo in Vercel**
Click "Adjust GitHub App Permissions" on the Vercel import page and grant access to the specific repo or all repos.

---

## What's where in the code

```
ivolina-app/
├── src/app/
│   ├── layout.js          ← page metadata, fonts, PWA setup
│   ├── page.js            ← entry point, mounts the app
│   └── ivolina-app.js     ← the whole app: UI, logic, Supabase calls
├── public/
│   ├── manifest.json      ← PWA manifest (Add to Home Screen)
│   └── icon.svg           ← app icon (you can replace this later)
├── package.json           ← dependencies
├── next.config.js
├── supabase-schema.sql    ← database setup (you ran this in Part 1)
├── .env.example           ← env var template
└── README.md              ← this file
```

To change the app icon later: replace `public/icon.svg` with your own SVG (or use a PNG by changing the icon path in `layout.js` and `manifest.json`).

To change passwords: open `src/app/ivolina-app.js` and search for `PASSWORDS = `.

To change the relationship start date: open `src/app/ivolina-app.js` and search for `RELATIONSHIP_START`.
