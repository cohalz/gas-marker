function export(sheetName){
  // スプレッドシート上の値を二次元配列の形で取得

  const spreadSheet = SpreadsheetApp.openById(globalVariables().spreadSheetId);
  const sheet = spreadSheet.getSheetByName(sheetName);

  var values = sheet.getDataRange().getValues();

  // 二次元配列をCSV形式のテキストデータに変換
  var dataArray = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    row.shift();
    dataArray.push(row.join(","));
  }
  return dataArray.join("\n");
}
