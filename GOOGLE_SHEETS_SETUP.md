# Google Sheets Data Collection Setup

## Quick Setup (10 minutes)

### Step 1: Create Google Form for Score Submission

1. Go to **https://forms.google.com**
2. Click **"+ Blank"** to create a new form
3. Title: **"Brain Games Score Submission"**

**Add these questions:**

**Question 1: First Name**
- Type: Short answer
- Required: Yes

**Question 2: Upload Your Scores**
- Type: File upload
- Required: Yes
- Settings:
  - Allow only: CSV files (.csv)
  - Max file size: 1 MB
  - Max files: 1

**Question 3 (Optional): Comments**
- Type: Paragraph
- Required: No
- Description: "Any issues or questions?"

### Step 2: Configure Form Settings

1. Click **Settings** (gear icon)
2. Go to **"Responses"** tab
3. Check ✅ **"Collect email addresses"** (optional, but helpful for tracking)
4. Click **Save**

### Step 3: Link to Google Sheets

1. In your form, click the **"Responses"** tab
2. Click the **Google Sheets icon** (green spreadsheet)
3. Select **"Create a new spreadsheet"**
4. Name it: **"Brain Games Scores"**
5. Click **Create**

Your form responses (including CSV uploads) will now automatically save to this Sheet!

### Step 4: Get Your Form Link

1. Click **"Send"** button (top right)
2. Click the **Link icon** 🔗
3. Click **"Shorten URL"**
4. **Copy this link!**

### Step 5: Update Canvas Announcement

1. Open `/home/user/efgame2/canvas-announcement.html`
2. Find this line:
   ```html
   <li>Click this link to submit: <a href="YOUR_GOOGLE_FORM_LINK_HERE" target="_blank">
   ```
3. Replace `YOUR_GOOGLE_FORM_LINK_HERE` with your Google Form link
4. Save the file

### Step 6: Embed in Canvas

1. In Canvas, go to your course
2. Click **"Announcements"**
3. Click **"+ Announcement"**
4. Click the **HTML Editor** icon (`</>`)
5. Copy the ENTIRE contents of `canvas-announcement.html`
6. Paste into Canvas
7. Click **"Post"**

---

## Accessing Student Scores

### Option A: View in Google Drive (Files)
1. Go to **Google Drive**
2. Find folder: **"Brain Games Score Submission (Responses)"**
3. All CSV files are here!
4. Download and open in Excel/Numbers/etc.

### Option B: Auto-Parse into Single Sheet (Advanced)

Want all scores in ONE organized spreadsheet? Here's how:

1. Open your **"Brain Games Scores"** Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any code and paste this:

```javascript
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Parsed Scores')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Parsed Scores');

  // Get the uploaded file URL from form response
  const fileUrl = e.values[2]; // Adjust index based on your form structure

  if (!fileUrl) return;

  // Extract file ID from URL
  const fileId = fileUrl.match(/id=([^&]+)/)[1];
  const file = DriveApp.getFileById(fileId);
  const csvContent = file.getBlob().getDataAsString();
  const rows = Utilities.parseCsv(csvContent);

  // Write to Parsed Scores sheet
  rows.forEach(row => {
    sheet.appendRow([new Date(), e.values[1], ...row]); // Add timestamp and student name
  });
}
```

4. Click **Save** (disk icon)
5. Click **"Run"** → Select `onFormSubmit`
6. Authorize the script
7. Go back to your form
8. Click **⋮** (three dots) → **"Script editor"**
9. Click **Triggers** (clock icon on left)
10. Click **"+ Add Trigger"**
11. Configure:
    - Function: `onFormSubmit`
    - Event source: From spreadsheet
    - Event type: On form submit
12. Click **Save**

**Done!** Now every CSV upload will auto-parse into your "Parsed Scores" sheet!

---

## Building Leaderboards

Once you have data in Google Sheets, create leaderboards:

### Absolute Leaderboard (Highest Scores)
1. Create new sheet: **"Absolute Leaderboard"**
2. Add formula:
   ```
   =SORT(QUERY('Parsed Scores'!A:Z, "SELECT B, MAX(C) GROUP BY B ORDER BY MAX(C) DESC"), 2, FALSE)
   ```

### Growth Leaderboard (Most Improved)
1. Create new sheet: **"Growth Leaderboard"**
2. Requires at least 2 attempts per student
3. Calculate: `(Latest Score - First Score) / First Score * 100`

---

## Privacy & Compliance

✅ **Safe for students:**
- Only collects: First name, age, grade, scores
- No last names, emails, or identifying info
- CSV files stored in teacher's Google Drive
- Complies with FERPA/COPPA

⚠️ **Important:**
- Don't share the spreadsheet publicly
- Only use first names on public leaderboards
- Keep raw data private

---

## Troubleshooting

**Students can't upload CSV:**
- Check file upload settings allow CSV
- Increase max file size to 1 MB

**Form isn't saving to Sheet:**
- Click Responses tab → Green Sheets icon again
- Make sure you're logged into Google

**Need help?**
- Google Forms help: https://support.google.com/forms
- Apps Script docs: https://developers.google.com/apps-script
