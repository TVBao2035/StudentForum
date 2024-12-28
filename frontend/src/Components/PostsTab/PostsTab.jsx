import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useSelector } from "react-redux";
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
import apiUploadImage from "../../Hooks/apiUploadImage";
import { useDebounce } from "../../Hooks";
import Loading from "../Loading";
import swalApp from "../../Helpers/swalApp";


var formData = new FormData();


export default function PostsTab() {
  const [search, setSearch] = useState("");
  const userId = useSelector((state) => state.user.id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [newPost, setNewPost] = useState({
    userId: userId || null,
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
  const inputRef = useRef(null);
  const searchValue = useDebounce(search, 800);

  const fetchPosts = async (search="") => {
    setLoading(true);
    try {
      const response = await getAllPost(search);
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

  useEffect(()=>{
    if(searchValue.trim().length === 0) {
      fetchPosts();
      return;
    }
    fetchPosts(searchValue);
    
  }, [searchValue])

  useEffect(()=>{
    inputRef.current?.focus();
  }, [posts]);

  const handleUpload = async (event, setData) => {
    formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
    formData.append("asset_folder", "StudentForum");
    setIsChangeImage(true);
    setData((pre) => {
      return {
        ...pre,
        image: URL.createObjectURL(event.target.files[0])
      }
    })
  }
  {/* EDIT UPLOAD IMAGE */ }
  const handleAddPost = async () => {
    if (!userId) {
      Swal.fire("Error", "UserId not found. Please login again!", "error");
      return;
    }

    if (!newPost.categoryId || !newPost.content) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      return;
    }
    if(isChangeImage){
      try {
        let res = await apiUploadImage(formData);
        newPost.image = res.data.url;
        setIsChangeImage(false);
      } catch (error) {
        swalApp("error", "Lỗi upload ảnh");
        return;
      }
        }

    try {

      const response = await createPost(newPost);
      if (response.status === 200) {
        Swal.fire("Success", "Post added successfully!", "success");
        await fetchPosts();
        //setPosts((prev) => [...prev, response.data]);
        setIsAdding(false);
        setNewPost({
          userId: userId,
          groupId: null,
          categoryId: "",
          content: "",
          image: "",
        });
      } else {
        Swal.fire("Error", "Failed to add post. Please try again.", "error");
      }
      setIsChangeImage(false);
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
    if(isChangeImage){
      try {
        let res = await apiUploadImage(formData);
        postData.image = res.data.url;
      } catch (error) {
        swalApp("error", "Lỗi upload ảnh");
        return;
      }
    }

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
        setIsPostModalOpen(false);
        setSelectedPost(null);
        setIsChangeImage(false);
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
    setIsChangeImage(false);
    setNewPost({
      userId: userId,
      groupId: null,
      categoryId: "",
      content: "",
      image: "",
    });
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

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>;

  return (
    
    <div style={{color: "black"}} className="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-100 tw-to-gray-200">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-mb-8 tw-flex tw-justify-between tw-items-center">
          <h1 className="tw-text-3xl tw-font-bold tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-bg-clip-text tw-text-transparent">
            Post Manager
          </h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <div className="tw-relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                ref={inputRef}
                onChange={(e) => setSearch(e.target.value)}
                className="tw-pl-10 tw-pr-4 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent tw-shadow-sm"
              //value={searchQuery}
              //onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-400" />
            </div>
            <button
              onClick={() => {
                setIsAdding(true);
                setNewPost((prev) => ({ ...prev, userId }));
              }}
              className="tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-opacity-90 tw-transition tw-duration-300 tw-shadow-md tw-flex tw-items-center"
            >
              <FiPlus className="tw-mr-2" /> Add New
            </button>
          </div>
        </div>
        {isAdding && (
          <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center tw-z-50">
            <div className="tw-relative tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-xl tw-w-[36rem] tw-max-h-[90vh] tw-overflow-auto">
              <button
                onClick={() => setIsAdding(false)}
                className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
              >
                <FiX className="tw-text-white" size={20} />
              </button>
              <h3 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-center tw-text-gray-800 tw-border-b tw-pb-4">
                Add New Post
              </h3>
              <select
                value={newPost.categoryId}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    categoryId: parseInt(e.target.value, 10),
                  })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
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
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />

              <textarea
                placeholder="Content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
                rows="3"
              ></textarea>

              <div className="tw-mb-4">
                <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                  Post Image:
                </label>
                <div className="tw-flex tw-flex-col tw-items-center">
                  {newPost.image ? (
                    <img
                      src={newPost.image}
                      alt="Post Thumbnail"
                      className="tw-w-28 tw-h-28 tw-rounded-full tw-object-cover tw-shadow-lg tw-mb-3"
                    />
                  ) : (
                    <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                      <span className="tw-text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="postImageInput"
                    className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-cursor-pointer"
                  >
                    Change
                  </label>
                  {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="postImageInput"
                    type="file"
                    accept="image/*"
                    className="tw-hidden"
                    onChange={(e) => handleUpload(e, setNewPost)}
                  />
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-space-x-6 tw-pt-4 tw-border-t">
                <button
                  onClick={() => setIsAdding(false)}
                  className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-6 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPost}
                  className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-font-semibold"
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
          className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50"
        >
          <div style={{ color: "black" }} className="tw-relative tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-2xl tw-w-[40rem]">
            <button
              onClick={closeModal}
              className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
            >
              <FiX className="tw-text-white" size={20} />
            </button>
            <h3 className="tw-text-xl tw-font-bold tw-mb-6 tw-text-center tw-text-gray-800 tw-border-b tw-pb-4">
              Edit Post
            </h3>

            <select
              value={postData.categoryId}
              onChange={(e) =>
                setPostData({ ...postData, categoryId: e.target.value })
              }
              className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
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

            <div className="tw-mb-6">
              <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                Post Image:
              </label>
              <div className="tw-flex tw-flex-col tw-items-center">
                {postData.image ? (
                  <img
                    src={postData.image}
                    alt=""
                    className="tw-w-28 tw-h-28 tw-rounded-full tw-object-cover tw-shadow-lg tw-mb-3"
                  />
                ) : (
                  <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                    <span className="tw-text-gray-400">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="postImageInput"
                  className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-cursor-pointer"
                >
                  Change
                </label>
                {/* EDIT UPLOAD IMAGE */}
                <input
                  id="postImageInput"
                  type="file"
                  accept="image/*"
                  className="tw-hidden"
                  onChange={(e) => handleUpload(e, setPostData)}
                />
              </div>
            </div>

            <div className="tw-flex tw-justify-center tw-space-x-6 tw-pt-4 tw-border-t">
              <button
                onClick={closeModal}
                className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-6 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditPost}
                className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-font-semibold"
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
