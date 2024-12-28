import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";

export default function GroupManager({ groups = [], onEdit, onDelete }) {
  return (
    <div className="tw-bg-gradient-to-br tw-from-gray-50 tw-to-gray-100 tw-min-h-screen tw-py-8 tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-max-w-7xl tw-mx-auto">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
          {
          groups?.length === 0 ? (
            <div>
              <span>Không tìm thấy nhóm</span>
            </div>
          ):
          (
            groups?.map((group) => (
              <div
                key={group.id}
                className="tw-bg-white tw-rounded-xl tw-shadow-md tw-overflow-hidden hover:tw-shadow-2xl tw-transition-all tw-duration-500 tw-transform hover:-tw-translate-y-1"
              >
                <div className="tw-relative tw-group">
                  {[group.id] ? (
                    <img
                      src={group.image}
                      alt="Group Thumbnail"
                      className="tw-w-full tw-h-48 tw-object-cover tw-transition-transform tw-duration-700 tw-group-hover:tw-scale-110"
                    />
                  ) : (
                    <div className="tw-w-full tw-h-48 tw-bg-gradient-to-r tw-from-gray-100 tw-to-gray-200 tw-flex tw-items-center tw-justify-center">
                      <span className="tw-text-gray-500 tw-text-sm">
                        Image not available
                      </span>
                    </div>
                  )}
                  <div className="tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-black/70 tw-via-black/20 tw-to-transparent tw-opacity-0 tw-group-hover:tw-opacity-100 tw-transition-opacity tw-duration-500" />
                </div>
  
                <div className="tw-p-6">
                  <div className="tw-space-y-2">
                    <h2 className="tw-text-xl tw-font-bold tw-text-gray-900 hover:tw-text-blue-600 tw-transition-colors tw-duration-300 tw-truncate">
                      {group.name}
                    </h2>
                  </div>
  
                  <div className="tw-mt-3">
                    <p className="tw-text-gray-600 tw-text-sm tw-line-clamp-2 tw-leading-relaxed">
                      {group.description}
                    </p>
                  </div>
  
                  <div className="tw-flex tw-space-x-3 tw-mt-6">
                    <button
                      onClick={() => onEdit && onEdit(group.id)}
                      className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-700 hover:tw-from-blue-700 hover:tw-to-blue-800 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-transition-all tw-duration-300 tw-text-sm tw-font-medium tw-shadow-md hover:tw-shadow-lg"
                    >
                      <FiEdit2 className="tw-w-4 tw-h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(group.id)}
                      className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-space-x-2 tw-bg-gradient-to-r tw-from-red-600 tw-to-red-700 hover:tw-from-red-700 hover:tw-to-red-800 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-transition-all tw-duration-300 tw-text-sm tw-font-medium tw-shadow-md hover:tw-shadow-lg"
                    >
                      <FiTrash2 className="tw-w-4 tw-h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))

          )
          }
        </div>
      </div>
    </div>
  );
}
