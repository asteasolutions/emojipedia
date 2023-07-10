function doPost(event) {
  const REACTION_ADDED = "reaction_added";
  const REACTION_REMOVED = "reaction_removed";
  let contents = JSON.parse(event.postData.contents);
  
  if (contents.challenge) {
    return ContentService.createTextOutput(contents.challenge);
  }

  const ss = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const sheet = ss.getSheetByName('Sheet1');
  var dataRange = sheet.getDataRange();
  // is an event
  if (contents.event) {
    let event = contents.event;
    let eventType = event.type;

    let data = {
      'text': null
    };
    

    switch (eventType) {
      case REACTION_ADDED:
        data.text = `A reaction of type :${event.reaction}: was added!`;
        let textFinder = sheet.createTextFinder(event.reaction);
        // textFinder.startFrom(sheet.getRange(0, 0));
        let emojiCell = textFinder.findNext();
        let nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
        nextCell.setValue(nextCell.getValue() + 1);
        
        
        // for (var row = 1; row < values.length; row++) {
        //   for (var col = 1; col < values[row].length; col++) {
        //     if (values[row][col] == '${event.reaction}') {
        //       var nextCell = sheet.getRange(row + 1, col + 2);
        //       var currentValue = nextCell.getValue();
        //       nextCell.setValue(currentValue + 1);
        //     }
        //   }
        // }
        break;
      case REACTION_REMOVED:
        data.text = `A reaction of type :${event.reaction}: was removed!`;
        break;
    }

    let options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

    UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL"), options);
  }
}
