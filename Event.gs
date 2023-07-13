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
