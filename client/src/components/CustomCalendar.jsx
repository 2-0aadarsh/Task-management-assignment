import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CustomCalendar = ({ selectedDate, onSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );
  const [view, setView] = useState("days"); // "days", "months", "years"

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);

    // Prevent selecting past dates
    if (selected < today) return;

    const yearStr = selected.getFullYear();
    const monthStr = String(selected.getMonth() + 1).padStart(2, "0");
    const dayStr = String(selected.getDate()).padStart(2, "0");
    onSelect(`${yearStr}-${monthStr}-${dayStr}`);
    onClose();
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(new Date(year, monthIndex, 1));
    setView("days");
  };

  const handleYearSelect = (yearOffset) => {
    setCurrentMonth(new Date(year + yearOffset, month, 1));
  };

  const isPastDate = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const renderDays = () => {
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSelected = dateStr === selectedDate;
      const isPast = isPastDate(d);

      days.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          disabled={isPast}
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center transition
            ${isSelected ? "bg-[#BFC6F4] text-gray-800 font-medium" : ""}
            ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-700"}
          `}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-64"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-1">
          <button
            onClick={() => setView("months")}
            className="text-sm font-medium text-gray-800 hover:text-[#BFC6F4] transition"
          >
            {monthNames[month]}
          </button>
          <button
            onClick={() => setView("years")}
            className="text-sm font-medium text-gray-800 hover:text-[#BFC6F4] transition"
          >
            {year}
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Body */}
      <AnimatePresence mode="wait">
        {view === "days" && (
          <motion.div
            key="days"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="grid grid-cols-7 gap-1 mb-2 text-xs text-gray-500 font-medium">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="w-8 h-8 flex items-center justify-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
          </motion.div>
        )}

        {view === "months" && (
          <motion.div
            key="months"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-3 gap-2 py-2"
          >
            {monthNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => handleMonthSelect(idx)}
                className={`text-sm py-1 rounded-lg transition ${
                  idx === month
                    ? "bg-[#BFC6F4] text-gray-800 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </motion.div>
        )}

        {view === "years" && (
          <motion.div
            key="years"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-2"
          >
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => handleYearSelect(-1)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-medium">{year}</span>
              <button
                onClick={() => handleYearSelect(1)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => year - 5 + i).map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setCurrentMonth(new Date(y, month, 1));
                    setView("days");
                  }}
                  className={`text-sm py-1 rounded-lg transition ${
                    y === year
                      ? "bg-[#BFC6F4] text-gray-800 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with Today and Clear buttons */}
      <div className="flex justify-between mt-3 pt-2 border-t border-gray-100">
        <button
          onClick={() => {
            const today = new Date();
            const yearStr = today.getFullYear();
            const monthStr = String(today.getMonth() + 1).padStart(2, "0");
            const dayStr = String(today.getDate()).padStart(2, "0");
            onSelect(`${yearStr}-${monthStr}-${dayStr}`);
            onClose();
          }}
          className="text-xs text-[#A2A755] hover:text-[#8f9e4a] font-medium transition"
        >
          Today
        </button>
        <button
          onClick={() => {
            onSelect("");
            onClose();
          }}
          className="text-xs text-gray-500 hover:text-gray-700 transition"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
};

export default CustomCalendar;