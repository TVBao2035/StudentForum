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
    <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-overflow-hidden tw-transform tw-transition tw-duration-300 hover:tw-scale-105 hover:tw-shadow-lg tw-border tw-border-gray-100">
      <div className="tw-relative tw-h-40">
        <img
          src={post.image}
          alt="Post Thumbnail"
          className="tw-w-full tw-h-[170px] tw-object-cover"
        />
        <div className="tw-absolute tw-top-2 tw-right-2">
          <span className="tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-font-semibold tw-text-white tw-bg-gradient-to-r tw-from-purple-600 tw-to-indigo-600 tw-rounded-full">
            {post.postCategory}
          </span>
        </div>
      </div>
      <div className="tw-p-4">
        <div className="tw-flex tw-items-center tw-space-x-2 tw-mb-2">
          <img
            src={post.avatar}
            alt="User Thumbnail"
            className="tw-w-8 tw-h-8 tw-rounded-full tw-object-cover tw-ring-2 tw-ring-gray-100"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e";
            }}
          />
          <div className="tw-text-sm">
            <p className="tw-font-medium tw-text-gray-800">{post.postName}</p>
            <p className="tw-text-xs tw-text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <p
          className="tw-text-gray-700 tw-text-sm mb-4"
          dangerouslySetInnerHTML={{
            __html: post.content.slice(0, 100) + "...",
          }}
        ></p>
        {/* <p className="text-gray-700 text-sm mb-4">{post.content.slice(0, 100)}...</p> */}

        <div className="tw-flex tw-justify-between tw-items-center tw-mt-2">
          <div className="tw-flex tw-space-x-4">
            <div className="tw-flex tw-items-center tw-space-x-1 tw-text-pink-600">
              <FaHeart className="tw-text-sm" />
              <span className="tw-text-xs">{post.likes}</span>
            </div>
            <div className="tw-flex tw-items-center tw-space-x-1 tw-text-blue-600">
              <FaComment className="tw-text-sm" />
              <span className="tw-text-xs">{post.comments}</span>
            </div>
          </div>
          <div className="tw-flex tw-space-x-2">
            <button
              onClick={() => setSelectedPost(post)}
              className="tw-p-2 tw-text-indigo-600 hover:tw-bg-indigo-50 tw-rounded-full tw-transition tw-duration-300"
              aria-label="View details"
            >
              <FaEye className="tw-text-sm" />
            </button>
            <button
              onClick={() => onEdit && onEdit(post.id)}
              className="tw-p-2 tw-text-blue-600 hover:tw-bg-blue-50 tw-rounded-full tw-transition tw-duration-300"
              aria-label="Edit post"
            >
              <FaEdit className="tw-text-sm" />
            </button>
            <button
              onClick={() => onDelete && onDelete(post.id)}
              className="tw-p-2 tw-text-red-600 hover:tw-bg-red-50 tw-rounded-full tw-transition tw-duration-300"
              aria-label="Delete post"
            >
              <FaTrash className="tw-text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = ({ post, onClose }) => (
    <div
      className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-60 tw-backdrop-blur-sm tw-flex tw-items-center tw-justify-center tw-p-4 tw-z-50"
      onClick={onClose}
    >
      <div
        className="tw-bg-white tw-rounded-lg tw-max-w-2xl tw-w-full tw-max-h-[80vh] tw-overflow-y-auto tw-shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tw-p-6">
          <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
            <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900">{post.title}</h2>
            <button
              onClick={onClose}
              className="tw-p-1 hover:tw-bg-gray-100 tw-rounded-full tw-transition tw-duration-300"
              aria-label="Close modal"
            >
              <FaTimes className="tw-text-gray-500" />
            </button>
          </div>
          <img
            src={post.image}
            alt="Post"
            className="tw-w-full tw-h-64 tw-object-cover tw-rounded-lg tw-mb-4 tw-shadow-md"
          />
          <p
            className="tw-text-gray-700 tw-text-sm tw-leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></p>
          {/* <p className="text-gray-700 text-sm leading-relaxed">{post.content}</p> */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="tw-bg-gray-50 tw-min-h-screen tw-py-8">
      <div className="tw-container tw-mx-auto tw-px-4">
        {InforPost.length === 0 ? (
          <div className="tw-text-center tw-text-gray-500">
            Không có bài viết nào.
          </div>
        ) : (
          <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
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
