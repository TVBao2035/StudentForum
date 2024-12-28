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
            className="tw-space-y-4 tw-max-h-[70vh] tw-overflow-auto"
          >
            {
            categories.length === 0 ? (
              <div className="tw-flex tw-items-center" >
                <span >Không tìm thấy thể loại bài đăng</span>
              </div>
            ): 
            categories
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
                      className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-white tw-rounded-lg tw-shadow-md hover:tw-shadow-xl tw-transition tw-duration-300"
                    >
                      <div className="tw-flex tw-items-center">
                        <div
                          className={`tw-w-4 tw-h-4 tw-rounded-full ${
                            category.color ? category.color : "tw-bg-gray-500"
                          } tw-mr-4 tw-shadow-sm`}
                        ></div>
                        <span className="tw-font-medium">{category.name}</span>
                      </div>
                      <div className="tw-space-x-2">
                        <button
                          onClick={() => onEdit && onEdit(category.id)}
                          className="tw-text-indigo-600 hover:tw-text-indigo-900 tw-transition tw-duration-150 tw-transform hover:tw-scale-110"
                        >
                          <FiEdit className="tw-h-5 tw-w-5" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(category.id)}
                          className="tw-text-red-600 hover:tw-text-red-900 tw-transition tw-duration-150 tw-transform hover:tw-scale-110"
                        >
                          <FiTrash2 className="tw-h-5 tw-w-5" />
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
