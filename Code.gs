function doPost(event) {
  const REACTION_ADDED = "reaction_added";
  const REACTION_REMOVED = "reaction_removed";

  let contents = JSON.parse(event.postData.contents);
  let challenge = contents.challenge;

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

  return ContentService.createTextOutput(challenge);
}