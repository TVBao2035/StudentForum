import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import UsersTable from "../UsersTable";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../API/AdminAPI";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    password: "",
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.phone || !newUser.password) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    try {
      const respone = await createUser(newUser);
      if (respone.status === 200) {
        Swal.fire("Success", "User added successfully!", "success");
        await fetchUsers();
        //setUsers((prev) => [...prev, respone.data]);
        setIsAdding(false);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          avatar: "",
          password: "",
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add user!", "error");
    }
  };

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setSelectedUser(userToEdit);

    setUserData({
      name: userToEdit.name,
      email: userToEdit.email,
      phone: userToEdit.phone,
      avatar: userToEdit.avatar,
    });

    setIsUserModalOpen(true);
  };

  const handleSaveEditUser = async () => {
    if (!userData.email || !userData.phone || !userData.avatar) {
      Swal.fire("Error", "All fields must be filled", "error");
      return;
    }

    try {
      const respone = await updateUser({ userData, userId: selectedUser.id });
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

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...userData } : user
          )
        );
        setIsUserModalOpen(false);
        setSelectedUser(null);
      } else {
        Swal.fire({
          title: "Cập nhật thất bại! Vui lòng thử lại!",
          icon: "error",
          toast: true,
          position: "top-end",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
        });
        setIsUserModalOpen(false);
      }
    } catch (error) {
      setError("Failed to update user!");
    }
  };

  const closeModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      Swal.fire("Deleted", "User deleted successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete user.", "error");
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            User Manager
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-bold mb-4">Add New User</h3>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={newUser.avatar}
                onChange={(e) =>
                  setNewUser({ ...newUser, avatar: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-2 border rounded mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <UsersTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        <Modal
          isOpen={isUserModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit User"
          appElement={document.getElementById("root")}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Edit User</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={userData.avatar}
                onChange={(e) =>
                  setUserData({ ...userData, avatar: e.target.value })
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
                onClick={handleSaveEditUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
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
