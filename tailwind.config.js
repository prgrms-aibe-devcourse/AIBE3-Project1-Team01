/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 고객님께서 정의하신 색상 팔레트 추가
        "my-aqua": "#C9E6E5", // 아쿠아 블루 계열 (서브 배경, 구분선 등)
        "my-off-white": "#F6EFEF", // 아주 연한 분홍/회색 계열 (메인 배경, 카드 배경 등)
        "my-peach": "#FBDED6", // 피치/살구색 계열 (특정 섹션 배경, 정보 블록 강조 등)
        "my-coral": "#F4CCC4", // 연한 산호색/코랄 계열 (버튼, 링크, 헤더/푸터 배경 등)
        "my-dark-gray": "#413D3D", // 진한 회색/검정 계열 (본문/제목 텍스트, 푸터 배경 등)
      },
    },
  },
  plugins: [],
};
