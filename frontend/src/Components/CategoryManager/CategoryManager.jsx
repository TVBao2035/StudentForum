import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CategoryManager({
  categories,
  onEdit,
  onDelete,
  setCategories,
}) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    if (!Array.isArray(categories)) {
      console.error("Categories is not an array!");
      return;
    }
    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 max-h-[70vh] overflow-auto"
          >
            {categories
              .filter((category) => category && category.id)
              .map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={String(category.id)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            category.color ? category.color : "bg-gray-500"
                          } mr-4 shadow-sm`}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => onEdit && onEdit(category.id)}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150 transform hover:scale-110"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(category.id)}
                          className="text-red-600 hover:text-red-900 transition duration-150 transform hover:scale-110"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
