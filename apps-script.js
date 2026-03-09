/**
 * Google Apps Script — 설문 데이터 → Google Sheets 저장
 *
 * 사용법:
 * 1. 아래 SHEET_ID를 본인 구글 시트 ID로 교체
 * 2. 배포 → 웹 앱 → 액세스: 모든 사용자 → 배포
 * 3. 배포 URL을 index.html의 APPS_SCRIPT_URL에 붙여넣기
 */

const SHEET_ID   = 'YOUR_GOOGLE_SHEET_ID_HERE';  // ← 교체 필요
const SHEET_NAME = '응답';                         // 시트 탭 이름

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // 시트가 없으면 자동 생성
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['타임스탬프', 'MBTI', '혈액형', '이름', '대학교', '연락처']);

      // 헤더 스타일
      const header = sheet.getRange(1, 1, 1, 6);
      header.setBackground('#4f46e5');
      header.setFontColor('#ffffff');
      header.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.timestamp,
      data.mbti,
      data.blood,
      data.name,
      data.univ,
      data.contact,
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

// GET 요청으로 동작 확인 (선택)
function doGet() {
  return ContentService
    .createTextOutput('Apps Script 웹훅이 정상 동작 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}
