import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard";

const TaskList = ({ tasks = [] }) => {
  const safeTasks = tasks.filter((t) => t && t._id);

  if (!safeTasks.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-3 sm:mt-4"
      >
        <p className="text-sm sm:text-base text-gray-500">No tasks yet. Create one to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
      <AnimatePresence>
        {safeTasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;