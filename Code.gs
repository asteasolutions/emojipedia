const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
const sheet = ss.getSheetByName('Sheet1');
const debugSheet = ss.getSheetByName('debug');

// doPost(request) not doPost(event)
function doPost(event) {
  const REACTION_ADDED = "reaction_added";
  const REACTION_REMOVED = "reaction_removed";

  // TODO: create constants for types
  if (event.postData.type == "application/x-www-form-urlencoded") {
    return handleSlashCommand(event);
  } else if (event.postData.type == "application/json") {
    contents = JSON.parse(event.postData.contents);
  }

  // let command = contents.parameters.command;   
  if (contents.challenge) {
    return ContentService.createTextOutput(contents.challenge);
  }

  // is an event
  if (contents.event) {
    let event = contents.event;
    let eventType = event.type;
    let data = {
      'text': null
    };


    switch (eventType) {
      case REACTION_ADDED:
        reactionAdded(data, event, sheet);
        break;
      case REACTION_REMOVED:
        reactionRemoved(data, event, sheet);
        break;
      case "emoji_changed":
        emojiChangeEvent(event);
        data.text = JSON.stringify(contents);
        break;
    }

    let options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

    postMessage(data.text, threadsSheet.getRange(threadChannelCell).getValue(), threadsSheet.getRange(currentThreadCell).getValue());

    UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL"), options);


  }
}

function reactionRemoved(data, event, sheet) {
  data.text = `A reaction of type :${event.reaction}: was removed!`;
  textFinder = sheet.createTextFinder(event.reaction);
  emojiCell = textFinder.findNext();
  nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
  nextCell.setValue(nextCell.getValue() - 1);
}

function reactionAdded(data, event, sheet) {
  data.text = `A reaction of type :${event.reaction}: was added!`;
  textFinder = sheet.createTextFinder(event.reaction);
  emojiCell = textFinder.findNext();
  if (emojiCell == null) {
    sheet.appendRow([event.reaction, 1]);
    //sheet.getRange(sheet.getLastRow() + 1, 1,).setValues(event.reaction, 0);
  } else {
    nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
    nextCell.setValue(nextCell.getValue() + 1);
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


