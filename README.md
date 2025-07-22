# ✈️ h1 Trip

<img width="50%" src="https://github.com/user-attachments/assets/0c53b8bb-4737-40b5-bcc6-b4d995bc399d" alt="H1Trip Logo" />

**h1 Trip**은 **h1** 팀이 만든 올인원 여행 플랫폼입니다.

여행을 계획하고, 추천받고, 기록까지 남길 수 있습니다.

**여행지 추천 → 일정 관리 → 후기 공유**의 전 과정을 하나의 서비스에서 경험해보세요.

---

# 🚀 서비스 이용하기

- 🔗 **웹사이트 바로가기**: vercel
- 🎞️ **시연 영상 보기** : gif로는 너무 커서 안들어가요... 다른 시연 영상 있나요? 
---

# 🧩 핵심 기능

| 기능 구분 | 주요 내용 |
| --- | --- |
| 👤 사용자 인증 | 이메일 로그인 및 Google 소셜 로그인 |
| 🗺️ 여행지 추천 | 지역 기반 추천, 키워드 검색, 랜덤 추천 |
| 📅 일정 설계 | 여행 일정 생성/수정/삭제, 세부 계획 작성 |
| ✍️ 후기 기록 | 여행지 후기 및 사진 작성/수정/삭제 |
| ☁️ 클라우드 저장 | Supabase 기반 스토리지 및 데이터 관리 |

---

# 🔍 상세 기능

## 👤 사용자 인증

![auth](https://github.com/user-attachments/assets/693e57f1-144a-4ebf-bdf8-2def4adf956b)

> 이메일과 소셜 로그인을 통한 사용자 인증 기능을 제공합니다.

- **이메일 기반 회원 로그인/회원가입**
    - 이메일과 비밀번호로 회원가입 및 로그인
- **Google OAuth 로그인**
    - 구글 계정으로 간편 로그인
- **로그인 유지**
    - 새로고침 후에도 로그인 상태 유지
- **로그아웃**
    - 사용자 세션을 종료하고 인증 상태 초기화화
- **인증 상태 변경 감지**
    - 로그인/로그아웃 시 인증 상태 실시간 반영


<details>
<summary>폴더 구조</summary>

```bash
📦 app
├── 📁 login/
│   └── LoginModal.tsx                  # 로그인 UI 컴포넌트, supabase 인증 호출
│   └── page.tsx                        # 라우팅 전용 페이지
│
├── 📁 signup/
│   └── SignupModal.tsx                 # 회원가입 UI 컴포넌트, supabase 인증 호출
│   └── page.tsx                        # 라우팅 전용 페이지
│
├── 📁 hooks/
│   └── useRequireAuth.ts               # 로그인하지 않았을 경우 리다이렉션 해주는 커스텀 훅
│
├── 📁 components/
│   └── Header.tsx                      # 상단 네비게이션 바
│
├── 📁 context/
│   └── AuthContext.tsx                 # supabase 기반으로 로그인 상태를 전역으로 관리
│
└── 📁 lib/
    └── supabase.js                     # supabase 클라이언트 초기화 파일

```

</details>
<details>
<summary>추가 설명</summary>

  - Supabase의 인증 시스템을 기반으로 이메일 회원가입/ Google OAuth 로그인/ 전역로그인 상태 관리 구현했습니다.  
  - AuthProvider를 통해 애플리케이션 전체가 로그인 상태를 공유하고 있으며, 필요할 때 useAuth() 훅으로  접근할 수 있습니다.

</details>

---

## 🗺️ 여행지 추천

![recommend](https://github.com/user-attachments/assets/b106c5a6-4d7a-4305-805c-2a2935ad5b05)


> 지역, 카테고리, 키워드, 랜덤 추천 등 다양한 방식으로 여행지를 탐색할 수 있습니다.

- **여행지 리스트 조회**
    - 지역 및 카테고리별 여행지 목록 조회
- **키워드 검색**
    - 키워드를 사용하여 여행지 검색
- **상세 정보**
    - 여행지의 주소, 이미지, 설명 제공
- **랜덤 / 커스텀 게임**
    - 여행지 중 랜덤 추천
    - 사용자가 선택한 여행지 목록에서 랜덤 추천

<details>
<summary>폴더 구조</summary>

```bash
📦 app
└── 📁 recommendation/
    ├── 📁 components/
    │   ├── CategoryTabs.jsx           # 컨텐츠 타입 id로 카테고리 탭(관광지, 식당, 숙박 등)
    │   ├── RegionSelector.jsx         # 지역 선택(서울, 제주도, 부산 등)
    │   ├── SubCategoryTabs.jsx        # 상세 카테고리(테마, 소분류 등) 선택
    │   ├── TourApiList.jsx            # 필터링된 여행지 리스트 렌더링
    │   ├── TourCard.jsx               # 여행지/장소 카드 UI
    │   │
    │   ├── 📁 common/
    │   │   ├── Pagination.jsx         # 페이지네이션
    │   │   └── SearchBar.jsx          # 검색창
    │   │
    │   ├── 📁 detail/
    │   │   └── DetailModal.jsx        # 장소 상세 정보 모달
    │   │
    │   └── 📁 game/
    │       ├── RandomBarGame.jsx      # 랜덤 바/맛집 게임
    │       └── CustomGameModal.jsx    # 커스텀 게임 모달
    │
    ├── 📁 hooks/
    │   └── useTourApiList.js          # Tour API 데이터 fetch 커스텀 훅
    │
    ├── 📁 constants/
    │   └── travelData.js              # 지역/카테고리 트리, 좌표 등 상수
    │
    └── page.jsx                       # 추천 메인 페이지

```

</details>
<details>
<summary>추가 설명</summary>

- Tour API에서 불러오는 주요 데이터(장소/여행지) 모델 예시입니다.

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

> ※ 실제 API 응답에는 이 외에도 다양한 필드가 포함될 수 있습니다.  
> ※ 더 자세한 카테고리/지역 코드는 travelData.js 참고 하면 됩니다.
</details>

---

## 📅 일정 설계

![plan](https://github.com/user-attachments/assets/5e89562e-7031-48b5-93f0-166dc32197a7)


> 여행 일정을 생성하고, 날짜별 계획을 자유롭게 구성 및 편집할 수 있습니다.

- **계획 생성**
    - 여행 제목, 설명, 기간 입력
    - 날짜별 일정 구성
    - 날짜별 일정 순서 변경 가능
- **계획 수정**
    - 제목, 설명, 기간, 일정 순서 및 내용 변경 가능
- **계획 목록 조회**
    - 사용자가 작성한 여행 계획 목록
    - 제목, 여행 기간, 설명 표시
- **계획 상세 페이지 조회**
    - 전체 일정 흐름을 날짜별로 확인

<details>
<summary>폴더 구조</summary>

```bash
📦 app
└── 📁 plans/
    ├── page.tsx                     # 여행 계획 생성 및 수정 페이지
    │
    ├── 📁 [id]/
    │   └── page.tsx                 # 여행 계획 상세 페이지
    │
    ├── 📁 components/
    │   ├── AlertModal.tsx           # 알림 모달 컴포넌트
    │   ├── DateRangePicker.tsx      # 여행 기간 선택 컴포넌트
    │   ├── DayInputs.tsx            # 일별 일정 입력 컴포넌트
    │   ├── PlanDetail.tsx           # 계획 상세 정보 컴포넌트
    │   └── PlanForm.tsx             # 계획 기본 정보 입력 폼
    │
    └── 📁 list/
        └── page.tsx                # 여행 계획 목록 페이지
```

</details>
<details>
<summary>DB 구조</summary>

plans 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 계획 고유 ID |
| `title` | varchar |  | ⭕ | 계획 제목 |
| `description` | text |  | ⭕ | 계획 설명 |
| `start_date` | date |  | ❌ | 시작 날짜 |
| `end_date` | date |  | ❌ | 종료 날짜 |
| `user_id` | uuid | 🔗 FK | ❌ | 작성자 ID (users.id 참조) |
| `created_at` | timestamp |  | ❌ | 생성 시각 |

plan_items 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 일정 항목 고유 ID |
| `date` | date |  | ❌ | 일정 날짜 |
| `place` | varchar |  | ⭕ | 장소명 |
| `detail` | text |  | ⭕ | 상세 내용 |
| `order` | int |  | ❌ | 순서 |
| `plan_id` | int | 🔗 FK | ❌ | 계획 ID (plans.id 참조) |
</details>

---

## ✍️ 후기 기록

![review](https://github.com/user-attachments/assets/c6809d25-a057-4c13-a87d-fb68f61ce80d)

> 여행에 대한 후기를 작성하고, 이미지와 함께 공유할 수 있습니다.

- **리뷰 등록**
    - 제목, 여행 지역, 평점, 내용 입력
    - 이미지 추가, 삭제
    - 대표 이미지 지정
- **리뷰 수정**
    - 제목, 여행 지역, 평점, 내용 수정
    - 이미지 추가, 교체, 삭제
    - 대표 이미지 변경
- **리뷰 목록 조회**
    - 내가 쓴 글, 여행 지역, 평점 기준 필터링 지원
    - 대표 이미지, 제목, 내용, 지역, 평점, 작성 날짜 표시
- **리뷰 상세 페이지 조회**
    - 제목, 지역, 평점, 전체 리뷰 내용, 작성 날짜, 수정 날짜 표시
    - 리뷰에 속한 모든 이미지 표시
    

<details>
<summary>폴더 구조</summary>

```bash
📦 app
└── 📁 reviews/
    ├── 📁 [id]/
    │   ├── 📁 edit/
    │   │   └── page.tsx                 # 리뷰 수정 페이지
    │   └── page.tsx                     # 리뷰 상세 페이지
    │
    ├── 📁 components/
    │   ├── ReviewFilter.tsx             # 리뷰 리스트 필터링 폼
    │   ├── ReviewContentForm.tsx        # 리뷰 본문 입력 폼
    │   ├── ReviewImageUpload.tsx        # 이미지 업로드 폼
    │   ├── ReviewImageEdit.tsx          # 이미지 수정 폼
    │   ├── ReviewModal.tsx              # 리뷰 피드백용 모달
    │   └── ReviewConfirmModal.tsx       # 리뷰 삭제/수정 확인 모달
    │
    ├── 📁 constants/
    │   └── regions.ts                   # 지역 데이터 (국내 여행지 리스트 등)
    │
    ├── 📁 hooks/
    │   ├── useImageUpload.ts            # 이미지 업로드 상태 관리 훅
    │   ├── useReviewContent.ts          # 리뷰 본문 상태 관리 훅
    │   └── useReviewImageEdit.ts        # 이미지 수정 상태 관리 훅
    │
    ├── 📁 lib/
    │   ├── imageEditor.ts               # Supabase 이미지 편집 관련 함수
    │   ├── imageUploader.ts             # Supabase 이미지 업로드 함수
    │   └── imageUtils.ts                # 유틸 함수 모음 (파일명 생성, 퍼블릭 URL 획득 등)
    │
    ├── 📁 write/
    │   └── page.tsx                     # 리뷰 작성 페이지
    │
    └── page.tsx                         # 리뷰 목록 페이지
```

- components : UI
- hooks : 상태
- lib : supabase 연동
</details>
<details>
<summary>DB 구조</summary>

reviews 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 리뷰 고유 ID |
| `user_id` | UUID | 🔗 FK([users.id](http://users.id/)) | ❌ | 작성자 ID (Supabase 유저 참조) |
| `title` | text |  | ❌ | 리뷰 제목 |
| `content` | text |  | ❌ | 리뷰 본문 |
| `region` | text |  | ❌ | 지역 (예: 서울, 경기, 인천) |
| `region_city` | text |  | ⭕ | 세부 지역 (예: 강남구, 수원) |
| `rating` | int |  | ❌ | 리뷰 평점 (1~5) |
| `created_at` | timestamp |  | ❌ | 생성 시각 (자동 생성 - 현지 시각) |
| `updated_at` | timestamp |  | ⭕ | 수정 시각 (자동 갱신 - 현지 시각) |

images 테이블

| 컬럼명 | 타입 | PK/FK | Null 여부 | 코멘트 |
| --- | --- | --- | --- | --- |
| `id` | int | ✅ PK | ❌ | 이미지 고유 ID |
| `review_id` | int | 🔗FK([reviews.id](http://reviews.id/)) | ❌ | 해당 이미지가 속한 리뷰 ID |
| `img_url` | text |  | ❌ | Supabase Storage의 공개 이미지 URL |
| `order` | int |  | ❌ | 이미지 순서 |
| `is_cover` | boolean |  | ⭕ | 대표 이미지 여부 (true/false) |

</details>

---

# 🧠 서비스 설계 및 기술 스택

## 🎨 UI/UX

- `readdy`로 초기 UI 기획
    - https://readdy.link/preview/6b1f2d64-4dc1-4d00-b59e-754a93bb729c/1104844
- 컬러 팔레트
    - **#C9E6E5 (아쿠아 블루 계열)**
        - 활용: 서브 배경, 구분선, 아이콘, 텍스트 하이라이트, 보조 콘텐츠 영역 배경.
    - **#F6EFEF (아주 연한 분홍/회색 계열)**
        - 활용: 메인 배경, 카드 배경, 콘텐츠 영역 기본 배경, 페이지 전체의 주된 배경색.
    - **#FBDED6 (피치/살구색 계열)**
        - 활용: 특정 섹션 배경, 정보 블록 강조, 이미지 오버레이, 부드러운 포인트 색상.
    - **#F4CCC4 (연한 산호색/코랄 계열)**
        - 활용: 버튼, 링크, 헤더/푸터 배경, 중요한 카드 요소 배경, 주요 액센트 색상.
    - **#413D3D (진한 회색/검정 계열)**
        - 활용: 본문/제목 텍스트, 푸터 배경, 어두운 색상 헤더, 중요한 구분선, 배경과 대비되는 요소.

## 🗃️ DB 설계

- ERD : https://www.erdcloud.com/d/gDgtsBP5B48CqeDiB
- Supabase : https://supabase.com/dashboard/project/caaykzqwvgjajpzozlnf

## 🛠️ 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Frontend | React, Next.js, TypeScript |
| Styling | Tailwind CSS |
| Auth | Supabase Auth, Google Login |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage (Image Upload) |
| Hosting | Vercel |
| Version Control | Git, GitHub |

---

# 📂 설치 및 실행 방법

> 배포된 서비스를 이용할 경우 설치는 불필요합니다.  
> 개발 환경에서 실행하고 싶다면 아래를 참고해주세요.

```bash
# 1. 저장소 클론
git clone <https://github.com/your-repo/h1-trip.git>

# 2. 패키지 설치
npm install

# 3. 환경변수 설정 (.env)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TOUR_API_KEY=

# 4. 개발 서버 실행
npm run dev

```

---
# 👥 `h1` 멤버
<table>
  <tr>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/159546380?v=4" width="150" height="150" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/99888873?v=4" width="150" height="150" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/163832764?v=4" width="150" height="150" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/217855017?v=4" width="150" height="150" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/217855127?v=4" width="150" height="150" /></td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/119219808?v=4" width="150" height="150" /></td>
  </tr>
  <tr>
    <td align="center"><b>이승원</b></td>
    <td align="center"><b>심수민</b></td>
    <td align="center"><b>윤주찬</b></td>
    <td align="center"><b>박태희</b></td>
    <td align="center"><b>김지윤</b></td>
    <td align="center"><b>김은주</b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/dvlplee">@dvlplee16</a></td>
    <td align="center"><a href="https://github.com/SWWWin">@SWWWin</a></td>
    <td align="center"><a href="https://github.com/jjuchan">@jjuchan</a></td>
    <td align="center"><a href="https://github.com/Tahee-Park">@Tahee-Park</a></td>
    <td align="center"><a href="https://github.com/jiyoon-00">@jiyoon-00</a></td>
    <td align="center"><a href="https://github.com/kku1403">@kku1403</a></td>
  </tr>
  <tr>
    <td align="center">🧠 팀장 / 프로젝트 총괄, 발표</td>
    <td align="center">🔐 인증 및 로그인 구현</td>
    <td align="center">🗺️ 여행지 추천 알고리즘</td>
    <td align="center">📆 여행 일정 기능 개발</td>
    <td align="center">✍️ 후기 기능 개발</td>
    <td align="center">🌄 이미지 업로드 및 커버 설정</td>
  </tr>
</table>

