function handleSlashCommand(request) {
  let parameters = request.parameter;

  switch (parameters.command) {
    case "/get-emoji-count":
      return handleGetEmojiCount(parameters.text);
    case "/get-emoji-ranking":
      return getTopEmojies(parameters.user_id, parameters.text);
    case "/get-least-used-emoji":
      return getLeastUsedEmojies(parameters.text);
    case "/new-thread":
      return handleNewThread(parameters.user_name);
  }
}

function handleGetEmojiCount(emojiToFind) {
  var emojiColumn = sheet.getRange(1, 1, sheet.getLastRow(), 1);
  var textFinder = emojiColumn.createTextFinder(emojiToFind);

  var cell = textFinder.findNext();

  if (cell == null) {
    return ContentService.createTextOutput('No matching emoji was found!');
  }

  var nextCell = sheet.getRange(cell.getRow(), cell.getColumn() + 1);
  var emojiCount = nextCell.getValue();
  if (emojiCount) {
    return ContentService.createTextOutput(`The emoji :${emojiToFind}: was used ${emojiCount} times.`);
  } else {
    return ContentService.createTextOutput(`The emoji :${emojiToFind}: has never been used!`);
  }


}

const imageURLs = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9kl74g343OWLpUCkgX3GHAa-j3f-p2Px9u3kCtrlz-iltCAmpM-YJm8l22KUzKEQTOe4&usqp=CAU",
  "https://cdn1.bigcommerce.com/n-63unu/ftagtzza/products/2117/images/871/es738__60503.1397519880.1280.1280.jpg?c=2",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxIFGuctm5m2U8qfYZHX2HxvcvX1Kakjh10lR9ayxZVLqPvVRY2BKH8g0pQWCq6__d7_I&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnU7d0Mff1RdSUdgDThbZ6kBxHHpbFde6u7Ly6Jx3gNAWsz6riUNqhUgSM5t6xsVYyWbk&usqp=CAU",
  "https://cdn1.bigcommerce.com/n-63unu/ftagtzza/products/2129/images/874/es740_1__28503.1397519891.380.500.jpg?c=2",
  "https://cdn1.bigcommerce.com/n-63unu/ftagtzza/products/2133/images/875/es741__47188.1397519894.380.500.jpg?c=2",
  "https://usamademedals.com/DesktopModules/Revindex.Dnn.RevindexStorefront/Portals/0/Gallery/906b3db1-71dd-425c-ad19-73cc77a4dca5.jpg",
  "https://usamademedals.com/DesktopModules/Revindex.Dnn.RevindexStorefront/Portals/0/Gallery/e184186d-fa75-4d39-8a30-f0f74b23c119.jpg",
  "https://i.imgur.com/rPvTimE.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLH1bEugJN_RWzgS2qYXg1INc4et4jxi6VVKnX47FDTahoLPGSzH_EuxXInrVJsUw2ZaI&usqp=CAU",
  "https://clipart-library.com/images/pT7K4AE8c.jpg"];


const imageURLsWorst = ["https://i.imgur.com/wHrs0Z6.jpg",
  "https://media.discordapp.net/attachments/680523277902413902/985222875772497993/ezgif.com-gif-maker.gif",
  "https://cdn.discordapp.com/attachments/678571170131607575/851922724779196486/unknown.png",
  "https://cdn5.vectorstock.com/i/1000x1000/29/49/broken-toaster-error-3d-icon-vector-24232949.jpg",
  "https://axerosolutions.com/assets/Uploaded-CMS-Files/bdb2f395-fdbf-4391-81b6-cd498b26ca65.png",
  "https://imgur.com/JhuhtZU.jpg",
  "https://i.imgur.com/jAgc05i.jpg",
  "https://tenor.com/view/chat-fach%C3%A9blanc-gif-24221161",
  "https://tenor.com/view/russia-yummy-awesome-yes-gif-13243745",
  "https://cdn5.vectorstock.com/i/1000x1000/29/49/broken-toaster-error-3d-icon-vector-24232949.jpg",
  "https://ih1.redbubble.net/image.1136245200.2768/st,small,507x507-pad,600x600,f8f8f8.u2.jpg"
];

function getBlock(emojiName, rank, uses, imageUrl) {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `${rank}PLACE*\n:${emojiName}: ${uses} uses`
    },
    "accessory": {
      "type": "image",
      "image_url": imageUrl,
      "alt_text": "alt text for image"
    }
  };
}


function getLeastUsedEmojies(number = 10) {
  if (!Number.isNumber(number)) {
    return ContentService.createTextOutput("Invalid input! Input must be a positive number!");
  }

  if (number <= 0) {
    return ContentService.createTextOutput("Invalid number!");
  }
  
  const bottE = getSortedEmojis(sheet, number, LeaderboardType.LEAST_USED).map((e, i) => {
    return getBlock(e[0], i + 1, e[1], imageURLsWorst[i] ?? imageURLsWorst[10])
  });

  let options = {
    'method': 'post',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'blocks': JSON.stringify(bottE),
      'channel': "C05EKHEF52B"
    }
  }
    ;

  let response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
  Logger.log(response);
  return ContentService.createTextOutput();
}

function getTopEmojies(user_id, number = 10) {
  if (!Number.isNumber(number)) {
    return ContentService.createTextOutput("Invalid input! Input must be a positive number!");
  }

  if (number <= 0) {
    return ContentService.createTextOutput("Invalid number!");
  }
  //if(number > 10){
  // const numberOfRanksOver10 = number - 10
  // for(rank = 0; rank < numberOfRanksOver10; rank++){
  // imageURLs.push('https://cdn-icons-png.flaticon.com/512/5372/5372351.png');
  // }
  //}
  const topE = getSortedEmojis(sheet, number, LeaderboardType.MOST_USED).map((e, i) => {
    return getBlock(e[0], i + 1, e[1], imageURLs[i] ?? imageURLs[10])
  });

  let options = {
    'method': 'post',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'blocks': JSON.stringify(topE),
      'channel': user_id
    }
  };

  let response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
  Logger.log(response);
  return ContentService.createTextOutput();
}


const currentThreadCell = "B1";
const threadChannelCell = "B2";

function handleNewThread(userId) {
  const spreadSheet = SpreadsheetApp.openByUrl(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL'));
  const threadsSheet = spreadSheet.getSheetByName('threads');

  let threadChannel = threadsSheet.getRange(threadChannelCell).getValue();

  let currentThread = threadsSheet.getRange(currentThreadCell).getValue();

  let postMessageResponse = JSON.parse(postMessage(`A new thread was created by <@${userId}>`, threadChannel));
  let newThread = postMessageResponse.ts;

  // previous threads are available
  if (currentThread != "") {
    postMessage(`Link to the new thread: ${JSON.parse(getMessageLink(threadChannel, newThread)).permalink}`, threadChannel, currentThread);
    postMessage(`Link to the previous thread:${JSON.parse(getMessageLink(threadChannel, currentThread)).permalink}`, threadChannel, newThread);
  }

  // change currentThread
  threadsSheet.getRange(currentThreadCell).setValue(newThread);

  return ContentService.createTextOutput();
}

function getMessageLink(channel, message_ts) {
  let options = {
    'method': 'get',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'channel': channel,
      'message_ts': message_ts
    }
  };

  return UrlFetchApp.fetch('https://slack.com/api/chat.getPermalink', options);
}