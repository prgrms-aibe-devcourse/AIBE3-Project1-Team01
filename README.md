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

- **여행 계획/추천 플랫폼**
- **주요 기능:** 일정 관리, 후기 게시판, 여행지 추천, 로그인, 사진 업로드 등
- **사용 기술 스택:** React, Next.js, Tailwind CSS, Supabase, Git
- **사용 스타일:**
    * **#C9E6E5 (아쿠아 블루 계열)**
        * 활용: 서브 배경, 구분선, 아이콘, 텍스트 하이라이트, 보조 콘텐츠 영역 배경.
    * **#F6EFEF (아주 연한 분홍/회색 계열)**
        * 활용: 메인 배경, 카드 배경, 콘텐츠 영역 기본 배경, 페이지 전체의 주된 배경색.
    * **#FBDED6 (피치/살구색 계열)**
        * 활용: 특정 섹션 배경, 정보 블록 강조, 이미지 오버레이, 부드러운 포인트 색상.
    * **#F4CCC4 (연한 산호색/코랄 계열)**
        * 활용: 버튼, 링크, 헤더/푸터 배경, 중요한 카드 요소 배경, 주요 액센트 색상.
    * **#413D3D (진한 회색/검정 계열)**
        * 활용: 본문/제목 텍스트, 푸터 배경, 어두운 색상 헤더, 중요한 구분선, 배경과 대비되는 요소.
활용: 본문/제목 텍스트, 푸터 배경, 어두운 색상 헤더, 중요한 구분선, 배경과 대비되는 요소.

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
  국내 지역에 따라 사용자가 원하는 곳을 검색하고 랜덤으로 추천 받는 기능

---

## 🧑‍💻 역할 분배 및 세부 내용

| 담당자 | 역할              | 세부 내용                                                         |
| ------ | ----------------- | ----------------------------------------------------------------- |
| 박태희 | 일정 CRUD         |                                                                   |
| 김지윤 | 후기 CRUD         |                                                                   |
| 심수민 | 로그인 관리       |                                                                   |
| 김은주 | 사진 업로드       |                                                                   |
| 윤주찬 | 여행지 추천       | 국내 여행지 추천 → 카테고리에 맞게 리스트화 및 랜덤 여행지 추천 |
| 이승원 | 전체 관리 및 발표 |                                                                   |
| 공통   | ERD 설계          |                                                                   |

---

# Auth 기능 소개

Supabase의 인증 시스템을 기반으로 이메일 회원가입/ Google OAuth 로그인/ 전역로그인 상태 관리 구현했다.

AuthProvider를 통해 애플리케이션 전체가 로그인 상태를 공유, 필요할 때 useAuth() 훅을  접근할 수 있다.

## 🚀 기능 정리

- 이메일 기반 회원 로그인/회원가입
    - 회원가입 성공/실패 시 예외처리
    - 로그인 성공/실패 시 예외처리
    - 로그인/회원가입 로딩 시 버튼에 스피너 적용
- Google OAuth 로그인 지원
- 로그인 유지
- 인증 상태 변경 감지
- 전역 상태 관리

## 🗂️ 파일 위치

```jsx
📦 app
├── 📁 login/                            
│   └── LoginModal.tsx                  // 로그인 UI 컴포넌트, supabase 인증 호출
│   └── page.tsx                        // 라우팅 전용 페이지
│
├── 📁 signup/
│   └── SignupModal.tsx                 // 회원가입 UI 컴포넌트, supabase 인증 호출
│   └── page.tsx                        // 라우팅 전용 페이지
│
├── 📁 hooks/
│   └── useRequireAuth.ts               // 로그인하지 않았을 경우 리다이렉션 해주는 커스텀 훅
│
├── 📁 components/
│   └── Header.tsx                      // 상단 네비게이션 바                       
│
├── 📁 context/   
│   └── AuthContext.tsx                 // supabase 기반으로 로그인 상태를 전역으로 관리
│
├── 📁 lib/   
│   └── supabase.js                     // supabase 클라이언트 초기화 파일

```

## 💾 데이터 모델

- supabase 기반

---

# 일정 CRUD

## 🚀 기능 정리

- **계획 생성(Create Plan)**
    - 새로운 계획을 생성하고 저장합니다.
    - 사용자 입력을 받아 계획의 제목, 내용, 기간 등을 설정합니다.
- **계획 조회(View Plan)**
    - 저장된 계획 목록을 조회할 수 있습니다.
    - 각 계획의 상세 정보를 확인할 수 있습니다.
- **계획 수정(Edit Plan)**
    - 기존 계획의 내용을 수정할 수 있습니다.
    - 제목, 기간, 세부 내용 등 변경이 가능합니다.
- **계획 삭제(Delete Plan)**
    - 필요 없는 계획을 삭제할 수 있습니다.
    - 완료된 계획은 별도로 표시됩니다.

## 🗂️ 폴더 구조

```
📦 app/plans/
├── page.tsx                // 여행 계획 생성/수정 메인 페이지
├── 📁 [id]/
│   └── page.tsx            // 특정 여행 계획 상세 페이지
├── 📁 components/
│   ├── AlertModal.tsx      // 알림 모달
│   ├── DateRangePicker.tsx // 날짜 선택 컴포넌트
│   ├── DayInputs.tsx       // 일별 일정 입력 컴포넌트
│   ├── PlanDetail.tsx      // 계획 상세 정보 컴포넌트
│   └── PlanForm.tsx        // 계획 기본 정보 입력 폼
└── 📁 list/
    └── page.tsx            // 여행 계획 목록 페이지
```

## 💾 데이터 모델

plans

| 컬럼명 | 타입 | PK/FK | Null 여부 |
| --- | --- | --- | --- |
| id | int | PK | x |
| title | varchar |  | o |
| description | text |  | o |
| start_date | date |  | x |
| end_date | date |  | x |
| user_id | uuid | FK | x |
| created_at | timestamp |  | x |

plan_items

| 칼럼명 | 타입 | PK/FK  | Null 여부 |
| --- | --- | --- | --- |
| id | int | PK | x |
| date | date |  | x |
| place | varchar |  | o |
| detail | text |  | o |
| order | int |  | x |
| plan_id | int | FK | x |

---

# 리뷰 CRUD
## 🚀 기능 정리

- [x]  **리뷰 등록**
    - 제목,  여행 지역,  평점,  내용 입력
    - 이미지 추가,  삭제
    - 대표 이미지 지정

- [x]  **리뷰 수정**
    - 제목,  여행 지역,  평점,  내용 수정
    - 이미지 추가,  교체,  삭제
    - 대표 이미지 교체 및 삭제
    
- [x]  **리뷰 목록 조회**
    - 내가 쓴 글, 여행 지역, 평점 기준 필터링 지원
    - 대표 이미지,  제목,  내용,  지역,  평점,  작성 날짜 표시
    
- [x]  **리뷰 상세 페이지 조회**
    - 제목,  지역,  평점,  전체 리뷰 내용, 작성 날짜,  수정 날짜 표시
    - 리뷰에 속한 모든 이미지 표시

---

## 🗂️ 폴더 구조

```bash
📂 app/reviews

├── 📁 [id]
│   ├── 📁 edit
│   │   └── 📄 page.tsx              # 리뷰 수정 페이지
│   └── 📄 page.tsx                  # 리뷰 상세 페이지
│
├── 📁 components
│   ├── 📄 ReviewFilter.tsx         # 리뷰 리스트 필터링 폼
│   ├── 📄 ReviewContentForm.tsx    # 리뷰 본문 입력 폼 
│   ├── 📄 ReviewImageUpload.tsx    # 이미지 업로드 폼
│   ├── 📄 ReviewImageEdit.tsx      # 이미지 수정 폼
│   ├── 📄 ReviewModal.tsx          # 리뷰 피드백용 모달
│   └── 📄 ReviewConfirmModal.tsx   # 리뷰 삭제/수정 확인 모달
│
├── 📁 constants
│   └── 📄 regions.ts               # 지역 데이터 (국내 여행지 리스트 등)
│
├── 📁 hooks
│   ├── 📄 useImageUpload.ts        # 이미지 업로드 상태 관리 훅
│   ├── 📄 useReviewContent.ts      # 리뷰 본문 상태 관리 훅
│   └── 📄 useReviewImageEdit.ts    # 이미지 수정 상태 관리 훅
│
├── 📁 lib
│   ├── 📄 imageEditor.ts           # Supabase 이미지 편집 관련 함수
│   ├── 📄 imageUploader.ts         # Supabase 이미지 업로드 함수
│   └── 📄 imageUtils.ts            # 유틸 함수 모음 (파일명 생성, 퍼블릭 URL 획득 등)
│
├── 📁 write
│   └── 📄 page.tsx                 # 리뷰 작성 페이지
│
└── 📄 page.tsx                     # 리뷰 목록 페이지
```

- components : UI
- hooks : 상태
- lib : supabase 연동

---

## 💾 데이터 모델

### reviews 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 리뷰 고유 ID |
| `user_id` | UUID | 🔗 FK(users.id) | ❌ | 작성자 ID (Supabase 유저 참조) |
| `title` | text |  | ❌ | 리뷰 제목 |
| `content` | text |  | ❌ | 리뷰 본문 |
| `region` | text |  | ❌ | 지역 (예: 서울, 경기, 인천) |
| `region_city` | text |  | ⭕ | 세부 지역 (예: 강남구, 수원) |
| `rating` | int |  | ❌ | 리뷰 평점 (1~5) |
| `created_at` | timestamp |  | ❌ | 생성 시각 (자동 생성 - 현지 시각) |
| `updated_at` | timestamp |  | ⭕ | 수정 시각 (자동 갱신 - 현지 시각) |

### images 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 이미지 고유 ID |
| `review_id` | int | 🔗FK(reviews.id) | ❌ | 해당 이미지가 속한 리뷰 ID |
| `img_url` | text |  | ❌ | Supabase Storage의 공개 이미지 URL |
| `order` | int |  | ❌ | 이미지 순서 |
| `is_cover` | boolean |  | ⭕ | 대표 이미지 여부 (true/false) |

---
# 여행지 추천

## 🚀 기능 정리

---

- **여행지 리스트 조회**
    - `areaBasedList2`: 지역 및 카테고리별 여행지 목록을 조회합니다.
- **키워드 검색**
    - `searchKeyword2`: 키워드를 사용하여 여행지를 검색합니다.
- **지도 기반 추천**
    - `locationBasedList2`: 내 위치 또는 지도 기반으로 장소를 추천합니다. (추후 지도 기능 추가를 위해 만들어 두었습니다.)
- **상세 정보**
    - `detailCommon2`: 여행지의 상세 정보(이미지, 주소 등)를 제공합니다.
- **랜덤 / 커스텀 게임**

## 🗂️ 폴더 구조

```
app/
├── components/               # 공통 UI 컴포넌트 (Header, PopularDestinations 등)
├── hooks/                    # 인증 등 공통 훅
├── context/                  # 전역 상태 관리 (AuthContext)
├── lib/                      # 외부 연동(supabase 등)
└── recommendation/       
├── components/           
│   ├── CategoryTabs.jsx      # 컨텐츠 타입 id로 카테고리 탭(관광지, 식당, 숙박 등)
│   ├── RegionSelector.jsx    # 지역 선택(서울, 제주도, 부산 등)
│   ├── SubCategoryTabs.jsx   # 상세 카테고리(테마, 소분류 등) 선택
│   ├── TourApiList.jsx       # 필터링된 여행지 리스트 렌더링
│   ├── TourCard.jsx          # 여행지/장소 카드 UI
│   ├── common/             
│   │   ├── Pagination.jsx        # 페이지네이션
│   │   └── SearchBar.jsx         # 검색창
│   ├── detail/              
│   │   └── DetailModal.jsx       # 장소 상세 정보 모달
│   └── game/                
│       ├── RandomBarGame.jsx     # 랜덤 바/맛집 게임
│       └── CustomGameModal.jsx   # 커스텀 게임 모달
├── hooks/
│   └── useTourApiList.js     # Tour API 데이터 fetch 커스텀 훅
├── constants/
│   └── travelData.js         # 지역/카테고리 트리, 좌표 등 상수
└── page.jsx                  # 추천 메인 페이지
```

## 💾 데이터 모델

Tour API에서 불러오는 주요 데이터(장소/여행지) 모델 예시입니다.

| 필드명 | 설명 | 예시/비고 |
| --- | --- | --- |
| contentid | 고유 ID | 123456 |
| title | 장소명 | 경복궁 |
| firstimage | 대표 이미지 URL | http://...jpg |
| addr1 | 주소 | 서울특별시 종로구 ... |
| tel | 전화번호 | 02-123-4567 |
| homepage | 홈페이지 | http://... |
| overview | 장소 개요/설명 | ... |
| contenttypeid | 콘텐츠 타입 ID | 12(관광지), 39(음식점) 등 |
| areacode | 지역 코드 | 1(서울), 6(부산) 등 |
| mapx | 경도 | 126.9779692 |
| mapy | 위도 | 37.566535 |
| cat1 | 대분류 코드 | A01, A02 등 |
| cat2 | 중분류 코드 | A0101, A0201 등 |
| cat3 | 소분류 코드 | A01010100 등 |

> ※ 실제 API 응답에는 이 외에도 다양한 필드가 포함될 수 있습니다.

> ※ 더 자세한 카테고리/지역 코드는 travelData.js 참고 하면 됩니다.

