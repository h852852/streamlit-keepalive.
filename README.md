# 🔁 Streamlit Keep-Alive Bot

Automatically wakes up your sleeping Streamlit app using **GitHub Actions + Playwright**.

## 🚀 How It Works

1. GitHub Actions runs on a **scheduled cron job** (every 2 days by default)
2. Playwright launches a headless Chromium browser
3. It visits your Streamlit app URL
4. If the app is sleeping, it clicks **"Yes, get this app back up!"**
5. It waits for the app to fully boot and verifies it's running
6. Retries up to **3 times** if anything fails

---

## 📁 File Structure

```
streamlit-keepalive/
├── .github/
│   └── workflows/
│       └── keep_alive.yml   ← GitHub Actions workflow (cron schedule)
├── wake_up.js               ← Playwright script that wakes the app
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Setup (One-Time)

### 1. Fork or create a new GitHub repo

Upload all these files to any GitHub repository (public or private).

### 2. Push the files

```bash
git init
git add .
git commit -m "Add Streamlit keep-alive automation"
git remote add origin https://github.com/nikhileshnarkhede/streamlit-keepalive.git
git push -u origin main
```

### 3. Enable GitHub Actions

- Go to your repo on GitHub
- Click the **Actions** tab
- If prompted, click **"I understand my workflows, go ahead and enable them"**

That's it! The workflow will now run automatically every 2 days. ✅

---

## ▶️ Manual Trigger

You can also run it anytime manually:

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Select **"🔁 Keep Streamlit App Alive"**
4. Click **"Run workflow"** → **"Run workflow"**

---

## 🔧 Customization

### Change the schedule

Edit `.github/workflows/keep_alive.yml` and update the cron expression:

| Schedule | Cron |
|---|---|
| Every day at 8 AM UTC | `0 8 * * *` |
| Every 2 days (default) | `0 8 */2 * *` |
| Twice a week (Mon & Thu) | `0 8 * * 1,4` |

### Change the target URL

Edit `wake_up.js` and update the `APP_URL` constant at the top:

```js
const APP_URL = 'https://your-app.streamlit.app/';
```

### Change retry count or wait time

Also in `wake_up.js`:

```js
const MAX_RETRIES = 3;    // number of attempts
const BOOT_WAIT   = 40000; // ms to wait after clicking wake-up
```

---

## 📊 Viewing Run Results

After each run, GitHub Actions generates a **job summary** showing:
- The time it ran
- The target URL
- Whether the app was successfully woken up

Go to **Actions** tab → click any run → view the **Summary** section.

---

## 💡 Notes

- Streamlit Community Cloud apps sleep after **7 days of inactivity**
- Running this every 2 days is more than enough to keep the app alive
- GitHub Actions free tier provides **2,000 minutes/month** — this uses ~2 min per run
- This bot uses no secrets or tokens — it's purely browser automation

---

## 👤 Author

**Nikhilesh Narkhede**  
[LinkedIn](https://www.linkedin.com/in/nikhileshnarkhede) · [GitHub](https://github.com/nikhileshnarkhede) · [Portfolio](https://nikhileshnarkhede.github.io/portfolio/)
