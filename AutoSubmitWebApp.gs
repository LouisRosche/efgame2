/**
 * Google Apps Script Web App for Auto-Submitting Brain Games Scores
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to: https://script.google.com
 * 2. Click "+ New project"
 * 3. Delete any code and paste this entire file
 * 4. Click "Deploy" → "New deployment"
 * 5. Click gear icon (⚙️) next to "Select type"
 * 6. Choose "Web app"
 * 7. Settings:
 *    - Description: "Brain Games Auto Submit"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 8. Click "Deploy"
 * 9. Click "Authorize access" → Choose your Google account → Allow
 * 10. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/ABC123.../exec)
 * 11. Paste that URL into index.html where it says "YOUR_WEB_APP_URL_HERE"
 * 12. Done! Scores will auto-submit with one click!
 */

// Configuration - UPDATE THIS AFTER RUNNING SETUP
const SPREADSHEET_ID = '1x4C-kHWVoG8PClgpO29qm_iAnF0ijEXq6aA_DNaxc7g'; // Your actual sheet ID from earlier
const SHEET_NAME = 'Submitted Scores'; // Name of sheet to store scores

/**
 * Handle POST requests from the assessment
 */
function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Get or create the sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      sheet.appendRow([
        'Timestamp',
        'Student Name',
        'Age',
        'Grade',
        'Session ID',
        'Task',
        'Score',
        'Raw Data'
      ]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#667eea');
      headerRange.setFontColor('#ffffff');
    }

    // Write each task score as a separate row
    const timestamp = new Date();
    const studentName = data.user.name;
    const age = data.user.age;
    const grade = data.user.grade;
    const sessionId = data.sessionId;

    // Add rows for each completed task
    Object.keys(data.taskData).forEach(taskId => {
      const taskInfo = data.taskData[taskId];

      sheet.appendRow([
        timestamp,
        studentName,
        age,
        grade,
        sessionId,
        taskId,
        taskInfo.score || 0,
        JSON.stringify(taskInfo) // Store full details as JSON
      ]);
    });

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 8);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Scores submitted successfully!',
        timestamp: timestamp.toISOString(),
        studentName: studentName
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error submitting scores: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Brain Games Auto-Submit Endpoint is running! Use POST to submit scores.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Test function to verify setup
 */
function testSubmission() {
  const testData = {
    user: {
      name: 'Test Student',
      age: 12,
      grade: 7
    },
    sessionId: 'TEST123',
    taskData: {
      'choicert': {
        score: 85.5,
        medianRT: 450,
        accuracy: 0.95
      },
      'digitspan': {
        score: 78.2,
        forwardSpan: 6,
        backwardSpan: 5
      }
    }
  };

  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(e);
  Logger.log(result.getContent());
}
