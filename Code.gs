function doPost(event) {
  let contents = JSON.parse(event.postData.contents);
  let challenge = contents.challenge;

  // is an event
  if (contents.event) {
    let data = {
      'text': `A reaction of type :${contents.event.reaction}: was made!`
    };
    let options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

    UrlFetchApp.fetch('https://hooks.slack.com/services/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', options);
  }

  return ContentService.createTextOutput(challenge);
}