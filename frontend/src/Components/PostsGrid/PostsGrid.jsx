import React, { useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaHeart,
  FaComment,
  FaTimes,
} from "react-icons/fa";

export default function PostsGrid({
  posts,
  users,
  categories,
  onEdit,
  onDelete,
}) {
  const [selectedPost, setSelectedPost] = useState(null);

  const InforPost = (posts || []).map((post) => {
    const user = (users || []).find((u) => u.id === post.userId);
    const category = (categories || []).find(
      (cate) => cate.id === post.categoryId
    );
    return {
      ...post,
      postName: user?.name || "UserName Post",
      avatar: user?.avatar || "Avatar User",
      postCategory: category?.name || "Category Post",
    };
  });

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg border border-gray-100">
      <div className="relative h-40">
        <img
          src={post.image}
          alt="Post Thumbnail"
          className="w-full h-[170px] object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
            {post.postCategory}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={post.avatar}
            alt="User Thumbnail"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
            }}
          />
          <div className="text-sm">
            <p className="font-medium text-gray-800">{post.postName}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <p
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{
            __html: post.content.slice(0, 100) + "...",
          }}
        ></p>
        {/* <p className="text-gray-700 text-sm mb-4">{post.content.slice(0, 100)}...</p> */}

        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-pink-600">
              <FaHeart className="text-sm" />
              <span className="text-xs">{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <FaComment className="text-sm" />
              <span className="text-xs">{post.comments}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPost(post)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition duration-300"
              aria-label="View details"
            >
              <FaEye className="text-sm" />
            </button>
            <button
              onClick={() => onEdit && onEdit(post.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition duration-300"
              aria-label="Edit post"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={() => onDelete && onDelete(post.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-300"
              aria-label="Delete post"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = ({ post, onClose }) => (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition duration-300"
              aria-label="Close modal"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
          <img
            src={post.image}
            alt="Post"
            className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
          />
          <p
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
          {/* <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p> */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {InforPost.length === 0 ? (
          <div className="text-center text-gray-500">
            Không có bài viết nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {InforPost.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {selectedPost && (
          <Modal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </div>
    </div>
  );
}
