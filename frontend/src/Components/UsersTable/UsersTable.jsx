import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Avatar from "../Avatar";

export default function UsersTable({ users = [], onEdit, onDelete }) {

  return(
    <div style={{color: "black"}} className="tw-overflow-x-auto tw-bg-gradient-to-r tw-from-blue-50 tw-to-purple-50 tw-rounded-lg tw-p-4">
    <table className="tw-min-w-full tw-bg-white tw-rounded-lg tw-overflow-hidden tw-shadow-xl">
      <thead className="tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-text-white">
        <tr>
          <th className="tw-px-6 tw-py-4 tw-text-left tw-text-sm tw-font-medium tw-uppercase tw-tracking-wider">User</th>
          <th className="tw-px-6 tw-py-4 tw-text-left tw-text-sm tw-font-medium tw-uppercase tw-tracking-wider">Email</th>
          <th className="tw-px-6 tw-py-4 tw-text-left tw-text-sm tw-font-medium tw-uppercase tw-tracking-wider">Phone</th>
          <th className="tw-px-6 tw-py-4 tw-text-left tw-text-sm tw-font-medium tw-uppercase tw-tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="tw-divide-y tw-divide-gray-200">
        {
        users.length === 0 ? (
          <tr key={"None"} className="hover:tw-bg-gray-50 tw-transition tw-duration-150">
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <span className="tw-text-sm tw-text-gray-900 tw-items-center">Không tìm thấy người dùng</span>
            </td>
          </tr>
        ):(
          users.map((user) => (
          <tr key={user.id} className="hover:tw-bg-gray-50 tw-transition tw-duration-150">
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div className="tw-flex tw-items-center">
                <Avatar
                  normal
                  className="tw-rounded-full tw-ring-2 tw-ring-indigo tw-p-1"

                  link={user.avatar}
                />
                <div className="tw-ml-4">
                  <div className="tw-text-sm font-semibold tw-text-gray-900">{user.name}</div>
                </div>
              </div>
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <div className="tw-text-sm tw-text-gray-900">{user.email}</div>
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap">
              <span className="tw-px-3 tw-py-1 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full tw-bg-gradient-to-r tw-from-green-400 tw-to-green-600 tw-text-white tw-shadow-sm">
                {user.phone}
              </span>
            </td>
            <td className="tw-px-6 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-font-medium">
              <button
                onClick={() => onEdit && onEdit(user.id)}
                className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-mr-4 tw-transition tw-duration-150 tw-transform hover:tw-scale-110"
              >
                <FiEdit className="tw-h-5 tw-w-5" />
              </button>
              <button
                onClick={() => onDelete && onDelete(user.id)}
                className="tw-text-red-600 hover:tw-text-red-900 tw-transition tw-duration-150 tw-transform hover:tw-scale-110"
              >
                <FiTrash2 className="tw-h-5 tw-w-5" />
              </button>
            </td>
          </tr>
          ))
        )
      }
      </tbody>
    </table>
  </div>
  );
};

