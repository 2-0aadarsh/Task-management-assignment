import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchTasks } from "../features/tasks/taskSlice";
import FilterBar from "../components/FilterBar";
import TaskList from "../components/TaskList";
import Pagination from "../components/Pagination";
import Sidebar from "../components/Sidebar";

const TasksPage = () => {
  const dispatch = useDispatch();
  const { tasks, loading, filter, page } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks({ filter, page }));
  }, [dispatch, filter, page]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F6FF80] bg-opacity-10 font-['Switzer',sans-serif]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto">
          <FilterBar />

          {loading ? (
            <div className="flex justify-center items-center mt-8 sm:mt-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#BFC6F4]"></div>
            </div>
          ) : (
            <>
              <TaskList tasks={tasks} />
              <Pagination />
            </>
          )}
        </div>
      </motion.main>
    </div>
  );
};

export default TasksPage;