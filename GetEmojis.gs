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

  // start filling from the first cell
  const currentCell = sheet.getRange("A1");
  sheet.setCurrentCell(currentCell);

  for (let key in emojis) {
    sheet.appendRow([key]);
  }
}