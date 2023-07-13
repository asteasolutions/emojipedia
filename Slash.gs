function handleSlashCommand(request) {
  let parameters = request.parameter;

  switch (parameters.command) {
    case "/get-emoji-count":
      return handleGetEmojiCount(parameters.text);
    case "/get-emoji-ranking":
      return getTopEmojies(parameters.text);
    case "/get-least-used-emoji":
      return getLeastUsed();
    case "/new-thread":
      return handleNewThread(parameters.user_name);
  }
}

function handleGetEmojiCount(text) {
  var emojiToFind = text;


  var emojiColumn = sheet.getRange(1, 1, sheet.getLastRow(), 1);
  var textFinder = emojiColumn.createTextFinder(emojiToFind);


  // TODO: search only the first column
  var cell = textFinder.findNext();

  if (cell == null) {
    return ContentService.createTextOutput('No matching emoji was found!');
  }

  var nextCell = sheet.getRange(cell.getRow(), cell.getColumn() + 1);

  return ContentService.createTextOutput(nextCell.getValue());
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
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLH1bEugJN_RWzgS2qYXg1INc4et4jxi6VVKnX47FDTahoLPGSzH_EuxXInrVJsUw2ZaI&usqp=CAU"];


function getBlock(emojiName, rank, uses) {
  return {
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `${rank}PLACE*\n:${emojiName}: ${uses} uses`
    },
    "accessory": {
      "type": "image",
      "image_url": imageURLs[rank - 1],
      "alt_text": "alt text for image"
    }
  };
}

function getLeastUsed() {
  const botE = getSortedEmojis(sheet, 1, 1)
    ;
  Logger.log(botE);
  let options = {
    'method': 'post',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'blocks': JSON.stringify([{
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `LAAAST PLACE\n:${botE[0][0]}: ${botE[0][1]} uses`
        },
        "accessory": {
          "type": "image",
          "image_url": "https://i.imgur.com/wHrs0Z6.jpg",
          "alt_text": "alt text for image"
        }
      }]),
      'channel': "C05EKHEF52B"
    }
  };

  let response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
    Logger.log(response);
  return ContentService.createTextOutput();

}

function getTopEmojies(number = 10) {

  const topE = getSortedEmojis(sheet, number, 0).map((e, i) => {
    return getBlock(e[0], i + 1, e[1])
  });

  let options = {
    'method': 'post',
    'headers': {
      'Authorization': PropertiesService.getScriptProperties().getProperty('SLACK_AUTHENTICATION_TOKEN')
    },
    'payload': {
      'blocks': JSON.stringify(topE),
      'channel': "C05EKHEF52B"
    }
  }
  ;

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