# 대학생활 멘토 연결 랜딩 페이지

MBTI + 혈액형 맞춤 가이드를 후킹으로 대학 1학년 연락처를 수집하는 랜딩 페이지.

## 파일 구조

```
survey-landing/
├── index.html        ← 랜딩 페이지 (이것만 배포)
├── apps-script.js    ← Google Sheets 연동 스크립트 (복붙용)
└── README.md
```

---

## Google Sheets 연동 설정 (5분)

### 1단계 — 구글 시트 준비
1. [Google Sheets](https://sheets.google.com) 에서 새 스프레드시트 생성
2. URL에서 시트 ID 복사
   ```
   https://docs.google.com/spreadsheets/d/[이 부분이 SHEET_ID]/edit
   ```

### 2단계 — Apps Script 등록
1. 시트 상단 메뉴 → **확장 프로그램** → **Apps Script**
2. 기본 코드 전체 삭제 후 `apps-script.js` 내용 붙여넣기
3. 코드 상단 `SHEET_ID`를 복사한 ID로 교체

### 3단계 — 웹 앱 배포
1. 상단 **배포** → **새 배포**
2. 유형: **웹 앱**
3. 설정:
   - 다음 사용자로 실행: **나**
   - 액세스 권한: **모든 사용자**
4. **배포** 클릭 → 웹 앱 URL 복사

### 4단계 — index.html에 URL 연결
`index.html` 상단의 이 줄을 찾아 교체:
```js
// 변경 전
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';

// 변경 후 (예시)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfy.../exec';
```

---

## 배포 방법

### GitHub Pages (무료, 추천)
1. GitHub에서 새 레포 생성
2. `index.html` 업로드
3. Settings → Pages → Branch: main → Save
4. `https://[username].github.io/[repo-name]` 으로 접근 가능

### Netlify (드래그앤드롭)
1. [netlify.com](https://netlify.com) 접속
2. `index.html` 파일을 드래그앤드롭
3. 즉시 URL 발급

---

## 수집 데이터 컬럼

| 컬럼 | 설명 |
|------|------|
| 타임스탬프 | 제출 일시 (한국 시간) |
| MBTI | 선택한 MBTI |
| 혈액형 | 선택한 혈액형 |
| 이름 | 이름 |
| 대학교 | 재학 중인 대학교 |
| 연락처 | 전화번호 또는 카카오톡 ID |
