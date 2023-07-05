function doPost(event) {
  var contents = JSON.parse(event.postData.contents);
  var challenge = contents.challenge;

  // is an event
  if (contents.event != undefined) {
    var data = {
      'text': `A reaction of type :${contents.event.reaction}: was made!`
    };
    var options = {
      'contentType': 'application/json',
      'payload': JSON.stringify(data)
    };

    UrlFetchApp.fetch('https://hooks.slack.com/services/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', options);
  }

  return ContentService.createTextOutput(challenge);
}