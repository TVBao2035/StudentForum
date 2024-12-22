import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useDebounce } from "../../Hooks";
import Input from "../Input";


var formData = new FormData();
export default function UsersTab() {
  const inputRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
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

  const debounceValue = useDebounce(search, 800);

  const fetchUsers = async (search) => {
    setLoading(true);
 
    try {
      const respone = await getAllUser(search);
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

  useEffect(() => {
    if(debounceValue.trim().length === 0) {
      fetchUsers();
      return;
    }

    fetchUsers(debounceValue);

  }, [debounceValue]);


  useEffect(()=>{
    inputRef.current?.focus();
  },[users])
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


  const handleSearch = (e) => {
    setSearch(e.target.value);
   
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
    <div className="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-100 tw-to-gray-200">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-mb-8 tw-flex tw-justify-between tw-items-center">
          <h1 className="tw-text-3xl tw-font-bold tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-bg-clip-text tw-text-transparent">
            User Manager
          </h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <div className="tw-relative">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleSearch}
                ref={inputRef}
                value={search}
                className="tw-pl-10 tw-pr-4 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent tw-shadow-sm"
                //value={searchQuery}
                //onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-400" />
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-text-white tw-px-6 tw-py-2 tw-rounded-lg hover:tw-opacity-90 tw-transition tw-duration-300 tw-shadow-md tw-flex tw-items-center"
            >
              <FiPlus className="tw-mr-2" /> Add New
            </button>
          </div>
        </div>

        {isAdding && (
          <div
            className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-justify-center tw-items-center"
            style={{ zIndex: 1050 }}
          >
            <div className="tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-2xl tw-w-[40rem] tw-relative">
              <button
                onClick={closeModal}
                className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
              >
                <FiX className="tw-text-white" size={20} />
              </button>

              <h3 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-center tw-text-gray-800 tw-border-b tw-pb-3">
                Add New User
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mb-3 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mb-3 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mb-3 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />

              <div className="tw-mb-4">
                <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                  User Avatar:
                </label>
                <div className="tw-flex tw-flex-col tw-items-center">
                  {newUser.avatar ? (
                    <img
                      src={newUser.avatar}
                      alt="User Avatar"
                      className="tw-w-24 tw-h-24 tw-rounded-full tw-object-cover tw-shadow-lg tw-mb-3"
                    />
                  ) : (
                    <div className="tw-w-24 tw-h-24 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                      <span className="tw-text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="avatarInput"
                    className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-4 tw-py-2 tw-rounded-full tw-cursor-pointer"
                  >
                    Change
                  </label>
                 {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="tw-hidden"
                    onChange={(e) => handleUpload(e, setNewUser)}
                  />
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-space-x-4 tw-pt-4 tw-border-t">
                <button
                  onClick={closeModal}
                  className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-5 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold"
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
          className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50"
        >
          <div className="tw-bg-white tw-rounded-2xl tw-shadow-lg tw-w-[32rem] tw-p-6 tw-relative">
            <button
              onClick={closeModal}
              className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
            >
              <FiX className="tw-text-white" size={20} />
            </button>
            <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-text-center tw-mb-4 tw-border-b tw-pb-4">
              Edit User
            </h2>
            <div className="tw-space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <input
                type="text"
                placeholder="Phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />
              <div>
                <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                  Avatar:
                </label>
                <div className="tw-flex tw-flex-col tw-items-center">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="User Avatar"
                      className="tw-w-24 tw-h-24 tw-rounded-full tw-object-cover tw-shadow-lg mb-3"
                    />
                  ) : (
                    <div className="tw-w-24 tw-h-24 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                      <span className="tw-text-gray-400">No Avatar</span>
                    </div>
                  )}
                  <label
                    htmlFor="avatarInput"
                    className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-cursor-pointer"
                  >
                    Change
                  </label>
                  {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="tw-hidden"
                    onChange={(e) => handleUpload(e, setUserData)}
                  />
                </div>
              </div>
            </div>
            <div className="tw-flex tw-justify-center tw-space-x-4 tw-pt-6 tw-border-t tw-mt-6">
              <button
                onClick={closeModal}
                className="tw-px-6 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-full hover:tw-bg-gray-300 tw-transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditUser}
                className="tw-px-6 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-full hover:tw-bg-indigo-700 tw-transition"
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
