function submitForm(e) {
  const itemResponses = e.response.getItemResponses();

  const zipfileId = itemResponses.filter(function(itemResponse){ return itemResponse.getItem().getTitle() == "アップロードするzipファイル";})[0].getResponse();
  const divideRates = itemResponses.filter(function(itemResponse){ return itemResponse.getItem().getTitle() == "振り分け比率";})[0].getResponse();

  const zipFileFullName = DriveApp.getFileById(zipfileId).getName();

  const fileName = zipFileFullName.match(/(.*?)\s\-\s.*?.zip/)[1];

  const mapping = divide(zipfileId, divideRates, fileName);
  createSheet(mapping, fileName);
  postToSlack(fileName);
}

function doGet(e) {
  var html = HtmlService.createTemplateFromFile("dialog");
  html.sheetName = e.parameter.fileName;
  html.fileName = e.parameter.fileName + ".csv";

  return html.evaluate();
}
