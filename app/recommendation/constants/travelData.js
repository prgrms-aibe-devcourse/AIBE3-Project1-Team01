export const AREA_COORDS = {
  1: { mapX: 126.9779692, mapY: 37.566535 }, // 서울
  2: { mapX: 126.705206, mapY: 37.456256 }, // 인천
  3: { mapX: 127.3845475, mapY: 36.3504119 }, // 대전
  4: { mapX: 128.601445, mapY: 35.871435 }, // 대구
  5: { mapX: 126.851338, mapY: 35.159545 }, // 광주
  6: { mapX: 129.0750222, mapY: 35.1795543 }, // 부산
  7: { mapX: 129.31136, mapY: 35.538377 }, // 울산
  8: { mapX: 127.289034, mapY: 36.480351 }, // 세종
  31: { mapX: 127.5183, mapY: 37.4138 }, // 경기
  32: { mapX: 128.1555, mapY: 37.8228 }, // 강원
  33: { mapX: 127.4914, mapY: 36.6358 }, // 충북
  34: { mapX: 126.8044, mapY: 36.5184 }, // 충남
  35: { mapX: 127.1088, mapY: 35.8202 }, // 전북
  36: { mapX: 126.4636, mapY: 34.8161 }, // 전남
  37: { mapX: 128.5056, mapY: 36.576 }, // 경북
  38: { mapX: 128.6957, mapY: 35.2383 }, // 경남
  39: { mapX: 126.5312, mapY: 33.4996 }, // 제주
};

export const AREA_CODES = [
  { name: "서울", code: 1 },
  { name: "부산", code: 6 },
  { name: "대구", code: 4 },
  { name: "인천", code: 2 },
  { name: "광주", code: 5 },
  { name: "대전", code: 3 },
  { name: "울산", code: 7 },
  { name: "세종", code: 8 },
  { name: "경기", code: 31 },
  { name: "강원", code: 32 },
  { name: "충북", code: 33 },
  { name: "충남", code: 34 },
  { name: "전북", code: 35 },
  { name: "전남", code: 36 },
  { name: "경북", code: 37 },
  { name: "경남", code: 38 },
  { name: "제주", code: 39 },
];

export const CATEGORIES = [
  { name: "관광지", id: 12 },
  { name: "숙박", id: 32 },
  { name: "음식점", id: 39 },
  { name: "축제/행사", id: 15 },
  { name: "레포츠", id: 28 },
  { name: "쇼핑", id: 38 },
  { name: "문화시설", id: 14 },
];

export const SUBCATEGORIES = {
  12: [
    { name: "자연관광지", code: "A01" },
    { name: "산", code: "A0101" },
    { name: "계곡", code: "A0102" },
    { name: "폭포", code: "A0103" },
    { name: "문화관광지", code: "A02" },
    { name: "유적지", code: "A0201" },
    { name: "박물관/미술관", code: "A0202" },
  ],
  32: [
    { name: "호텔", code: "B0201" },
    { name: "콘도/리조트", code: "B0202" },
    { name: "모텔", code: "B0203" },
  ],
  39: [
    { name: "한식", code: "C0101" },
    { name: "중식", code: "C0102" },
    { name: "일식", code: "C0103" },
  ],
};
