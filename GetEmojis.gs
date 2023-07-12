function getEmojis() {
  const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = ss.getSheetByName('Sheet1');

  let options = {
    'method': 'get',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    }
  };

  let response = UrlFetchApp.fetch("https://slack.com/api/emoji.list", options);
  let responseJSON = JSON.parse(response);
  let emojis = responseJSON.emoji;

  for (let key in emojis) {
    sheet.appendRow([key, 0]);
  }
}

function emojiChangeEvent(event) {
  const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const emojisSheet = ss.getSheetByName('Sheet1');
  const threadsSheet = ss.getSheetByName('threads');
  
  let subtype = event.subtype;
  let textFinder;

  switch (subtype) {
    case "add":
      emojisSheet.appendRow([event.name, 0]);
      postMessage(`A new emoji appeared :${event.name}:!`, threadsSheet.getRange(threadChannelCell).getValue(), threadsSheet.getRange(currentThreadCell).getValue());
      break;
    case "remove":
      for (let i in event.names) {
        textFinder = emojisSheet.createTextFinder(event.names[i]);
        emojisSheet.deleteRow(textFinder.findNext().getRow());
      }
      break;
    case "rename":
      textFinder = emojisSheet.createTextFinder(event.old_name);
      let cell = textFinder.findNext();
      cell.setValue(event.new_name);
      break;
  }
}
