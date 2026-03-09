const SHEET_ID   = '1yC14UwY13ub90jMmxhvlGCexmvlJPelgfV3LCrlQFNY';
const SHEET_NAME = '응답';
const HEADERS    = ['타임스탬프', 'MBTI', '혈액형', '키우고 싶은 역량', '이름', '대학교', '연락처'];

function doPost(e) {
  try {
    // hidden form 방식: e.parameter.payload 에 JSON 문자열로 들어옴
    const data = JSON.parse(e.parameter.payload);

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // 헤더가 없으면 추가
    if (sheet.getRange(1, 1).getValue() !== HEADERS[0]) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      const header = sheet.getRange(1, 1, 1, HEADERS.length);
      header.setBackground('#4f46e5');
      header.setFontColor('#ffffff');
      header.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.timestamp || '',
      data.mbti      || '',
      data.blood     || '',
      data.skills    || '',
      data.name      || '',
      data.univ      || '',
      data.contact   || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Apps Script 웹훅이 정상 동작 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}
