function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orcamentos");
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.nome,
    data.telefone,
    data.aparelho,
    data.defeito
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({ status: "sucesso" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var osConsulta = e.parameter.os;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("OS");
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0].toString() === osConsulta) {
      return ContentService.createTextOutput(JSON.stringify({
        encontrado: true,
        os: data[i][0],
        cliente: data[i][1],
        aparelho: data[i][2],
        status: data[i][3],
        valor: data[i][4]
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ encontrado: false }))
    .setMimeType(ContentService.MimeType.JSON);
}
