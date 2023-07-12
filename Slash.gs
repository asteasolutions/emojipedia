function handleSlashCommand(request) {
  let parameters = request.parameter;

  switch (parameters.command) {
    case "/get-emoji-count":
      return handleGetEmojiCount(parameters.text);
<<<<<<< HEAD
    case "/new-thread":
      handleNewThread();
=======
>>>>>>> ebe53bc37405bdac04791f4071ed95a94298dbd3
  }
}

function handleGetEmojiCount(text) {
  var emojiToFind = text;

  const spreadSheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = spreadSheet.getSheetByName('Sheet1');
  var emojiColumn = sheet.getRange(1,1,sheet.getLastRow(),1);
  var textFinder = emojiColumn.createTextFinder(emojiToFind);

  
  // TODO: search only the first column
  var cell = textFinder.findNext();

  if (cell == null) {
    return ContentService.createTextOutput('No matching emoji was found!');
  }

  var nextCell = sheet.getRange(cell.getRow(), cell.getColumn() + 1);

  return ContentService.createTextOutput(nextCell.getValue());
}
<<<<<<< HEAD

function handleNewThread() {
  const spreadSheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = spreadSheet.getSheetByName('threads');

  const currentThreadCell = "B1";
  const threadChannelCell = "B2";

  let threadChannel = sheet.getRange(threadChannelCell).getValue();

  let currentThread = sheet.getRange(currentThreadCell).getValue();

  let postMessageResponse = JSON.parse(postMessage("A new thread was created.", threadChannel));
  let newThread = postMessageResponse.ts;

  // previous threads are available
  if (currentThread != "") {
    postMessage(`Link to the new thread: ${JSON.parse(getMessageLink(threadChannel, newThread)).permalink}`, threadChannel, currentThread);
    postMessage(`Link to the previous thread:${JSON.parse(getMessageLink(threadChannel, currentThread)).permalink}`, threadChannel, newThread);
  }

  // change currentThread
  sheet.getRange(currentThreadCell).setValue(newThread);
}

function getMessageLink(channel, message_ts) {
  let options = {
    'method': 'get',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'channel': channel,
      'message_ts': message_ts
    }
  };

  return UrlFetchApp.fetch('https://slack.com/api/chat.getPermalink', options);
}
=======
>>>>>>> ebe53bc37405bdac04791f4071ed95a94298dbd3
