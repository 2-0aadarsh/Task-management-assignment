import { useMemo } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import TaskForm from "./TaskForm";
import MiniCalendar from "./MiniCalendar";

const Sidebar = () => {
  const { tasks } = useSelector((state) => state.tasks);

  const tasksDueToday = useMemo(() => {
    const toLocalDateKey = (date) => {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) return null;
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const todayKey = toLocalDateKey(new Date());

    return tasks.filter((task) => {
      if (!task?.dueDate) return false;
      if (task?.status === "Completed") return false;
      return toLocalDateKey(task.dueDate) === todayKey;
    }).length;
  }, [tasks]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-80 bg-white shadow-xl p-4 sm:p-5 lg:p-6 flex flex-col gap-4 lg:gap-6 overflow-y-auto"
    >
      {/* Greeting */}
      <div>
        <h2 className="text-xl sm:text-2xl font-light text-gray-800">
          Good Morning, <span className="font-medium">Aadarsh!</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#A2A755] mt-1">
          {tasksDueToday} task{tasksDueToday !== 1 ? "s" : ""} to complete today
        </p>
      </div>

      {/* Mini Calendar */}
      <MiniCalendar />

      {/* Compact Task Form */}
      <div className="bg-[#BFC6F4] bg-opacity-20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Add New Task</h3>
        <TaskForm compact />
      </div>
    </motion.aside>
  );
};

export default Sidebar;