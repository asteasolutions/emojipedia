function run() {
  const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = ss.getSheetByName('Sheet1');

  getSortedEmojis(sheet);
}

function getSortedEmojis(sheet) {
  let values = sheet.getDataRange().getValues();
  values.sort();
  Logger.log(values);
}

function compareSheetRecords(a, b) {
  let reactionsCountA = a[1];
  let reactionsCountB = b[1];

  if (reactionsCountA != reactionsCountB) {
    return reactionsCountA - reactionsCountB;
  }

  let emojiNameA = a[0];
  let emojiNameB = b[0];

  if (emojiNameA < emojiNameB) {
    return -1;
  }
  
  if (emojiNameA > emojiNameB) {
    return 1;
  }

  return 0;
}