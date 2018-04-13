function createSheet(mapping, fileName) {
  const spreadSheet = SpreadsheetApp.openById(globalVariables().spreadSheetId);
  const sheet = spreadSheet.insertSheet(fileName);

  var keys = ['採点者', '学籍番号', '点数', '採点者コメント'];

  //列名を設定
  for(i = 0; i < keys.length; i++) {
    sheet.getRange(1, i + 1).setValue(keys[i]);
  }

  for(i = 0; i < mapping.length; i++){
    for(j = 0; j < mapping[i].length; j++){
      sheet.getRange(i + 2, j + 1).setValue(mapping[i][j]);
    }
  }
}
