import React, { useState, useEffect, useReducer, useRef } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useSelector } from "react-redux";
import GroupManager from "../GroupManager";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import {
  getAllUser,
  getAllGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../API/AdminAPI";
import apiUploadImage from "../../Hooks/apiUploadImage";
import { useDebounce } from "../../Hooks";

var formData = new FormData();

export default function GroupTab() {
  const userId = useSelector((state) => state.user.id);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isChangeImage, setIsChangeImage] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    image: "",
    userId: userId || null,
  });
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 800);
  const inputRef = useRef(null);
  const [users, setUsers] = useState([]);

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

  const fetchGroups = async (search="") => {
    setLoading(true);
    try {
      const respone = await getAllGroup(search);
      setGroups(respone.data);
    } catch (err) {
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);
  
  useEffect(()=>{
    if(debounceValue.trim().length === 0){
      fetchGroups();
      return;
    }

    fetchGroups(debounceValue);
  }, [debounceValue]);

  useEffect(()=>{
    inputRef.current?.focus();
  }, [groups])
  const handleAddGroup = async () => {
    if (!userId) {
      Swal.fire("Error", "UserId not found. Please login again!", "error");
      return;
    }

    if (!newGroup.name || !newGroup.userId) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
    }

    if (isChangeImage) {
      try {
        let res = await apiUploadImage(formData);
        newGroup.image = res.data.url;
        setIsChangeImage(false);
      } catch (error) {
        alert("Lỗi upload ảnh");
        return;
      }
    }

    try {

      const respone = await createGroup(newGroup);
      if (respone.status === 200) {
        Swal.fire("Success", "Group added successfully!", "success");
        await fetchGroups();
        //setGroups((prev) => [...prev, respone.data]);
        setIsAdding(false);
        setNewGroup({
          name: "",
          description: "",
          image: "",
          userId: userId,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add group!", "error");
    }
  };

  const handleUpload = async (event, setData) => {
    formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("upload_preset", process.env.REACT_APP_UPDATE_ACCESS_NAME);
    formData.append("asset_folder", "StudentForum");
    setIsChangeImage(true);
    setData((pre) => {
      return {
        ...pre,
        image: URL.createObjectURL(event.target.files[0])
      }
    })
  }
  const handleEditGroup = (groupId) => {
    const groupToEdit = groups.find((group) => group.id === groupId);
    setSelectedGroup(groupToEdit);

    setGroupData({
      name: groupToEdit.name,
      description: groupToEdit.description,
      image: groupToEdit.image,
    });

    setIsGroupModalOpen(true);
  };
  {/* EDIT UPLOAD IMAGE */ }
  const handleSaveEditGroup = async () => {
    if (!groupData.name) {
      Swal.fire("Error", "All fields must be filled", "error");
      return;
    }
    if (isChangeImage) {
      try {
        let res = await apiUploadImage(formData);
        groupData.image = res.data.url;
        setIsChangeImage(false);
      } catch (error) {
        alert("Lỗi upload ảnh");
        return;
      }
    }

    try {

      const respone = await updateGroup({
        groupId: selectedGroup.id,
        name: groupData.name,
        description: groupData.description,
        image: groupData.image,
      });
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

        setGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === selectedGroup.id ? { ...group, ...groupData } : group
          )
        );
        setIsGroupModalOpen(false);
        setSelectedGroup(null);
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
        setIsGroupModalOpen(false);
      }
    } catch (error) {
      setError("Failed to update group!");
    }
  };

  const closeModal = () => {
    setIsGroupModalOpen(false);
    setSelectedGroup(null);
    setIsAdding(false);
    setGroupData({
      name: "",
      description: "",
      image: "",
    });
    setNewGroup({
      name: "",
      description: "",
      image: "",
      userId: userId || null,
    });
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setGroups((prev) => prev.filter((group) => group.id !== groupId));
      Swal.fire("Deleted", "Group deleted successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete group!", "error");
    }
  };

  if (loading) return <div>Loading groups...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Group Manager
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                ref={inputRef}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => {
                setIsAdding(true);
                setNewGroup((prev) => ({ ...prev, userId }));
              }}
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
              <h3 className="text-xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
                Add New Group
              </h3>

              <input
                type="text"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <div className="mb-6">
                <label className="block font-semibold mb-2 text-gray-700">
                  Group Image:
                </label>
                <div className="flex flex-col items-center">
                  {newGroup.image ? (
                    <img
                      src={newGroup.image}
                      alt="Group Thumbnail"
                      className="w-28 h-28 rounded-full object-cover shadow-lg mb-3"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="groupImageInput"
                    className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-5 py-2 rounded-full cursor-pointer"
                  >
                    Change
                  </label>
                  {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="groupImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, setNewGroup)}
                  />
                </div>
              </div>

              <div className="flex justify-center space-x-6 pt-4 border-t">
                <button
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 transition px-6 py-2 rounded-full text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-full font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <GroupManager
          groups={groups}
          onEdit={handleEditGroup}
          onDelete={handleDeleteGroup}
        />

        <Modal
          isOpen={isGroupModalOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Group"
          appElement={document.getElementById("root")}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-[32rem]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-transform transform hover:scale-110 focus:outline-none"
            >
              <FiX className="text-white" size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
              Edit Group
            </h3>

            <input
              type="text"
              placeholder="Group Name"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({ ...groupData, name: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <input
              placeholder="Description"
              value={groupData.description}
              onChange={(e) =>
                setGroupData({ ...groupData, description: e.target.value })
              }
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></input>

            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-700">
                Group Image:
              </label>
              <div className="flex flex-col items-center">
                {groupData.image ? (
                  <img
                    src={groupData.image}
                    alt="Group Thumbnail"
                    className="w-28 h-28 rounded-full object-cover shadow-lg mb-3"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 shadow-inner">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="groupImageInput"
                  className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-5 py-2 rounded-full cursor-pointer"
                >
                  Change
                </label>
                {/* EDIT UPLOAD IMAGE */}
                <input
                  id="groupImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, setGroupData)}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-6 pt-4 border-t">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 transition px-6 py-2 rounded-full text-gray-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditGroup}
                className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-full font-semibold"
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
