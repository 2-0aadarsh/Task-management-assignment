import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { completeTask, deleteTask } from "../features/tasks/taskSlice";
import toast from "react-hot-toast";

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();
  const isCompleted = useMemo(() => task?.status === "Completed", [task?.status]);

  const [confirm, setConfirm] = useState({ open: false, type: null });
  const [isConfirming, setIsConfirming] = useState(false);

  const openConfirm = (type) => setConfirm({ open: true, type });
  const closeConfirm = () => {
    if (isConfirming) return;
    setConfirm({ open: false, type: null });
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!confirm.open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeConfirm();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [confirm.open]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      if (confirm.type === "complete") {
        await dispatch(completeTask(task._id)).unwrap();
        toast.success("Task completed");
      } else if (confirm.type === "delete") {
        await dispatch(deleteTask(task._id)).unwrap();
        toast.success("Task deleted");
      }
      closeConfirm();
    } catch (err) {
      toast.error(err?.message || "Action failed");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-xl border p-3 sm:p-4 transition-shadow ${
          isCompleted
            ? "bg-gray-50 border-gray-200"
            : "bg-white border-gray-100 hover:shadow-lg"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className={`text-sm sm:text-base font-medium truncate ${
                  isCompleted ? "text-gray-500 line-through" : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>
              {task.dueDate && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#BFC6F4] bg-opacity-30 text-gray-700">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                  isCompleted
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
              >
                {isCompleted ? "Completed" : "Pending"}
              </span>
            </div>
            {task.description && (
              <p
                className={`mt-1 text-xs sm:text-sm line-clamp-2 ${
                  isCompleted ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {task.description}
              </p>
            )}

              {task.createdAt && (
                <p className="mt-1 text-[10px] sm:text-xs text-gray-400">
                  Created on {new Date(task.createdAt).toLocaleDateString()}
                </p>
              )}
          </div>
          <div className="flex sm:flex-col gap-1.5 sm:gap-2 justify-end mt-2 sm:mt-0 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isCompleted) return toast("Already completed");
                openConfirm("complete");
              }}
              disabled={isCompleted}
              className={`text-white text-[10px] sm:text-xs font-medium py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg transition cursor-pointer w-full sm:w-auto ${
                isCompleted
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#A2A755] hover:bg-[#8f9e4a]"
              }`}
            >
              {isCompleted ? "Completed" : "Complete"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openConfirm("delete")}
              className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] sm:text-xs font-medium py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg transition cursor-pointer w-full sm:w-auto"
            >
              Delete
            </motion.button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (same as before, with updated colors) */}
      {confirm.open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeConfirm();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4 sm:p-6"
          >
            <h4 className="text-lg sm:text-xl font-medium text-gray-800">
              {confirm.type === "delete" ? "Delete task?" : "Mark as completed?"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {confirm.type === "delete"
                ? "This action cannot be undone."
                : "This will mark the task as completed."}
            </p>
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 justify-end">
              <button
                onClick={closeConfirm}
                disabled={isConfirming}
                className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white transition disabled:opacity-50 cursor-pointer text-xs sm:text-sm ${
                  confirm.type === "delete"
                    ? "bg-rose-500 hover:bg-rose-600"
                    : "bg-[#A2A755] hover:bg-[#8f9e4a]"
                }`}
              >
                {isConfirming ? "Please wait..." : confirm.type === "delete" ? "Delete" : "Complete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default TaskCard;