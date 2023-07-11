function handleSlashCommand(request) {
  let parameters = request.parameter;

  switch (parameters.command) {
    case "/get-emoji-count":
      return handleGetEmojiCount(parameters.text);
  }
}

function handleGetEmojiCount(text) {
  var emojiToFind = text;

  const spreadSheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = spreadSheet.getSheetByName('Sheet1');

  var textFinder = sheet.createTextFinder(emojiToFind);

  // TODO: search only the first column
  var cell = textFinder.findNext();

  if (cell == null) {
    return ContentService.createTextOutput('No matching emoji was found!');
  }

  var nextCell = sheet.getRange(cell.getRow(), cell.getColumn() + 1);

  return ContentService.createTextOutput(nextCell.getValue());
}
