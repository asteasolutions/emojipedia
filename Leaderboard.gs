const LeaderboardType = {
  MOST_USED: 0,
  LEAST_USED: 1
};

function run() {
  const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = ss.getSheetByName('debug');

  getSortedEmojis(sheet, 3, LeaderboardType.MOST_USED);
}

function getSortedEmojis(sheet, leaderboardLength, leaderboardType) {
  let values = sheet.getDataRange().getValues();

  if (leaderboardType == LeaderboardType.MOST_USED) {
    values.sort(compareSheetRecords).reverse();
  } else {
    values.sort(compareSheetRecords);
  }

  let leaderboard = [];

  for (let i = 0; i < leaderboardLength; i++) {
    leaderboard[i] = values[i];
  }
  
  return leaderboard;
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