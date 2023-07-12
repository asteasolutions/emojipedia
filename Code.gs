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
    }

    let options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

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

function newMessage(text = undefined, thread) {
  var data = {
    'text': text || ':not-bad:', 
    // 'thread_ts': thread || ''
    //https://asteasolution-it03267.slack.com/archives/C05EKHEF52B/p1689151108852829
  };

  if (thread) {
    data.thread_ts = thread;
  }

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload': JSON.stringify(data)
  };

  return UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL"), options);
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

  return UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', options);
}


