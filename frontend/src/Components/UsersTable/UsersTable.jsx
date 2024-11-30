// import React from "react";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
//import "./UsersTableStyle.scss";
//import Avatar from '../Avatar';

// export default function UsersTable({ users }) {
//export default function UsersTable({ users }) {
  // const users = [
  //   { id: 1, username: "john_doe", email: "john@example.com", role: "Admin", avatar: "images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
  //   { id: 2, username: "jane_smith", email: "jane@example.com", role: "Moderator", avatar: "images.unsplash.com/photo-1494790108377-be9c29b29330" },
  // ];
    // return (
    //     <div className="UsersTable">
    //     <table>
    //       <thead>
    //         <tr>
    //           <th>User</th>
    //           <th>Email</th>
    //           {/* <th>Role</th> */}
    //           <th>Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {users.map((user) => (
    //           <tr key={user.id}>
    //             {/* <td><Avatar size="small"> {user.avatar} </Avatar></td> */}
    //             <td>{user.name}</td>
    //             <td>{user.email}</td>
    //             {/* <td>{user.role}</td> */}
    //             <td className="actions">
    //               <button className="edit">
    //                 <FiEdit />
    //               </button>
    //               <button className="delete">
    //                 <FiTrash2 />
    //               </button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // );
//     return (
//       <div className="overflow-x-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
//         <table className="min-w-full bg-white shadow-xl">
//           <thead className="bg-indigo-600 text-white">
//             <tr>
//               <th className="px-6 py-4">User</th>
//               <th className="px-6 py-4">Email</th>
//               {/* <th className="px-6 py-4">Role</th> */}
//               <th className="px-6 py-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 flex items-center">
//                   <img src={`https://${user.avatar}`} alt={user.name} className="h-12 w-12 rounded-full mr-4" />
//                   <span>{user.name}</span>
//                 </td>
//                 <td className="px-6 py-4">{user.email}</td>
//                 {/* <td className="px-6 py-4">
//                   <span className="bg-green-600 text-white px-3 py-1 rounded-full">{user.role}</span>
//                 </td> */}
//                 <td className="px-6 py-4 space-x-2">
//                   <button className="text-indigo-600 hover:text-indigo-900">
//                     <FiEdit />
//                   </button>
//                   <button className="text-red-600 hover:text-red-900">
//                     <FiTrash2 />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
// };

import React from "react";
import { FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";

export default function UsersTable({ users = [] , onEdit, onDelete }) {
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
                onClick={() => onEdit(user.id)} 
                className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150 transform hover:scale-110"
              >
                <FiEdit className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(user.id)}
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