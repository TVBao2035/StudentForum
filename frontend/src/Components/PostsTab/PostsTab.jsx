import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { Editor } from "@tinymce/tinymce-react";
import PostsGrid from "../PostsGrid";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import {
  getAllUser,
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  getAllCategory,
} from "../../API/AdminAPI";

export default function PostsTab() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    userId: "",
    groupId: null,
    categoryId: "",
    content: "",
    image: "",
  });

  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postData, setPostData] = useState({
    categoryId: "",
    content: "",
    image: "",
  });

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAllPost();
      setPosts(response.data);
    } catch (err) {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const respone = await getAllUser();
      setUsers(respone.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const respone = await getAllCategory();
      setCategories(respone.data);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fetchCategories();
  }, []);

  const handleAddPost = async () => {
    if (!newPost.userId || !newPost.categoryId || !newPost.content) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await createPost(newPost);
      if (response.status === 200) {
        Swal.fire("Success", "Post added successfully!", "success");
        await fetchPosts();
        //setPosts((prev) => [...prev, response.data]);
        setIsAdding(false);
        setNewPost({
          userId: "",
          groupId: null,
          categoryId: "",
          content: "",
          image: "",
        });
      } else {
        Swal.fire("Error", "Failed to add post. Please try again.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add post.", "error");
    }
  };

  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setSelectedPost(postToEdit);

    setPostData({
      categoryId: postToEdit.categoryId,
      content: postToEdit.content,
      image: postToEdit.image,
    });

    setIsPostModalOpen(true);
  };

  const handleSaveEditPost = async () => {
    try {
      const respone = await updatePost({ postData, postId: selectedPost.id });
      if (respone.status === 200) {
        Swal.fire({
          title: respone.message,
          icon: "success",
          toast: true,
          position: "top-end",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
        });

        await fetchPosts();
        // setPosts((prevPosts) =>
        //   prevPosts.map((post) =>
        //     post.id === selectedPost.id ? { ...post, ...postData } : post
        //   )
        // );
        setIsPostModalOpen(false);
        setSelectedPost(null);
      } else {
        Swal.fire({
          title: "Cập nhật bài viết thất bại! Vui lòng thử lại!",
          icon: "error",
          toast: true,
          position: "top-end",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
        });

        setIsPostModalOpen(false);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update post.", "error");
    }
  };

  const closeModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      Swal.fire("Deleted", "Post deleted successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete post.", "error");
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Post Manager
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                //value={searchQuery}
                //onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition duration-300 shadow-md flex items-center"
            >
              <FiPlus className="mr-2" /> Add New
            </button>
          </div>
        </div>
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-2xl shadow-xl w-[36rem] max-h-[90vh] overflow-auto">
              <button
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none"
              >
                <FiX className="text-white" size={20} />
              </button>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800 border-b pb-4">
                Add New Post
              </h3>

              <select
                value={newPost.userId}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    userId: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <select
                value={newPost.categoryId}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    categoryId: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Group ID"
                value={newPost.groupId || ""}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    groupId: e.target.value
                      ? parseInt(e.target.value, 10)
                      : null,
                  })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <textarea
                placeholder="Content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                rows="3"
              ></textarea>

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">
                  Post Image:
                </label>
                <div className="flex flex-col items-center">
                  {newPost.image ? (
                    <img
                      src={newPost.image}
                      alt="Post Thumbnail"
                      className="w-28 h-28 rounded-full object-cover shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="postImageInput"
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-5 py-2 rounded-full cursor-pointer"
                  >
                    Change
                  </label>
                  <input
                    id="postImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setNewPost({ ...newPost, image: reader.result });
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-6 pt-4 border-t">
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-200 hover:bg-gray-300 transition px-6 py-2 rounded-full text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPost}
                  className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-full font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        <PostsGrid
          posts={posts}
          users={users}
          categories={categories}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
        />

        <Modal
          isOpen={isPostModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Post"
          appElement={document.getElementById("root")}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-[40rem]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none"
            >
              <FiX className="text-white" size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
              Edit Post
            </h3>

            <select
              value={postData.categoryId}
              onChange={(e) =>
                setPostData({ ...postData, categoryId: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <Editor
              apiKey="c71zurgnk0wg3iv3upi49j8zotrzy0chhq2evkxb69yca39g"
              value={postData.content}
              onEditorChange={(content) =>
                setPostData({ ...postData, content })
              }
              init={{
                height: 180,
                menubar: false,
                plugins: [],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
            />

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Post Image:
              </label>
              <div className="flex flex-col items-center">
                {postData.image ? (
                  <img
                    src={postData.image}
                    alt=""
                    className="w-28 h-28 rounded-full object-cover shadow-lg mb-3"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="postImageInput"
                  className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-5 py-2 rounded-full cursor-pointer"
                >
                  Change
                </label>
                <input
                  id="postImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setPostData({ ...postData, image: reader.result });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-6 pt-4 border-t">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 transition px-6 py-2 rounded-full text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPost}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-full font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
