/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
 //   "./src/**/*.{js,jsx,ts,tsx}", // Đảm bảo Tailwind quét toàn bộ file trong src
    './Components/CategoryManager/**/*.{js,jsx}',
    './Components/CategoriesTab/**/*.{js,jsx}',
    './Components/GroupManager/**/*.{js,jsx}',
    './Components/GroupTab/**/*.{js,jsx}',
    './Components/PostsGrid/**/*.{js,jsx}',
    './Components/PostsTab/**/*.{js,jsx}',
    './Components/UsersTab/**/*.{js,jsx}',
    './Components/UsersTable/**/*.{js,jsx}',
    './Pages/AdminDashboard/**/*.{js,jsx}',
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
