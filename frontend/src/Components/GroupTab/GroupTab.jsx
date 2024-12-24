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
import Loading from "../Loading";
import swalApp from "../../Helpers/swalApp";

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
        swalApp("error", "Lỗi upload ảnh");
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
        swalApp("error", "Lỗi upload ảnh");
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

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ color: "black" }} className="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-100 tw-to-gray-200">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-mb-8 tw-flex tw-justify-between tw-items-center">
          <h1 className="tw-text-3xl tw-font-bold tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-bg-clip-text tw-text-transparent">
            Group Manager
          </h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <div className="tw-relative">
              <input
                type="text"
                placeholder="Search..."
                className="tw-pl-10 tw-pr-4 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent tw-shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                ref={inputRef}
              />
              <FiSearch className="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-text-gray-400" />
            </div>
            <button
              onClick={() => {
                setIsAdding(true);
                setNewGroup((prev) => ({ ...prev, userId }));
              }}
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
              <h3 className="tw-text-xl tw-font-bold tw-mb-6 tw-text-center tw-text-gray-800 tw-border-b tw-pb-4">
                Add New Group
              </h3>

              <input
                type="text"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />

              <input
                type="text"
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />

              <div className="tw-mb-6">
                <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                  Group Image:
                </label>
                <div className="tw-flex tw-flex-col tw-items-center">
                  {newGroup.image ? (
                    <img
                      src={newGroup.image}
                      alt="Group Thumbnail"
                      className="tw-w-28 tw-h-28 tw-rounded-full tw-object-cover tw-shadow-lg tw-mb-3"
                    />
                  ) : (
                    <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                      <span className="tw-text-gray-400">No Image</span>
                    </div>
                  )}
                  <label
                    htmlFor="groupImageInput"
                    className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-cursor-pointer"
                  >
                    Change
                  </label>
                  {/* EDIT UPLOAD IMAGE */}
                  <input
                    id="groupImageInput"
                    type="file"
                    accept="image/*"
                    className="tw-hidden"
                    onChange={(e) => handleUpload(e, setNewGroup)}
                  />
                </div>
              </div>

              <div className="tw-flex tw-justify-center tw-space-x-6 tw-pt-4 tw-border-t">
                <button
                  onClick={closeModal}
                  className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-6 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-font-semibold"
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
          className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50"
        >
          <div style={{ color: "black" }} className="tw-relative tw-bg-white tw-p-8 tw-rounded-2xl tw-shadow-2xl tw-w-[32rem]">
            <button
              onClick={closeModal}
              className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
            >
              <FiX className="tw-text-white" size={20} />
            </button>
            <h3 className="tw-text-xl tw-font-bold tw-mb-6 tw-text-center tw-text-gray-800 tw-border-b tw-pb-4">
              Edit Group
            </h3>

            <input
              type="text"
              placeholder="Group Name"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({ ...groupData, name: e.target.value })
              }
              className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
            />

            <input
              placeholder="Description"
              value={groupData.description}
              onChange={(e) =>
                setGroupData({ ...groupData, description: e.target.value })
              }
              className="tw-w-full tw-p-3 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
            ></input>

            <div className="tw-mb-6">
              <label className="tw-block tw-font-semibold tw-mb-2 tw-text-gray-700">
                Group Image:
              </label>
              <div className="tw-flex tw-flex-col tw-items-center">
                {groupData.image ? (
                  <img
                    src={groupData.image}
                    alt="Group Thumbnail"
                    className="tw-w-28 tw-h-28 tw-rounded-full tw-object-cover tw-shadow-lg tw-mb-3"
                  />
                ) : (
                  <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-shadow-inner">
                    <span className="tw-text-gray-400">No Image</span>
                  </div>
                )}
                <label
                  htmlFor="groupImageInput"
                  className="tw-bg-yellow-500 hover:tw-bg-yellow-600 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-cursor-pointer"
                >
                  Change
                </label>
                {/* EDIT UPLOAD IMAGE */}
                <input
                  id="groupImageInput"
                  type="file"
                  accept="image/*"
                  className="tw-hidden"
                  onChange={(e) => handleUpload(e, setGroupData)}
                />
              </div>
            </div>

            <div className="tw-flex tw-justify-center tw-space-x-6 tw-pt-4 tw-border-t">
              <button
                onClick={closeModal}
                className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-6 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditGroup}
                className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-6 tw-py-2 tw-rounded-full tw-font-semibold"
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
