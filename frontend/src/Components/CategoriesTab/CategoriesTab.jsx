import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import CategoryManager from "../CategoryManager";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../API/AdminAPI";
import { useDebounce } from "../../Hooks";
import Loading from "../Loading";

export default function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const inputRef = useRef(null);
  const [search, setSearch] = useState("");

  const debounceValue = useDebounce(search, 800);

  const availableColors = [
    "tw-bg-blue-500",
    "tw-bg-green-500",
    "tw-bg-yellow-500",
    "tw-bg-red-500",
  ];

  const fetchCategories = async (search = "") => {
    setLoading(true);
    try {
      const response = await getAllCategory(search);
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

  useEffect(() => {
    if (debounceValue.trim().length === 0) {
      fetchCategories();
      return;
    }
    fetchCategories(debounceValue);
  }, [debounceValue]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [categories]);
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

  if (loading) return <Loading/>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ color: "black" }} className="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-100 tw-to-gray-200">
      <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-mb-8 tw-flex tw-justify-between tw-items-center">
          <h1 className="tw-text-3xl tw-font-bold tw-bg-gradient-to-r tw-from-indigo-600 tw-to-purple-600 tw-bg-clip-text tw-text-transparent">
            Category Manager
          </h1>
          <div className="tw-flex tw-items-center tw-space-x-4">
            <div className="tw-relative">
              <input
                type="text"
                placeholder="Search..."
                ref={inputRef}
                className="tw-pl-10 tw-pr-4 tw-py-2 tw-rounded-lg tw-border tw-border-gray-300 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-border-transparent tw-shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
            <div className="tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-2xl tw-w-[30rem] tw-relative">
              <button
                onClick={() => setIsAdding(false)}
                className="tw-absolute tw-top-4 tw-right-4 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-shadow-md tw-transition-transform tw-transform hover:tw-scale-110 focus:tw-outline-none"
              >
                <FiX className="tw-text-white" size={20} />
              </button>

              <h3 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-center tw-text-gray-800 tw-border-b tw-pb-3">
                Add New Category
              </h3>

              <input
                type="text"
                placeholder="Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-mb-4 focus:tw-ring-2 focus:tw-ring-indigo-500 focus:tw-outline-none"
              />

              <div className="tw-flex tw-justify-center tw-space-x-4 tw-pt-4 tw-border-t">
                <button
                  onClick={() => setIsAdding(false)}
                  className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-transition tw-px-5 tw-py-2 tw-rounded-full tw-text-gray-700 tw-font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-transition tw-text-white tw-px-5 tw-py-2 tw-rounded-full tw-font-semibold"
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
          className="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-50"
          overlayClassName="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50"
        >
          <div style={{ color: "black" }} className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-md tw-mx-4">
            <div className="tw-px-6 tw-py-4 tw-border-b">
              <h2 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                Edit Category
              </h2>
            </div>
            <div className="tw-px-6 tw-py-4 tw-space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="tw-w-full tw-px-4 tw-py-2 tw-border tw-rounded-md tw-shadow-sm focus:tw-ring-indigo-500 focus:tw-border-indigo-500"
              />
            </div>
            <div className="tw-px-6 tw-py-4 tw-border-t tw-flex tw-justify-end tw-space-x-4">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-800 tw-rounded-md hover:tw-bg-gray-300 tw-transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditCategory}
                className="tw-px-4 tw-py-2 tw-bg-indigo-600 tw-text-white tw-rounded-md hover:tw-bg-indigo-700 tw-transition"
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
