import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import UsersTable from "../UsersTable";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import {
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../API/AdminAPI";
import apiUploadImage from "../../Hooks/apiUploadImage";


var formData = new FormData();
export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);
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


  const handleUpload = async (event, setData) => {
    formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
    formData.append("asset_folder", "StudentForum");
    setIsChangeImage(true);
    setData((pre) => {
      return {
        ...pre,
        avatar: URL.createObjectURL(event.target.files[0])
      }
    })
  }

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.phone || !newUser.password) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }
    if(isChangeImage){
        try {
          let res = await apiUploadImage(formData);
          newUser.avatar = res.data.url;
        } catch (error) {
          alert("Lỗi upload ảnh");
          return;
        }
    }

    try {
   
      const respone = await createUser(newUser);
      if (respone.status === 200) {
        Swal.fire("Success", "User added successfully!", "success");
        await fetchUsers();
        setIsAdding(false);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          avatar: "",
          password: "",
        });
      }
      setIsChangeImage(false);
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
  {/* EDIT UPLOAD IMAGE */ }
  const handleSaveEditUser = async () => {
    if (!userData.email || !userData.phone) {
      Swal.fire("Error", "All fields must be filled", "error");
      return;
    }
    if(isChangeImage){
      try {
        let res = await apiUploadImage(formData);
        userData.avatar = res.data.url;
        setIsChangeImage(false);
      } catch (error) {
        alert("Lỗi upload ảnh");
        return;
      }
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
        setIsAdding(false);
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
      setIsChangeImage(false);
    } catch (error) {
      setError("Failed to update user!");
    }
  };

  const closeModal = () => {
    console.log(userData);
    setIsUserModalOpen(false);
    setIsAdding(false)
    setSelectedUser(null);
    setUserData({
      name: "",
      email: "",
      phone: "",
      avatar: "",
    });
    setNewUser({
      name: "",
      email: "",
      phone: "",
      avatar: "",
      password: "",
    })
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            style={{ zIndex: 1050 }}
          >
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-[40rem] relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none"
              >
                <FiX className="text-white" size={20} />
              </button>

              <h3 className="text-xl font-bold mb-4 text-center text-gray-800 border-b pb-3">
                Add New User
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-2 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <div className="mb-4">
                <label className="block font-semibold mb-2 text-gray-700">
                  User Avatar:
                </label>
                <div className="flex flex-col items-center">
                  {newUser.avatar ? (
                    <img
                      src={newUser.avatar}
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full object-cover shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="avatarInput"
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-2 rounded-full cursor-pointer"
                  >
                    Change
                  </label>
                 {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, setNewUser)}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-4 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 transition px-5 py-2 rounded-full text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-full font-semibold"
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
          <div className="bg-white rounded-2xl shadow-lg w-[32rem] p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none"
            >
              <FiX className="text-white" size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4 border-b pb-4">
              Edit User
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div>
                <label className="block font-semibold mb-2 text-gray-700">
                  Avatar:
                </label>
                <div className="flex flex-col items-center">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full object-cover shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                      <span className="text-gray-400">No Avatar</span>
                    </div>
                  )}
                  <label
                    htmlFor="avatarInput"
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-5 py-2 rounded-full cursor-pointer"
                  >
                    Change
                  </label>
                  {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, setUserData)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 pt-6 border-t mt-6">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditUser}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
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
