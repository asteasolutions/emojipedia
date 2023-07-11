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
  const sheet = ss.getSheetByName('Sheet1');
  
  let subtype = event.subtype;
  let textFinder;

  switch (subtype) {
    case "add":
      sheet.appendRow([event.name, 0]);
      break;
    case "remove":
      for (let i in event.names) {
        textFinder = sheet.createTextFinder(event.names[i]);
        sheet.deleteRow(textFinder.findNext().getRow());
      }
      break;
    case "rename":
      textFinder = sheet.createTextFinder(event.old_name);
      let cell = textFinder.findNext();
      cell.setValue(event.new_name);
      break;
  }
}