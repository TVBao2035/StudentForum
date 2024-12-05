import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { Editor } from "@tinymce/tinymce-react";
import PostsGrid from "../PostsGrid";
import { FiPlus, FiSearch } from "react-icons/fi";
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Add New Post</h3>

              <select
                value={newPost.userId}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    userId: parseInt(e.target.value, 10),
                  })
                }
                className="w-full p-2 border rounded mb-2"
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
                className="w-full p-2 border rounded mb-2"
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
                className="w-full p-2 border rounded mb-2"
              />

              <textarea
                placeholder="Content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
                rows="4"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={newPost.image || ""}
                onChange={(e) =>
                  setNewPost({ ...newPost, image: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPost}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
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
        import {Editor} from "@tinymce/tinymce-react";
        <Modal
          isOpen={isPostModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Post"
          appElement={document.getElementById("root")}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Edit Post</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <select
                value={postData.categoryId}
                onChange={(e) =>
                  setPostData({ ...postData, categoryId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                  height: 300,
                  menubar: false,
                  plugins: [],
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
              />

              <input
                type="text"
                placeholder="Image URL"
                value={postData.image}
                onChange={(e) =>
                  setPostData({ ...postData, image: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="px-6 py-4 border-t flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPost}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </Modal>
        ;
      </div>
    </div>
  );
}
