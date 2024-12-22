/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    //"./src/**/*.{js,jsx,ts,tsx}", // Đảm bảo Tailwind quét toàn bộ file trong src
    './src/Components/CategoryManager/**/*.{js,jsx}',
    './src/Components/CategoriesTab/**/*.{js,jsx}',
    './src/Components/GroupManager/**/*.{js,jsx}',
    './src/Components/GroupTab/**/*.{js,jsx}',
    './src/Components/PostsGrid/**/*.{js,jsx}',
    './src/Components/PostsTab/**/*.{js,jsx}',
    './src/Components/UsersTab/**/*.{js,jsx}',
    './src/Components/UsersTable/**/*.{js,jsx}',
    './src/Pages/AdminDashboard/**/*.{js,jsx}',

    // './Components/CategoryManager/**/*.{js,jsx}',
    // './Components/CategoriesTab/**/*.{js,jsx}',
    // './Components/GroupManager/**/*.{js,jsx}',
    // './Components/GroupTab/**/*.{js,jsx}',
    // './Components/PostsGrid/**/*.{js,jsx}',
    // './Components/PostsTab/**/*.{js,jsx}',
    // './Components/UsersTab/**/*.{js,jsx}',
    // './Components/UsersTable/**/*.{js,jsx}',
    // './Pages/AdminDashboard/**/*.{js,jsx}',
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
