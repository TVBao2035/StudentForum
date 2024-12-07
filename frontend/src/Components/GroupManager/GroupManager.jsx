import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function GroupManager({ groups = [], onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className="relative group">
                {[group.id] ? (
                  <img
                    src={group.image}
                    alt="Group Thumbnail"
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      Image not available
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 truncate">
                    {group.name}
                  </h2>
                </div>

                <div className="mt-3">
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                    {group.description}
                  </p>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => onEdit && onEdit(group.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(group.id)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
