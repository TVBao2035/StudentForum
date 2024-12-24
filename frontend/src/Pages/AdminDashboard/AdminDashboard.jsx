import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import UsersTab from "../../Components/UsersTab/UsersTab";
import PostsTab from "../../Components/PostsTab/PostsTab";
import CategoriesTab from "../../Components/CategoriesTab/CategoriesTab";
import GroupTab from "../../Components/GroupTab/GroupTab";
import './AdminDashboardStyle.scss';
import { useSelector } from "react-redux";
import Loading from "../../Components/Loading";
import timeOut from '../../Helpers/timeOut';
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const user = useSelector(state => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    if(!user.isAdmin){
      navigate('/');
      return;
    }
    runningLoading();
  }, [])

  const runningLoading = async () =>{
    await timeOut(5000);
    setLoading(false);
  }
  if(loading) return <Loading />
  return (
    <div className="Admin">
      <div className="tw-min-h-screen tw-bg-gray-100">
        <div className="tw-flex tw-space-x-4 tw-p-4 tw-bg-white tw-shadow-sm">
          <button
            onClick={() => setActiveTab("users")}
            className={`tw-px-4 tw-py-2 tw-rounded ${activeTab === "users" ? "tw-bg-indigo-600 tw-text-white" : "tw-bg-gray-200"
              }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`tw-px-4 tw-py-2 tw-rounded ${activeTab === "posts" ? "tw-bg-indigo-600 tw-text-white" : "tw-bg-gray-200"
              }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`tw-px-4 tw-py-2 tw-rounded ${activeTab === "categories"
              ? "tw-bg-indigo-600 tw-text-white"
              : "tw-bg-gray-200"
              }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`tw-px-4 tw-py-2 tw-rounded ${activeTab === "groups" ? "tw-bg-indigo-600 tw-text-white" : "tw-bg-gray-200"
              }`}
          >
            Groups
          </button>
          <Link
            to="/"
            className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-semibold tw-py-2.5 tw-px-6 tw-rounded-lg tw-transition-all tw-duration-300 tw-shadow-lg hover:tw-shadow-xl tw-transform hover:-tw-translate-y-1 active:tw-translate-y-0 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 focus:tw-ring-opacity-50"
            aria-label="Navigate back to home page"
          >
            <IoArrowBack className="tw-text-xl" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="tw-p-4">
          {activeTab === "users" && <UsersTab />}
          {activeTab === "posts" && <PostsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "groups" && <GroupTab />}
        </div>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from "react";
// import { FiPlus, FiSearch } from "react-icons/fi";
// import Swal from "sweetalert2";
// import Modal from "react-modal";
// import UsersTable from "../../Components/UsersTable/UsersTable";
// import PostsGrid from "../../Components/PostsGrid/PostsGrid";
// import CategoryManager from "../../Components/CategoryManager/CategoryManager";
// import {
//   deleteCategory,
//   deletePost,
//   deleteUser,
//   getAllCategory,
//   getAllPost,
//   getAllUser,
//   updateCategory,
//   updatePost,
//   updateUser,
// } from "../../API/AdminAPI";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("users");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Modal states
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     avatar: "",
//   });

//   const [selectedPost, setSelectedPost] = useState(null);
//   const [postData, setPostData] = useState({
//     categoryId: "",
//     content: "",
//     image: "",
//   });

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryName, setCategoryName] = useState("");

//   const availableColors = [
//     "bg-blue-500",
//     "bg-green-500",
//     "bg-yellow-500",
//     "bg-red-500",
//   ];

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const [usersRespone, postsRespone, categoriesRespone] = await Promise.all([
//         getAllUser(),
//         getAllPost(),
//         getAllCategory(),
//       ]);

//       const updatedCategories = categoriesRespone.data.map((category) => ({
//         ...category,
//         color:
//           category.color ||
//           availableColors[Math.floor(Math.random() * availableColors.length)],
//       }));

//       setUsers(usersRespone.data);
//       setPosts(postsRespone.data);
//       setCategories(updatedCategories);
//     } catch (err) {
//       setError("Failed to load data. Please try again later.");
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // User Modal Handlers
//   const handleEditUser = (userId) => {
//     const userToEdit = users.find((user) => user.id === userId);
//     setSelectedUser(userToEdit);

//     setUserData({
//       name: userToEdit.name,
//       email: userToEdit.email,
//       phone: userToEdit.phone,
//       avatar: userToEdit.avatar,
//     });

//     setIsUserModalOpen(true);
//   };

//   const handleSaveEditUser = async () => {
//     try {
//       const respone = await updateUser({ userData, userId: selectedUser.id });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === selectedUser.id ? { ...user, ...userData } : user
//           )
//         );
//         setIsUserModalOpen(false);
//         setSelectedUser(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         setIsUserModalOpen(false);
//       }
//     } catch (error) {
//       setError("Failed to update user!");
//     }
//   };

//   // Post Modal Handlers
//   const handleEditPost = (postId) => {
//     const postToEdit = posts.find((post) => post.id === postId);
//     setSelectedPost(postToEdit);

//     setPostData({
//       categoryId: postToEdit.categoryId,
//       content: postToEdit.content,
//       image: postToEdit.image,
//     });

//     setIsPostModalOpen(true);
//   };

//   const handleSaveEditPost = async () => {
//     try {
//       const respone = await updatePost({ postData, postId: selectedPost.id });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//         // setPosts((prevPosts) =>
//         //   prevPosts.map((post) =>
//         //     post.id === selectedPost.id ? { ...post, ...postData } : post
//         //   )
//         // );
//         setIsPostModalOpen(false);
//         setSelectedPost(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật bài viết thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setIsPostModalOpen(false);
//       }
//     } catch (error) {
//       setError("Failed to update post!");
//     }
//   };

//   const handleEditCategory = (categoryId) => {
//     const categoryToEdit = categories.find((category) => category.id === categoryId);
//     setSelectedCategory(categoryToEdit);
//     setCategoryName(categoryToEdit.name);
//     setIsCategoryModalOpen(true);
//   };

//   const handleSaveEditCategory = async () => {
//     try {
//       const respone = await updateCategory({
//         categoryId: selectedCategory.id,
//         name: categoryName,
//       });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setCategories((prevCategories) =>
//           prevCategories.map((category) =>
//             category.id === selectedCategory.id
//               ? { ...category, name: categoryName }
//               : category
//           )
//         );

//         setIsCategoryModalOpen(false);
//         setSelectedCategory(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật danh mục thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//       }
//     } catch (error) {
//       setError("Failed to update category!");
//       console.error("Error updating category:", error);
//     }
//   };

//   const closeModal = () => {
//     setIsUserModalOpen(false);
//     setIsPostModalOpen(false);
//     setSelectedUser(null);
//     setSelectedPost(null);
//   };

//   // Delete Handlers
//   const handleDeleteUser = async (userId) => {
//     try {
//       const respone = await deleteUser(userId);
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//       }
//     } catch (error) {
//       setError("Failed to delete user!");
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       const respone = await deletePost(postId);
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//       }
//     } catch (error) {
//       setError("Failed to delete post!");
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     try {
//       const respone = await deleteCategory(categoryId);
//       if ( respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setCategories((prevCategories) =>
//           prevCategories.filter((category) => category.id !== categoryId)
//         );
//       }
//     } catch (error) {
//       setError("Failed to delete category!");
//       console.error("Error deleting category:", error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Admin Dashboard
//           </h1>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//             <button
//               className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center">
//               <FiPlus className="mr-2" /> Add New
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//             <nav className="-mb-px flex">
//               {["users", "posts", "categories"].map((tab, index) => (
//                 <button
//                   key={`tab-${index}`}
//                   onClick={() => setActiveTab(tab)}
//                   className={`${
//                     activeTab === tab
//                       ? "border-indigo-500 text-indigo-600 bg-white"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   } whitespace-nowrap py-4 px-8 border-b-2 font-medium text-sm capitalize transition duration-150`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-8">
//             {activeTab === "users" && (
//               <UsersTable
//                 users={users}
//                 onEdit={handleEditUser}
//                 onDelete={handleDeleteUser}
//               />
//             )}
//             <Modal
//               isOpen={isUserModalOpen}
//               onRequestClose={closeModal}
//               contentLabel="Edit User"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     value={userData.name}
//                     onChange={(e) =>
//                       setUserData({ ...userData, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={userData.email}
//                     onChange={(e) =>
//                       setUserData({ ...userData, email: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Phone"
//                     value={userData.phone}
//                     onChange={(e) =>
//                       setUserData({ ...userData, phone: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Avatar URL"
//                     value={userData.avatar}
//                     onChange={(e) =>
//                       setUserData({ ...userData, avatar: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditUser}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>

//             {activeTab === "posts" && (
//               <PostsGrid
//                 posts={posts}
//                 users={users}
//                 categories={categories}
//                 onEdit={handleEditPost}
//                 onDelete={handleDeletePost}
//               />
//             )}
//             <Modal
//               isOpen={isPostModalOpen}
//               onRequestClose={closeModal}
//               contentLabel="Edit Post"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit Post</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <select
//                     value={postData.categoryId}
//                     onChange={(e) =>
//                       setPostData({ ...postData, categoryId: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                   <textarea
//                     placeholder="Content"
//                     value={postData.content}
//                     onChange={(e) =>
//                       setPostData({ ...postData, content: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   ></textarea>
//                   <input
//                     type="text"
//                     placeholder="Image URL"
//                     value={postData.image}
//                     onChange={(e) =>
//                       setPostData({ ...postData, image: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditPost}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>

//             {activeTab === "categories" && (
//               <CategoryManager
//                 categories={categories}
//                 setCategories={setCategories}
//                 onEdit={handleEditCategory}
//                 onDelete={handleDeleteCategory}
//               />
//             )}
//             <Modal
//               isOpen={isCategoryModalOpen}
//               onRequestClose={() => setIsCategoryModalOpen(false)}
//               contentLabel="Edit Category"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit Category</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Category Name"
//                     value={categoryName}
//                     onChange={(e) => setCategoryName(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={() => setIsCategoryModalOpen(false)}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditCategory}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { FiPlus, FiSearch } from "react-icons/fi";
// import Swal from "sweetalert2";
// import Modal from "react-modal";
// import UsersTable from "../../Components/UsersTable/UsersTable";
// import PostsGrid from "../../Components/PostsGrid/PostsGrid";
// import CategoryManager from "../../Components/CategoryManager/CategoryManager";
// import {
//   deleteCategory,
//   deletePost,
//   deleteUser,
//   getAllCategory,
//   getAllPost,
//   getAllUser,
//   updateCategory,
//   updatePost,
//   updateUser,
// } from "../../API/AdminAPI";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("users");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Modal states
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
//   const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     avatar: "",
//   });

//   const [selectedPost, setSelectedPost] = useState(null);
//   const [postData, setPostData] = useState({
//     categoryId: "",
//     content: "",
//     image: "",
//   });

//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [categoryName, setCategoryName] = useState("");

//   const availableColors = [
//     "bg-blue-500",
//     "bg-green-500",
//     "bg-yellow-500",
//     "bg-red-500",
//   ];

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const [usersRespone, postsRespone, categoriesRespone] = await Promise.all([
//         getAllUser(),
//         getAllPost(),
//         getAllCategory(),
//       ]);

//       const updatedCategories = categoriesRespone.data.map((category) => ({
//         ...category,
//         color:
//           category.color ||
//           availableColors[Math.floor(Math.random() * availableColors.length)],
//       }));

//       setUsers(usersRespone.data);
//       setPosts(postsRespone.data);
//       setCategories(updatedCategories);
//     } catch (err) {
//       setError("Failed to load data. Please try again later.");
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // User Modal Handlers
//   const handleEditUser = (userId) => {
//     const userToEdit = users.find((user) => user.id === userId);
//     setSelectedUser(userToEdit);

//     setUserData({
//       name: userToEdit.name,
//       email: userToEdit.email,
//       phone: userToEdit.phone,
//       avatar: userToEdit.avatar,
//     });

//     setIsUserModalOpen(true);
//   };

//   const handleSaveEditUser = async () => {
//     try {
//       const respone = await updateUser({ userData, userId: selectedUser.id });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === selectedUser.id ? { ...user, ...userData } : user
//           )
//         );
//         setIsUserModalOpen(false);
//         setSelectedUser(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         setIsUserModalOpen(false);
//       }
//     } catch (error) {
//       setError("Failed to update user!");
//     }
//   };

//   // Post Modal Handlers
//   const handleEditPost = (postId) => {
//     const postToEdit = posts.find((post) => post.id === postId);
//     setSelectedPost(postToEdit);

//     setPostData({
//       categoryId: postToEdit.categoryId,
//       content: postToEdit.content,
//       image: postToEdit.image,
//     });

//     setIsPostModalOpen(true);
//   };

//   const handleSaveEditPost = async () => {
//     try {
//       const respone = await updatePost({ postData, postId: selectedPost.id });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//         // setPosts((prevPosts) =>
//         //   prevPosts.map((post) =>
//         //     post.id === selectedPost.id ? { ...post, ...postData } : post
//         //   )
//         // );
//         setIsPostModalOpen(false);
//         setSelectedPost(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật bài viết thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setIsPostModalOpen(false);
//       }
//     } catch (error) {
//       setError("Failed to update post!");
//     }
//   };

//   const handleEditCategory = (categoryId) => {
//     const categoryToEdit = categories.find((category) => category.id === categoryId);
//     setSelectedCategory(categoryToEdit);
//     setCategoryName(categoryToEdit.name);
//     setIsCategoryModalOpen(true);
//   };

//   const handleSaveEditCategory = async () => {
//     try {
//       const respone = await updateCategory({
//         categoryId: selectedCategory.id,
//         name: categoryName,
//       });
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setCategories((prevCategories) =>
//           prevCategories.map((category) =>
//             category.id === selectedCategory.id
//               ? { ...category, name: categoryName }
//               : category
//           )
//         );

//         setIsCategoryModalOpen(false);
//         setSelectedCategory(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật danh mục thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//       }
//     } catch (error) {
//       setError("Failed to update category!");
//       console.error("Error updating category:", error);
//     }
//   };

//   const closeModal = () => {
//     setIsUserModalOpen(false);
//     setIsPostModalOpen(false);
//     setSelectedUser(null);
//     setSelectedPost(null);
//   };

//   // Delete Handlers
//   const handleDeleteUser = async (userId) => {
//     try {
//       const respone = await deleteUser(userId);
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//       }
//     } catch (error) {
//       setError("Failed to delete user!");
//     }
//   };

//   const handleDeletePost = async (postId) => {
//     try {
//       const respone = await deletePost(postId);
//       if (respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         await fetchData();
//       }
//     } catch (error) {
//       setError("Failed to delete post!");
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     try {
//       const respone = await deleteCategory(categoryId);
//       if ( respone.status === 200) {
//         Swal.fire({
//           title: respone.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setCategories((prevCategories) =>
//           prevCategories.filter((category) => category.id !== categoryId)
//         );
//       }
//     } catch (error) {
//       setError("Failed to delete category!");
//       console.error("Error deleting category:", error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Admin Dashboard
//           </h1>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//             <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center">
//               <FiPlus className="mr-2" /> Add New
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//             <nav className="-mb-px flex">
//               {["users", "posts", "categories"].map((tab, index) => (
//                 <button
//                   key={`tab-${index}`}
//                   onClick={() => setActiveTab(tab)}
//                   className={`${
//                     activeTab === tab
//                       ? "border-indigo-500 text-indigo-600 bg-white"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   } whitespace-nowrap py-4 px-8 border-b-2 font-medium text-sm capitalize transition duration-150`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-8">
//             {activeTab === "users" && (
//               <UsersTable
//                 users={users}
//                 onEdit={handleEditUser}
//                 onDelete={handleDeleteUser}
//               />
//             )}
//             <Modal
//               isOpen={isUserModalOpen}
//               onRequestClose={closeModal}
//               contentLabel="Edit User"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     value={userData.name}
//                     onChange={(e) =>
//                       setUserData({ ...userData, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={userData.email}
//                     onChange={(e) =>
//                       setUserData({ ...userData, email: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Phone"
//                     value={userData.phone}
//                     onChange={(e) =>
//                       setUserData({ ...userData, phone: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Avatar URL"
//                     value={userData.avatar}
//                     onChange={(e) =>
//                       setUserData({ ...userData, avatar: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditUser}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>

//             {activeTab === "posts" && (
//               <PostsGrid
//                 posts={posts}
//                 users={users}
//                 categories={categories}
//                 onEdit={handleEditPost}
//                 onDelete={handleDeletePost}
//               />
//             )}
//             <Modal
//               isOpen={isPostModalOpen}
//               onRequestClose={closeModal}
//               contentLabel="Edit Post"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit Post</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <select
//                     value={postData.categoryId}
//                     onChange={(e) =>
//                       setPostData({ ...postData, categoryId: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   >
//                     <option value="">Select Category</option>
//                     {categories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                   <textarea
//                     placeholder="Content"
//                     value={postData.content}
//                     onChange={(e) =>
//                       setPostData({ ...postData, content: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   ></textarea>
//                   <input
//                     type="text"
//                     placeholder="Image URL"
//                     value={postData.image}
//                     onChange={(e) =>
//                       setPostData({ ...postData, image: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditPost}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>

//             {activeTab === "categories" && (
//               <CategoryManager
//                 categories={categories}
//                 setCategories={setCategories}
//                 onEdit={handleEditCategory}
//                 onDelete={handleDeleteCategory}
//               />
//             )}
//             <Modal
//               isOpen={isCategoryModalOpen}
//               onRequestClose={() => setIsCategoryModalOpen(false)}
//               contentLabel="Edit Category"
//               appElement={document.getElementById("root")}
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">Edit Category</h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Category Name"
//                     value={categoryName}
//                     onChange={(e) => setCategoryName(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={() => setIsCategoryModalOpen(false)}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveEditCategory}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </Modal>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { FiPlus, FiSearch } from "react-icons/fi";
// import Swal from "sweetalert2";
// import Modal from "react-modal";
// import UsersTable from "../../Components/UsersTable/UsersTable";
// import PostsGrid from "../../Components/PostsGrid/PostsGrid";
// import CategoryManager from "../../Components/CategoryManager/CategoryManager";
// import { deleteUser, getAllCategory, getAllPost, getAllUser, updateUser } from "../../API/AdminAPI";

// Modal.setAppElement("#root");

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("users");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState({ name: "", email: "", phone: "", avatar: "" });

//   const availableColors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const [usersRespone, postsRespone, categoriesRespone] = await Promise.all([
//         getAllUser(),
//         getAllPost(),
//         getAllCategory(),
//       ]);

//       const updatedCategories = categoriesRespone.data.map((category) => ({
//         ...category,
//         color: category.color || availableColors[Math.floor(Math.random() * availableColors.length)],
//       }));

//       setUsers(usersRespone.data);
//       setPosts(postsRespone.data);
//       setCategories(updatedCategories);
//     } catch (err) {
//       setError("Failed to load data. Please try again later.");
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleEditUser = (userId) => {
//     const userToEdit = users.find((user) => user.id === userId);
//     setSelectedUser(userToEdit);

//     setUserData({
//       name: userToEdit.name,
//       email: userToEdit.email,
//       phone: userToEdit.phone,
//       avatar: userToEdit.avatar,
//     });

//     setIsModalOpen(true);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const response = await updateUser({ userData, userId: selectedUser.id });
//       if (response.status === 200) {
//         Swal.fire({
//           title: response.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user.id === selectedUser.id ? { ...user, ...userData } : user
//           )
//         );
//         setIsModalOpen(false);
//         setSelectedUser(null);
//       } else {
//         Swal.fire({
//           title: "Cập nhật thất bại! Vui lòng thử lại!",
//           icon: "error",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });
//         setIsModalOpen(false);
//       }
//     } catch (error) {
//       setError("Failed to update user!");
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       const response = await deleteUser(userId);
//       if (response.status === 200) {
//         Swal.fire({
//           title: response.message,
//           icon: "success",
//           toast: true,
//           position: "top-end",
//           timerProgressBar: true,
//           showConfirmButton: false,
//           timer: 3000,
//         });

//         setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
//       }
//     } catch (error) {
//       setError("Failed to delete user!");
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Đang tải dữ liệu...</div>;
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8 flex justify-between items-center">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
//           </h1>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm..."
//                 className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             </div>
//             <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center">
//               <FiPlus className="mr-2" /> Thêm mới
//             </button>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
//             <nav className="-mb-px flex">
//               {["users", "posts", "categories"].map((tab, index) => (
//                 <button
//                   key={`tab-${index}`}
//                   onClick={() => setActiveTab(tab)}
//                   className={`${
//                     activeTab === tab
//                       ? "border-indigo-500 text-indigo-600 bg-white"
//                       : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                   } whitespace-nowrap py-4 px-8 border-b-2 font-medium text-sm capitalize transition duration-150`}
//                 >
//                   {tab}
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-8">
//             {activeTab === "users" && (
//               <UsersTable
//                 users={users}
//                 onEdit={handleEditUser}
//                 onDelete={handleDeleteUser}
//               />
//             )}
//             <Modal
//               isOpen={isModalOpen}
//               onRequestClose={closeModal}
//               contentLabel="Chỉnh sửa người dùng"
//               className="fixed inset-0 flex items-center justify-center z-50"
//               overlayClassName="fixed inset-0 bg-black bg-opacity-50"
//             >
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
//                 <div className="px-6 py-4 border-b">
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     Chỉnh sửa người dùng
//                   </h2>
//                 </div>
//                 <div className="px-6 py-4 space-y-4">
//                   <input
//                     type="text"
//                     placeholder="Tên"
//                     value={userData.name}
//                     onChange={(e) =>
//                       setUserData({ ...userData, name: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={userData.email}
//                     onChange={(e) =>
//                       setUserData({ ...userData, email: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Số điện thoại"
//                     value={userData.phone}
//                     onChange={(e) =>
//                       setUserData({ ...userData, phone: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                   <input
//                     type="text"
//                     placeholder="URL Ảnh đại diện"
//                     value={userData.avatar}
//                     onChange={(e) =>
//                       setUserData({ ...userData, avatar: e.target.value })
//                     }
//                     className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                   />
//                 </div>
//                 <div className="px-6 py-4 border-t flex justify-end space-x-4">
//                   <button
//                     onClick={closeModal}
//                     className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Hủy
//                   </button>
//                   <button
//                     onClick={handleSaveEdit}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//                   >
//                     Lưu thay đổi
//                   </button>
//                 </div>
//               </div>
//             </Modal>
//             {activeTab === "posts" && (
//               <PostsGrid
//                 posts={posts}
//                 users={users}
//                 categories={categories}
//               />
//             )}
//             {activeTab === "categories" && (
//               <CategoryManager
//                 categories={categories}
//                 setCategories={setCategories}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
