import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import CategoryManager from "../CategoryManager";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../API/AdminAPI";

export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const availableColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategory();
      if (Array.isArray(response.data)) {
        const updatedCategories = response.data
          .filter((category) => category && category.id)
          .map((category) => ({
            ...category,
            color:
              category.color ||
              availableColors[
                Math.floor(Math.random() * availableColors.length)
              ],
          }));
        setCategories(updatedCategories);
      } else {
        throw new Error("Invalid categories data");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Failed to fetch categories. Please try again.",
        "error"
      );
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      Swal.fire("Error", "Category name cannot be empty.", "error");
      return;
    }

    try {
      const response = await createCategory(newCategory);
      if (response.status === 200) {
        Swal.fire("Success", "Category added successfully!", "success");
        await fetchCategories();
        //setCategories((prev) => [...prev, response.data]);
        setIsAdding(false);
        setNewCategory({ name: "" });
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add category.", "error");
    }
  };

  const handleEditCategory = (categoryId) => {
    const categoryToEdit = categories.find(
      (category) => category.id === categoryId
    );
    setSelectedCategory(categoryToEdit);
    setCategoryName(categoryToEdit.name);
    setIsCategoryModalOpen(true);
  };

  const handleSaveEditCategory = async () => {
    try {
      const respone = await updateCategory({
        categoryId: selectedCategory.id,
        name: categoryName,
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

        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === selectedCategory.id
              ? { ...category, name: categoryName }
              : category
          )
        );

        setIsCategoryModalOpen(false);
        setSelectedCategory(null);
      } else {
        Swal.fire({
          title: "Cập nhật danh mục thất bại! Vui lòng thử lại!",
          icon: "error",
          toast: true,
          position: "top-end",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      setError("Failed to update category!");
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories((prev) =>
        prev.filter((category) => category.id !== categoryId)
      );
      Swal.fire("Deleted", "Category deleted successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete category.", "error");
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Category Manager
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
              <h3 className="text-lg font-bold mb-4">Add New Category</h3>
              <input
                type="text"
                placeholder="Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
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
                  onClick={handleAddCategory}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <CategoryManager
          categories={categories}
          setCategories={setCategories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
        <Modal
          isOpen={isCategoryModalOpen}
          onRequestClose={() => setIsCategoryModalOpen(false)}
          contentLabel="Edit Category"
          appElement={document.getElementById("root")}
          className="fixed inset-0 flex items-center justify-center z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Edit Category
              </h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-4">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditCategory}
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
