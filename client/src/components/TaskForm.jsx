import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import { createTask } from "../features/tasks/taskSlice";
import toast from "react-hot-toast";
import CustomCalendar from "./CustomCalendar";

const TaskForm = ({ compact = false }) => {
  const dispatch = useDispatch();
  const { isCreating } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0, width: 0, openAbove: false });
  const buttonRef = useRef(null);
  const calendarRef = useRef(null);

  const MAX_DESCRIPTION_LENGTH = 200;
  const [dueDateError, setDueDateError] = useState("");
  const [touched, setTouched] = useState({ title: false, description: false, dueDate: false });

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reposition calendar on scroll/resize
  useEffect(() => {
    if (!showCalendar) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const calendarHeight = 320;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const openAbove = spaceBelow < calendarHeight && spaceAbove > calendarHeight;

        setCalendarPosition({
          top: openAbove ? rect.top - calendarHeight - 8 : rect.bottom + 8,
          left: rect.left,
          width: rect.width,
          openAbove,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showCalendar]);

  const validateDueDate = (value) => {
    if (!value) return "Due date is required";
    const parts = value.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return "Invalid due date format.";
    }
    const [year, month, day] = parts;
    const parsed = new Date(year, month - 1, day);
    if (Number.isNaN(parsed.getTime())) {
      return "Invalid due date format.";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsed.setHours(0, 0, 0, 0);
    if (parsed < today) return "Due date cannot be in the past.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "dueDate") {
      setDueDateError(validateDueDate(value));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "dueDate") {
      // Don't show "required" just for opening/closing the calendar.
      // Required validation is enforced on submit.
      if (!formData.dueDate) return;
      setDueDateError(validateDueDate(formData.dueDate));
    }
  };

  const handleDateSelect = (date) => {
    setFormData((prev) => ({ ...prev, dueDate: date }));
    setDueDateError(validateDueDate(date));
    setShowCalendar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show errors
    setTouched({ title: true, description: true, dueDate: true });

    const titleError = !formData.title.trim();
    const descError = !formData.description.trim() || formData.description.length > MAX_DESCRIPTION_LENGTH;
    const dateError = validateDueDate(formData.dueDate);

    if (titleError) {
      return toast.error("Title is required");
    }
    if (descError) {
      if (!formData.description.trim()) return toast.error("Description is required");
      if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
        return toast.error(`Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`);
      }
    }
    if (dateError) {
      setDueDateError(dateError);
      return;
    }

    try {
      await dispatch(createTask(formData)).unwrap();
      toast.success("Task created");
      setFormData({
        title: "",
        description: "",
        dueDate: "",
      });
      setDueDateError("");
      setTouched({ title: false, description: false, dueDate: false });
    } catch (err) {
      toast.error(err);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // Determine if form is valid
  const isFormValid = () => {
    const titleValid = formData.title.trim() !== "";
    const descValid = formData.description.trim() !== "" && formData.description.length <= MAX_DESCRIPTION_LENGTH;
    const dateValid = formData.dueDate !== "" && validateDueDate(formData.dueDate) === "";
    return titleValid && descValid && dateValid;
  };

  const inputBase = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BFC6F4] focus:border-transparent transition shadow-sm";
  const textareaBase = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#BFC6F4] focus:border-transparent transition resize-none shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={() => handleBlur("title")}
          placeholder="Task title"
          className={`${inputBase} ${
            touched.title && !formData.title.trim() ? "border-rose-300 focus:ring-rose-200" : ""
          }`}
        />
        {touched.title && !formData.title.trim() && (
          <p className="text-xs text-rose-500 mt-1">Title is required</p>
        )}
      </div>

      {/* Description */}
      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur("description")}
          placeholder="Description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={compact ? 2 : 3}
          className={`${textareaBase} min-h-[80px] max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
            touched.description && (!formData.description.trim() || formData.description.length > MAX_DESCRIPTION_LENGTH)
              ? "border-rose-300 focus:ring-rose-200"
              : ""
          }`}
        />
        <div className="flex justify-between items-center mt-1.5">
          {touched.description && !formData.description.trim() ? (
            <p className="text-xs text-rose-500">Description is required</p>
          ) : (
            <div />
          )}
          <span
            className={`text-xs font-medium ${
              formData.description.length >= MAX_DESCRIPTION_LENGTH
                ? "text-rose-500"
                : "text-gray-400"
            }`}
          >
            {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
      </div>

      {/* Due Date Button */}
      <div className="relative">
        <button
          type="button"
          ref={buttonRef}
          onClick={() => setShowCalendar(!showCalendar)}
          className={`${inputBase} text-left flex items-center justify-between ${
            touched.dueDate && dueDateError ? "border-rose-300" : ""
          }`}
        >
          <span className={formData.dueDate ? "text-gray-800" : "text-gray-400"}>
            {formData.dueDate ? formatDateForDisplay(formData.dueDate) : "dd-mm-yyyy"}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        {touched.dueDate && dueDateError && (
          <p className="text-xs text-rose-500 mt-1">{dueDateError}</p>
        )}
      </div>

      {/* Create Button */}
      <motion.button
        type="submit"
        disabled={!isFormValid() || isCreating}
        whileHover={isFormValid() && !isCreating ? { scale: 1.02 } : {}}
        whileTap={isFormValid() && !isCreating ? { scale: 0.98 } : {}}
        className={`w-full py-3 px-4 rounded-xl shadow-md transition-all duration-200 ${
          isFormValid() && !isCreating
            ? "bg-gradient-to-r from-[#BFC6F4] to-[#A2A755] text-gray-800 hover:shadow-lg cursor-pointer"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isCreating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating...
          </span>
        ) : (
          "Create Task"
        )}
      </motion.button>

      {/* Portal Calendar */}
      {showCalendar &&
        ReactDOM.createPortal(
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, y: calendarPosition.openAbove ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: calendarPosition.openAbove ? 10 : -10 }}
            style={{
              position: "absolute",
              top: calendarPosition.top,
              left: calendarPosition.left,
              width: calendarPosition.width,
              zIndex: 9999,
            }}
          >
            <CustomCalendar
              selectedDate={formData.dueDate}
              onSelect={handleDateSelect}
              onClose={() => setShowCalendar(false)}
            />
          </motion.div>,
          document.body
        )}
    </form>
  );
};

export default TaskForm;