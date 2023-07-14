const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
const sheet = ss.getSheetByName('Sheet1');
const debugSheet = ss.getSheetByName('debug');

function doPost(request) {
  const SLASH_COMMAND_TYPE = "application/x-www-form-urlencoded";
  const EVENT_COMMAND_TYPE = "application/json";

  if (request.postData.type == SLASH_COMMAND_TYPE) {
    return handleSlashCommand(request);
  } else if (request.postData.type == EVENT_COMMAND_TYPE) {
    let contents = JSON.parse(request.postData.contents);
    if (contents.challenge) {
      return ContentService.createTextOutput(contents.challenge);
    }

    return handleEvent(request);
  }

}

function postMessage(text, channel, thread) {
  let options = {
    'method': 'post',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'channel': channel,
      'text': text
    }
  };

  if (thread) {
    options.payload.thread_ts = thread;
  }

  Logger.log(options);

  return UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);
}


