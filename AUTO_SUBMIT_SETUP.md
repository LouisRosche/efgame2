# 🚀 Auto-Submit Setup Guide (10 Minutes)

This enables students to submit scores with **ONE CLICK** - no CSV download/upload needed!

---

## How It Works

**Before** (Manual):
1. Student completes assessment
2. Clicks "Export CSV"
3. File downloads
4. Opens Google Form
5. Uploads file
6. Submits

**After** (Auto):
1. Student completes assessment
2. Clicks "Auto-Submit"
3. **Done!** ✅

---

## Setup Steps

### Step 1: Create Web App (7 minutes)

1. Go to **https://script.google.com**
2. Click **"+ New project"**
3. Open `AutoSubmitWebApp.gs` from this repo
4. **Copy entire file** → Paste into Apps Script
5. **IMPORTANT**: Line 17 has your Sheet ID already configured:
   ```javascript
   const SPREADSHEET_ID = '1x4C-kHWVoG8PClgpO29qm_iAnF0ijEXq6aA_DNaxc7g';
   ```
   (This is your existing "Brain Games Scores - Responses" sheet)

6. Click **"Deploy"** → **"New deployment"**
7. Click gear icon ⚙️ next to "Select type"
8. Choose **"Web app"**
9. Settings:
   - Description: `Brain Games Auto Submit`
   - Execute as: **"Me"** (you)
   - Who has access: **"Anyone"**
10. Click **"Deploy"**
11. Click **"Authorize access"**
    - Choose your Google account
    - Click **"Advanced"**
    - Click **"Go to Untitled project (unsafe)"**
    - Click **"Allow"**
12. **Copy the "Web app URL"** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 2: Update Assessment (2 minutes)

1. Open `index.html` in this repo
2. Find line 3229 (search for `YOUR_WEB_APP_URL_HERE`)
3. Replace `YOUR_WEB_APP_URL_HERE` with your Web App URL
4. Save the file
5. Commit and push to GitHub

### Step 3: Test It (1 minute)

1. Wait 1-2 minutes for GitHub Pages to update
2. Go to **https://louisrosche.github.io/efgame2/**
3. Complete a quick test:
   - Enter name, age, grade
   - Complete just ONE task (any task)
   - Click **"⚡ Auto-Submit"**
   - Should see: "✅ Scores submitted successfully!"
4. Check your Google Sheet:
   - Open: https://docs.google.com/spreadsheets/d/1x4C-kHWVoG8PClgpO29qm_iAnF0ijEXq6aA_DNaxc7g/edit
   - Look for new tab called **"Submitted Scores"**
   - Your test data should be there!

---

## What Gets Stored

The **"Submitted Scores"** sheet will have columns:
- **Timestamp** - When submitted
- **Student Name** - First name only
- **Age** - Student age
- **Grade** - Student grade
- **Session ID** - Unique session identifier
- **Task** - Which task (choicert, digitspan, cpt, etc.)
- **Score** - The normalized score (0-100)
- **Raw Data** - Full task details as JSON

Each task gets its own row, so if a student completes 5 tasks, you get 5 rows.

---

## Building Leaderboards

Once you have data, create leaderboards easily:

### Absolute Leaderboard (Highest Scores)

1. Create new sheet: **"Leaderboard - Absolute"**
2. Add formula:
```
=QUERY('Submitted Scores'!A:H,
  "SELECT B, AVG(G)
   WHERE G IS NOT NULL
   GROUP BY B
   ORDER BY AVG(G) DESC
   LABEL B 'Student', AVG(G) 'Average Score'")
```

### Growth Leaderboard (Most Improved)

Requires students to complete assessment multiple times. Formula:
```
=QUERY('Submitted Scores'!A:H,
  "SELECT B, MAX(A), MIN(A), (MAX(G)-MIN(G)) as Growth
   WHERE G IS NOT NULL
   GROUP BY B
   HAVING COUNT(DISTINCT A) > 1
   ORDER BY Growth DESC
   LABEL B 'Student', MAX(A) 'Latest', MIN(A) 'First', Growth 'Improvement'")
```

---

## Troubleshooting

### "Auto-submit not configured yet" warning
- You haven't replaced `YOUR_WEB_APP_URL_HERE` in index.html
- Find line 3229 and paste your Web App URL

### "Submission failed" error
- Check Web App settings: "Who has access" must be "Anyone"
- Make sure you authorized the script
- Try re-deploying: Deploy → Manage deployments → Edit → New version

### Data not appearing in sheet
- Check the sheet ID on line 17 of AutoSubmitWebApp.gs
- Should be: `1x4C-kHWVoG8PClgpO29qm_iAnF0ijEXq6aA_DNaxc7g`
- Make sure script is deployed as Web App, not Test deployment

### CORS errors in console
- Normal! We use `mode: 'no-cors'` which is required for Apps Script
- Submission still works even if console shows errors

---

## Privacy & Security

✅ **Safe & Compliant:**
- Only sends: First name, age, grade, scores
- No emails, last names, or personal identifiers
- Data goes to YOUR Google Sheet (you control access)
- Students can't see others' data
- Complies with FERPA/COPPA

⚠️ **Important:**
- Keep your Google Sheet private (don't share edit access)
- Only use first names on public leaderboards
- Web App is public (anyone with link can submit) - but that's intentional for easy student access

---

## Fallback Option

Students can still use **manual upload** if:
- Auto-submit is not configured
- Auto-submit fails
- They prefer the manual method

The **"📤 Submit to Teacher (Manual Upload)"** link remains available as backup.

---

## Support

**Need help?**
- Test the script with the `testSubmission()` function first
- Check View → Logs in Apps Script for errors
- Verify deployment settings (Execute as: Me, Access: Anyone)
- Make sure GitHub Pages has updated (wait 2 minutes after push)

**Questions?**
- Apps Script docs: https://developers.google.com/apps-script
- Google Sheets formulas: https://support.google.com/docs/topic/9054603
