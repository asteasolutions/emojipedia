function handleEvent(request) {
  const REACTION_ADDED = "reaction_added";
  const REACTION_REMOVED = "reaction_removed";
  const EMOJI_CHANGED = "emoji_changed";

  let contents = JSON.parse(request.postData.contents);

  let event = contents.event;
  let eventType = event.type;

  switch (eventType) {
    case REACTION_ADDED:
      reactionAdded(event);
      break;
    case REACTION_REMOVED:
      reactionRemoved(event);
      break;
    case EMOJI_CHANGED:
      emojiChangeEvent(event);
      break;
  }
}

function reactionRemoved(event) {
  textFinder = sheet.createTextFinder(event.reaction);
  emojiCell = textFinder.findNext();
  nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
  nextCell.setValue(nextCell.getValue() - 1);
}

function reactionAdded(event) {
  textFinder = sheet.createTextFinder(event.reaction);
  emojiCell = textFinder.findNext();
  if (emojiCell == null) {
    sheet.appendRow([event.reaction, 1]);
  } else {
    nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
    nextCell.setValue(nextCell.getValue() + 1);
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
      postMessage(`A new emoji appeared!`, threadsSheet.getRange(threadChannelCell).getValue(), threadsSheet.getRange(currentThreadCell).getValue());
      postMessage(`:${event.name}:`, threadsSheet.getRange(threadChannelCell).getValue(), threadsSheet.getRange(currentThreadCell).getValue());
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
