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


  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  // if(command){
  //   handleSlash(event);
  // }
  // else{
  // is an event
  if (contents.event) {
    customlog("has contents.event");
    let event = contents.event;
    let eventType = event.type;
    let data = {
      'text': null
    };


    switch (eventType) {
      case REACTION_ADDED:
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
        break;
      case REACTION_REMOVED:
        data.text = `A reaction of type :${event.reaction}: was removed!`;
        textFinder = sheet.createTextFinder(event.reaction);
        emojiCell = textFinder.findNext();
        nextCell = sheet.getRange(emojiCell.getRow(), emojiCell.getColumn() + 1);
        nextCell.setValue(nextCell.getValue() - 1);
        //if(nextCell.getValue() > 0){
        //}
        break;
    }

    let options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

    UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL"), options);
  } else {
    customlog(event);
    customlog(JSON.stringify(event));
    handleSlash(event);
    //debugSheet.appendRow(event);
    //debugSheet.getRange().setValue(event);
  }
}
//}




function emojiCounterUpdate() {

}

function customlog(text) {
  if (text) {
    debugSheet.appendRow([text]);
  } else {
    debugSheet.appendRow(["no valid parameter"]);
  }
}







