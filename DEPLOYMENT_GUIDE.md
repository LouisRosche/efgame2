# 🚀 Brain Games Assessment - Deployment Guide

Complete setup in **15 minutes**! Follow these steps in order.

---

## Step 1: Create Google Form (5 minutes)

### Option A: Auto-Create with Apps Script (Recommended)

1. Go to **https://script.google.com**
2. Click **"+ New project"**
3. Open the file `CreateGoogleForm.gs` in this repo
4. **Copy the entire contents** of that file
5. **Paste** into the Apps Script editor (delete any existing code first)
6. Click **"Run"** button (▶) at the top
7. When prompted, click **"Review permissions"**
   - Click your Google account
   - Click **"Advanced"**
   - Click **"Go to Untitled project (unsafe)"**
   - Click **"Allow"**
8. Check **View → Logs** (Ctrl+Enter)
9. **Copy the Form URL** (looks like `https://forms.gle/AbCd123XyZ`)

### Option B: Manual Creation (If Apps Script doesn't work)

See `GOOGLE_SHEETS_SETUP.md` for manual instructions.

---

## Step 2: Update Canvas Announcement (2 minutes)

1. Open `canvas-announcement-fixed.html` in this repo
2. Find this line (around line 79):
   ```html
   <a href="YOUR_GOOGLE_FORM_LINK_HERE" target="_blank">
   ```
3. Replace `YOUR_GOOGLE_FORM_LINK_HERE` with your actual Google Form URL
4. Save the file

---

## Step 3: Post to Canvas (3 minutes)

1. Go to your Canvas course
2. Click **"Announcements"**
3. Click **"+ Announcement"**
4. Title: `Brain Games Assessment - Improved & Ready!`
5. Click the **HTML Editor** icon (`</>` in toolbar)
6. Open `canvas-announcement-fixed.html`
7. **Copy everything** (Ctrl+A, Ctrl+C)
8. **Paste** into Canvas HTML editor (Ctrl+V)
9. Click **"Post"**

**Done!** Students will now see the announcement!

---

## Step 4: Share Assessment Link (1 minute)

Make sure students have the direct link:
```
https://louisrosche.github.io/efgame2/
```

You can:
- Add it to Canvas Modules
- Pin the announcement
- Add to Canvas homepage
- Email to students

---

## What Happens Next?

### Student Flow:
1. Student clicks assessment link
2. Completes 5 brain games
3. Sees results with fun ratings ("Amazing!", "Great!", etc.)
4. Fills out feedback form (optional)
5. Clicks "Export Data (CSV)" button
6. Downloads CSV file
7. Opens Google Form link from announcement
8. Uploads CSV file
9. **Done!** Their scores are in your Google Sheet

### Teacher View:
- All submissions appear in: **"Brain Games Scores - Responses"** Google Sheet
- See uploaded CSV files in: **"Brain Games Score Submission (Responses)"** Drive folder
- Download individual CSV files to analyze
- Build leaderboards (see instructions below)

---

## Building Leaderboards (Optional)

Once you have student data, create competitive leaderboards!

### Method 1: Simple Spreadsheet Formula

In your responses Google Sheet, create a new tab called "Leaderboard" and use:

```
=SORT(A2:B, 2, FALSE)
```

This sorts students by score (highest first).

### Method 2: Advanced Auto-Parsing

See the commented-out section in `CreateGoogleForm.gs` for automatic CSV parsing into organized format.

To enable:
1. Uncomment the `onFormSubmit()` function
2. Uncomment and run the `setupTrigger()` function
3. All CSV files will auto-parse into "Parsed Scores" sheet

---

## Troubleshooting

### "Form URL not working"
- Make sure you copied the shortened URL (starts with `https://forms.gle/`)
- Test by opening in incognito window

### "Students can't upload CSV"
- Check file upload settings allow CSV/documents
- Increase max file size to 2 MB

### "Canvas stripped out formatting"
- Use `canvas-announcement-fixed.html` (has inline styles)
- NOT the original `canvas-announcement.html`

### "Apps Script authorization failed"
- Make sure you're logged into correct Google account
- Try in incognito mode
- Follow the "Advanced" → "Go to project" flow

---

## Files Reference

| File | Purpose |
|------|---------|
| `canvas-announcement-fixed.html` | Canvas-compliant announcement (USE THIS ONE) |
| `CreateGoogleForm.gs` | Apps Script to auto-create Google Form |
| `GOOGLE_SHEETS_SETUP.md` | Manual setup instructions (alternative) |
| `DEPLOYMENT_GUIDE.md` | This file - quick start guide |

---

## Privacy & Compliance

✅ **FERPA/COPPA Compliant:**
- Only collects: First name, age, grade, scores
- No last names, emails, or personal identifiers
- Data stored in teacher's Google Drive (not public)
- Students can't see others' responses

⚠️ **Important:**
- Never share raw scores sheet publicly
- Only use first names on public leaderboards
- Keep form URL within Canvas/class only

---

## Support

**Need help?**
- Check `GOOGLE_SHEETS_SETUP.md` for detailed manual instructions
- Review commented code in `CreateGoogleForm.gs` for advanced features
- Test the assessment yourself first: https://louisrosche.github.io/efgame2/

**Questions?**
- Google Forms help: https://support.google.com/forms
- Canvas help: https://community.canvaslms.com
- Apps Script docs: https://developers.google.com/apps-script

---

🎉 **You're all set! Students can now complete the assessment and submit scores!**
