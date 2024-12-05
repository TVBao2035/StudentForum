import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import GroupManager from "../GroupManager";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  getAllGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../../API/AdminAPI";

export default function GroupTab() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
  });

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const respone = await getAllGroup();
      setGroups(respone.data);
    } catch (err) {
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroup.name) {
      Swal.fire("Error", "All fields are required!", "error");
      return;
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
        });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add group!", "error");
    }
  };

  const handleEditGroup = (groupId) => {
    const groupToEdit = groups.find((group) => group.id === groupId);
    setSelectedGroup(groupToEdit);

    setGroupData({
      name: groupToEdit.name,
      description: groupToEdit.description,
    });

    setIsGroupModalOpen(true);
  };

  const handleSaveEditGroup = async () => {
    if (!groupData.name) {
      Swal.fire("Error", "All fields must be filled", "error");
      return;
    }

    try {
      const respone = await updateGroup({
        groupId: selectedGroup.id,
        name: groupData.name,
        description: groupData.description,
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
              <h3 className="text-lg font-bold mb-4">Add New Group</h3>

              <input
                type="text"
                placeholder="Group Name"
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />

              <input
                type="text"
                placeholder="Description"
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-300 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGroup}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Group
              </h2>
            </div>

            <div className="px-6 py-4 space-y-4">
              <input
                type="text"
                placeholder="Group Name"
                value={groupData.name}
                onChange={(e) =>
                  setGroupData({ ...groupData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />

              <textarea
                placeholder="Description"
                value={groupData.description}
                onChange={(e) =>
                  setGroupData({ ...groupData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
              ></textarea>
            </div>

            <div className="px-6 py-4 border-t flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditGroup}
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
