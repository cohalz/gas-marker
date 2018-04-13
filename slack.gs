function postToSlack(fileName) {

  const postUrl = globalVariables().slackUrl;
  const username = 'compro_bot';  // 通知時に表示されるユーザー名
  const icon = ':bow:';  // 通知時に表示されるアイコン

  var message = "@cohalz 採点を開始してください\n"

    message += "採点用スプレッドシート: " + getSheetUrl(fileName) + "\n\n"

    const workingFolders = getWorkingFolders(fileName);

  for(i = 0; i < workingFolders.length; i++){
    var alpha = String.fromCharCode("A".charCodeAt() + i);
    message += "課題フォルダ" + workingFolders[i].getName() + ": " + workingFolders[i].getUrl() + "\n";
  }

  message += "\n採点完了後アクセスするURL: " + globalVariables().webappUrl + "?fileName=" + fileName;

  var jsonData =
  {
    "username" : username,
    "icon_emoji": icon,
    "text" : message
  };
  var payload = JSON.stringify(jsonData);

  var options =
  {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : payload
  };

  UrlFetchApp.fetch(postUrl, options);
}


function getSheetUrl(sheetName){
  const spreadSheet = SpreadsheetApp.openById(globalVariables().spreadSheetId);
  const sheet = spreadSheet.getSheetByName(sheetName);

  return spreadSheet.getUrl() + '#gid=' + String(sheet.getSheetId());
}



function getWorkingFolders(fileName){
  const rootFolder = DriveApp.getFolderById(globalVariables().rootFolderId);
  const work_folders = rootFolder.getFoldersByName(fileName);

  var arr = [];
  i = 0;
  while (i == 0 && work_folders.hasNext()) {
    i++;

    var folders = work_folders.next().getFolders();

    while (folders.hasNext()) {
      var folder = folders.next();
      arr.push(folder);
    }

    arr.sort(function(a1, a2) {
        if (a1.getName() < a2.getName()) {
          return -1
        } else if (a1.getName() < a2.getName()) {
          return 1
        } else {
          return 0
        }
        });

  }
  return arr;
}
