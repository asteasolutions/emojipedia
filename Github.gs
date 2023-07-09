 const GIT_API_URL = 'https://api.github.com/repos/asteasolutions/emmnojipedia/contents/emojipedia/Code.gs';
async function myFunction() {
  var res = UrlFetchApp.fetch(GIT_API_URL);
    var content = res.getContentText();
   let str = content.toString();
   Logger.log(str);

}
