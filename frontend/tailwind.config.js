/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Đảm bảo Tailwind quét toàn bộ file trong src
  ],
  theme: {
    extend: {
      colors: {
        // Thêm các màu động cần thiết
        "custom-color": "#abcdef",
      },
    },
  },
  plugins: [],
};
