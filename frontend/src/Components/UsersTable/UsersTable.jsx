import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function UsersTable({ users = [], onEdit, onDelete }) {
  return(
    <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-xl">
      <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">User</th>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Email</th>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Phone</th>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {users.map((user) => (
          <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full ring-2 ring-indigo-500 p-1"
                  src={user.avatar}
                  alt={user.name}
                />
                <div className="ml-4">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white shadow-sm">
                {user.phone}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => onEdit && onEdit(user.id)} 
                className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 transform hover:scale-110"
              >
                <FiEdit className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete && onDelete(user.id)}
                className="text-red-600 hover:text-red-900 transition duration-150 transform hover:scale-110"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

