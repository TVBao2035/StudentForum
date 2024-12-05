import React from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { motion } from "framer-motion";

export default function GroupManager({ groups = [], onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-gray-800">{group.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {group.description}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                {/* <span className="font-medium">{group.memberCount} members</span> */}
                {/* <span>Created: {group.createdDate}</span> */}
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="px-4 py-1.5 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium">
                  {group.status}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit && onEdit(group.id)}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <FiEdit2 size={18} />
                  </button>

                  <button
                    onClick={() => onDelete && onDelete(group.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
