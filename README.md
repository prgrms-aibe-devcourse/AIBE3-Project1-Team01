# AIBE3-Project1-Team01

AIBE3 1팀 &lt;h1>

<img width="500" height="500" alt="image" src="https://github.com/user-attachments/assets/0c53b8bb-4737-40b5-bcc6-b4d995bc399d" />

## 🧑‍🤝‍🧑 팀원 연락처

| 이름   | 이메일                  |
| ------ | ----------------------- |
| 김지윤 | pulip2517@gmail.com     |
| 심수민 | bgpd1258@naver.com      |
| 윤주찬 | yjc7241@naver.com       |
| 김은주 | kku1403@gmail.com       |
| 박태희 | taheepark2050@naver.com |
| 이승원 | dvlplee16@gmail.com     |

---

## 🛠️ 협업 도구

- ERD Cloud 링크  
  https://www.erdcloud.com/d/gDgtsBP5B48CqeDiB

- 팀 GitHub 저장소  
  [GitHub - prgrms-aibe-devcourse/AIBE3-Project1-Team01](https://github.com/prgrms-aibe-devcourse/AIBE3-Project1-Team01)

- Supabase 프로젝트  
  https://supabase.com/dashboard/project/caaykzqwvgjajpzozlnf

---

## 🤙🏻 커밋, 브랜치, PR 작성 규칙

- 참고 블로그 : https://nowsun.tistory.com/146
- feat, fix, docs 등 상황에 맞는 브랜치를 만들어 PR 보내고, 팀원들이 코드 리뷰 후 메인에 merge

---

## 🗂️ 폴더 구조

```bash
DEVCOURSE_PROJECT1/
├── app/
│   ├── components/               # 메인 페이지에서 사용하는 컴포넌트 모음
│   ├── 기능/                     # 내가 구현하고 있는 기능 폴더(recommend, plan, review, login)
│   │   ├── components/           # 기능별로 사용하는 컴포넌트 모음
│   │   └── hooks/                # 기능별로 사용하는 훅 모음
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # 메인 페이지
├── lib/
│   └── supabase.js              # Supabase 설정

```

---

## 📝 기획 및 준비

- Figma, Readdy, [v0.dev](http://v0.dev/) 등 AI 기반 디자인 도구를 활용한 UI/UX 설계
  - Figma: 페이지 구조 및 와이어프레임 생성
  - Readdy: 프롬프트 기반 와이어프레임 생성
  - v0.dev: 프롬프트 기반 UI 아이디어를 코드 및 컴포넌트로 변환
- ERD Cloud를 이용한 ERD 설계
- 기술 스택 확정 및 역할 분담

---

## 🎯 세부 수행 내용(과업)

- 여행 계획 및 추천 플랫폼 기능 설계 및 기획서 작성
- Figma / draw.io를 통한 와이어프레임 구현
- HTML / CSS / JavaScript를 사용하여 사용자 인터페이스 설계
- 여행 일정 생성 및 관리
- 객체 스토리지에 여행 사진 및 동영상 업로드
- 여행지 별 후기 페이지 생성
- 테스트 및 자체 QA 진행
- 서비스 시연 및 발표 자료 작성

---

## 🗂️ 전체 개요

- 여행 계획/추천 플랫폼
- 주요 기능: 일정 관리, 후기 게시판, 여행지 추천, 로그인, 사진 업로드 등
- 사용 기술 스택: React, Next.js, Tailwind CSS, Supabase, Git

---

## 📝 요구사항 정리

- 일정 게시판 CRUD  
  여행 일정을 등록, 조회, 수정, 삭제할 수 있는 기능 + 추천 기능 포함
- 후기 게시판 CRUD  
  여행 후기를 작성하고 다른 사람의 후기를 조회할 수 있는 기능 + 사진 업로드 포함
- 사진 업로드 기능  
  사용자가 후기에 사진을 첨부할 수 있도록 이미지 업로드 구현
- 로그인 기능  
  사용자 인증을 통한 로그인 / 로그아웃 처리
- 여행지 추천 기능  
  국내 지역에 따라 식당, 숙소, 관광지를 추천하는 기능

---

## 🧑‍💻 역할 분배 및 세부 내용

| 담당자 | 역할              | 세부 내용                                                      |
| ------ | ----------------- | -------------------------------------------------------------- |
| 박태희 | 일정 CRUD         |                                                                |
| 김지윤 | 후기 CRUD         |                                                                |
| 심수민 | 로그인 관리       |                                                                |
| 김은주 | 사진 업로드       |                                                                |
| 윤주찬 | 여행지 추천       | 국내 여행지 추천 → 식당, 숙소, 관광지 카테고리에 맞게 리스트화 |
| 이승원 | 전체 관리 및 발표 |                                                                |
| 공통   | ERD 설계          |                                                                |
<<<<<<< HEAD

---

🗺️ 여행지 추천 기능 - 프론트엔드 컴포넌트 및 로직 정리

| 파일명                  | 역할 (담당 기능)                            | `props` (입력)                                                                                                                       | 반환값/특이사항                               |
| :---------------------- | :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| **`TourCard.jsx`**      | 개별 여행지 카드 UI                         | `place` (여행지 데이터 객체), `onClick` (상세 모달 오픈 콜백 함수)                                                                   | -                                             |
| **`Pagination.jsx`**    | 페이지네이션 UI 및 로직                     | `pageNo` (현재 페이지 번호), `totalPages` (전체 페이지 수), <br> `pageNumbers` (페이지 버튼 배열), `onPageChange` (페이지 변경 콜백) | -                                             |
| **`SearchBar.jsx`**     | 검색창 UI 및 로직                           | `keyword` (검색어), `setKeyword` (검색어 변경 함수), `onSearch` (검색 실행 콜백)                                                     | -                                             |
| **`DetailModal.jsx`**   | 상세 정보 모달 UI 및 로직                   | `contentid` (상세 정보 조회용 ID), `onClose` (모달 닫기 콜백 함수)                                                                   | -                                             |
| **`useTourApiList.js`** | API 호출, 데이터/로딩/에러 관리 (커스텀 훅) | `{ areaCode, contentTypeId, cat1, cat2, keyword, pageNo, numOfRows }` (파라미터 객체)                                                | `{ places, loading, error, totalCount }` 반환 |
| **`TourApiList.jsx`**   | 컴포넌트/훅 조립 및 전반적인 상태 관리      | `areaCode`, `contentTypeId`, `cat1`, `cat2`                                                                                          | - (렌더링되는 여행지 추천 페이지)             |
=======
>>>>>>> eb11c3a2d90013677df1df293e262cdf662e8529
