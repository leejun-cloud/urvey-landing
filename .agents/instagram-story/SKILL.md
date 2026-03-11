---
name: instagram-story
description: 인스타그램형 스토리 (녹화, 미디어, 다양한 공감 반응 등) 구현 스킬
version: "1.0"
---

# Instagram-Style Story Skill

이 스킬은 가족 아카이브 프로젝트에서 인스타그램 스타일의 스토리 기능(사진/비디오 업로드, 오디오 녹음, 다양한 공감 반응)을 구현하거나 수정할 때 참고하는 가이드입니다. 

---

## 🎯 주요 기능

| 기능 | 설명 |
|------|------|
| **미디어 업로드** | 사진, 비디오 형식의 다중 미디어 첨부 (`MediaUploader` 활용) |
| **오디오 녹음** | Web Audio API 기반의 음성 녹음 기능 (`AudioRecorder` 활용) |
| **스토리 작성 폼** | 내용, 미디어, 음성 녹음을 종합하여 Firestore에 업로드 |
| **다양한 공감 반응** | '기억해요', '감사해요', '이어갈게요', '사랑해요', '응원해요' 등 커스텀 반응 기능 |

---

## 📁 핵심 컴포넌트 템플릿

이 위치의 `templates/` 폴더 내에 기존에 구현되어 정상 작동하는 컴포넌트들의 코드가 복사되어 있습니다. 다른 파일들 개발 시 템플릿이나 참고 자료로 활용할 수 있습니다.

- **`templates/CreateStoryForm.tsx`**: `react-hook-form` 기반 폼, Firebase Storage 파일 업로드(`uploadFiles`), Firestore 문서 생성(`uploadStory`) 로직 연동
- **`templates/StoryReactions.tsx`**: Firebase Firestore의 `updateDoc`과 `increment`를 사용하여 특정 타입의 반응 수를 증가시키는 로직 및 UI 컴포넌트 단위 구현

---

## 💡 구현 시 주의 사항 패턴 (Troubleshooting)

> 프로젝트 내 다른 곳에 해당 기능을 이식하거나 추가 기능을 개발할 때 아래의 문제 발생 가능성을 숙지하세요.

### 1. 폼 데이터 업로드 분리 처리
```
과거 패턴: 오디오와 미디어 파일의 업로드 비동기 처리가 엉키어 Firestore에 URL이 누락되는 현상
해결 방식: CreateStoryForm 템플릿의 onSubmit 부분에서 볼 수 있듯이, 
미디어 파일 배열과 오디오 단일 파일을 각각 uploadFiles() 호출하여 await한 후 최종 URL 문자열들을 Firestore에 기록하는 순차적 방식 사용 권장
```

### 2. 반응 카운트 중복 업데이트 및 성능 제한
```
과거 패턴: 좋아요(반응) 버튼을 빠르게 여러 번 누를 경우 네트워크 병목 발생
해결 방식: StoryReactions 템플릿 내에 `isLoading` 상태가 포함된 `handleClick` 메서드를 참고하여,
버튼 연타 방지(disabled 처리) 및 Firestore increment 최적화 기법을 적용할 것
```

### 3. 미디어 저장 구조
```
- stories 컬렉션 도큐먼트 구조 참고:
{
  content: string;
  mediaUrls: string[]; 
  audioUrl: string; // 단일 녹음
  authorId: string;
  reactions: {
    remember: number;
    grateful: number;
    legacy: number;
    love: number;
    support: number;
  };
  createdAt: timestamp;
}
```

---

## ✅ 이 스킬 코드 이식/수정 시 체크리스트

- [ ] 컴포넌트가 `react-hook-form` 폼 상태 관리를 온전히 수행하고 있는가?
- [ ] 녹음 (`AudioRecorder`) 권한 요청 및 HTTPS 환경/보안 제약사항을 점검했는가?
- [ ] `components/ui`의 공용 Button, Toast, ProgressBar 컴포넌트를 올바르게 import 하였는가?
- [ ] 반응 개체 필드의 데이터 무결성을 위해 `increment`를 정상적으로 사용 중인가?
