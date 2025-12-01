/**
 * Google Apps Script to Auto-Generate Brain Games Score Submission Form
 *
 * HOW TO USE:
 * 1. Go to: https://script.google.com
 * 2. Click "+ New project"
 * 3. Delete any code and paste this entire file
 * 4. Click the "Run" button (▶) at the top
 * 5. Authorize the script when prompted
 * 6. Check the "Logs" (View → Logs) for your form URL
 * 7. Copy that URL and paste it into canvas-announcement-fixed.html
 *
 * The script will create:
 * - A Google Form for score submission
 * - A linked Google Sheet for responses
 * - Proper file upload settings
 */

function createBrainGamesForm() {
  try {
    // Create the form
    const form = FormApp.create('Brain Games Score Submission');

    Logger.log('✅ Form created successfully!');

    // Set description
    form.setDescription(
      'Upload your Brain Games assessment scores here. ' +
      'Make sure to export the CSV file from the assessment first!'
    );

    // Make it accept responses
    form.setAcceptingResponses(true);

    // Limit to 1 response per person (optional - remove if students can retake)
    form.setLimitOneResponsePerUser(false); // Set to true if you want only 1 submission per student

    // Show progress bar
    form.setProgressBar(true);
    form.setShowLinkToRespondAgain(true);

    Logger.log('✅ Basic settings configured');

    // Question 1: First Name
    const nameQuestion = form.addTextItem();
    nameQuestion.setTitle('What is your first name?');
    nameQuestion.setHelpText('Enter your first name only (no last names!)');
    nameQuestion.setRequired(true);

    Logger.log('✅ Added: First Name question');

    // Question 2: Age (optional - for data validation)
    const ageQuestion = form.addTextItem();
    ageQuestion.setTitle('What is your age?');
    ageQuestion.setHelpText('This helps us group scores by age');
    ageQuestion.setRequired(false);

    Logger.log('✅ Added: Age question');

    // Question 3: File Upload - NOTE: Cannot be added via script
    // This must be added manually in the Google Forms UI
    Logger.log('⚠️  File upload question must be added manually (Apps Script limitation)');

    // Question 4: Optional Comments
    const commentsQuestion = form.addParagraphTextItem();
    commentsQuestion.setTitle('Any questions or issues?');
    commentsQuestion.setHelpText('Optional - leave blank if everything worked fine!');
    commentsQuestion.setRequired(false);

    Logger.log('✅ Added: Comments question');

    // Confirmation message
    form.setConfirmationMessage(
      '🎉 Thanks for submitting your scores! ' +
      'Your results have been saved. Check back soon for leaderboards!'
    );

    Logger.log('✅ Confirmation message set');

    // Create linked spreadsheet for responses
    const spreadsheet = SpreadsheetApp.create('Brain Games Scores - Responses');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

    Logger.log('✅ Linked to Google Sheet: ' + spreadsheet.getName());
    Logger.log('📊 Sheet URL: ' + spreadsheet.getUrl());

    // Get form URL
    const formUrl = form.getPublishedUrl();
    const shortUrl = form.shortenFormUrl(formUrl);

    // Log everything
    Logger.log('\n========================================');
    Logger.log('✅ FORM CREATED SUCCESSFULLY!');
    Logger.log('========================================');
    Logger.log('📝 Form Name: Brain Games Score Submission');
    Logger.log('🔗 Form URL: ' + shortUrl);
    Logger.log('📊 Responses Sheet: ' + spreadsheet.getUrl());
    Logger.log('========================================');
    Logger.log('\n⚠️  IMPORTANT: ADD FILE UPLOAD MANUALLY');
    Logger.log('Google Forms API cannot add file upload questions.');
    Logger.log('You must add it yourself:');
    Logger.log('1. Open the form: ' + shortUrl);
    Logger.log('2. Click the "+" button to add a question');
    Logger.log('3. Choose "File upload" from the question type menu');
    Logger.log('4. Title: "Upload Your Score File (CSV)"');
    Logger.log('5. Click the ⋮ menu → "Response validation"');
    Logger.log('6. Set: File upload → Specific file types → Document');
    Logger.log('7. In the text box type: .csv');
    Logger.log('8. Set: Maximum number of files → 1');
    Logger.log('9. Set: Maximum file size → 10 MB');
    Logger.log('10. Toggle "Required" ON');
    Logger.log('========================================');
    Logger.log('\nTHEN:');
    Logger.log('1. Copy the Form URL above');
    Logger.log('2. Open canvas-announcement.html');
    Logger.log('3. Replace YOUR_GOOGLE_FORM_LINK_HERE with your Form URL');
    Logger.log('4. Post the announcement to Canvas!');
    Logger.log('========================================\n');

    // Note: Cannot show UI dialog when running from script.google.com
    // All instructions are in the logs above (View → Logs)

    return {
      formUrl: shortUrl,
      sheetUrl: spreadsheet.getUrl(),
      formId: form.getId(),
      sheetId: spreadsheet.getId()
    };

  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    throw error;
  }
}

/**
 * Optional: Add menu to spreadsheet for easy access
 * This function creates a custom menu in the responses sheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Brain Games')
    .addItem('View Form', 'openForm')
    .addItem('Download All CSV Files', 'downloadAllCSVs')
    .addToUi();
}

/**
 * Open the form in a new tab
 */
function openForm() {
  const form = FormApp.openByUrl(getFormUrl());
  const url = form.getPublishedUrl();
  const html = '<script>window.open("' + url + '");google.script.host.close();</script>';
  const ui = HtmlService.createHtmlOutput(html);
  SpreadsheetApp.getUi().showModalDialog(ui, 'Opening form...');
}

/**
 * Helper function to get form URL from sheet
 */
function getFormUrl() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const formUrl = sheet.getFormUrl();
  return formUrl;
}

/**
 * Optional Advanced: Auto-parse uploaded CSV files into organized sheet
 * Uncomment and customize if you want automatic CSV parsing
 */
/*
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  let parsedSheet = sheet.getSheetByName('Parsed Scores');

  // Create "Parsed Scores" sheet if it doesn't exist
  if (!parsedSheet) {
    parsedSheet = sheet.insertSheet('Parsed Scores');
    parsedSheet.appendRow(['Timestamp', 'Student Name', 'Age', 'Task', 'Score', 'Details']);
  }

  try {
    // Get form response
    const itemResponses = e.response.getItemResponses();
    const timestamp = new Date();
    let studentName = '';
    let age = '';
    let fileId = '';

    // Parse responses
    itemResponses.forEach(itemResponse => {
      const title = itemResponse.getItem().getTitle();
      const response = itemResponse.getResponse();

      if (title.includes('first name')) {
        studentName = response;
      } else if (title.includes('age')) {
        age = response;
      } else if (title.includes('Upload')) {
        // File upload response is an array of file IDs
        fileId = response[0];
      }
    });

    // Download and parse CSV file
    if (fileId) {
      const file = DriveApp.getFileById(fileId);
      const csvContent = file.getBlob().getDataAsString();
      const rows = Utilities.parseCsv(csvContent);

      // Skip header row and parse each score row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        // Assuming CSV format: [Task, Score, Detail1, Detail2, ...]
        parsedSheet.appendRow([
          timestamp,
          studentName,
          age,
          row[0], // Task name
          row[1], // Score
          row.slice(2).join(', ') // Additional details
        ]);
      }

      Logger.log('✅ Successfully parsed scores for: ' + studentName);
    }

  } catch (error) {
    Logger.log('❌ Error parsing submission: ' + error.toString());
    // Continue without breaking - form submission still saved
  }
}
*/

/**
 * Installation trigger setup
 * Run this AFTER creating your form to set up automatic CSV parsing
 */
/*
function setupTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create new trigger for form submissions
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(sheet)
    .onFormSubmit()
    .create();

  Logger.log('✅ Trigger created! CSV files will now auto-parse on submission.');

  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Trigger Setup Complete!',
    'CSV files will now automatically parse into the "Parsed Scores" sheet.',
    ui.ButtonSet.OK
  );
}
*/
