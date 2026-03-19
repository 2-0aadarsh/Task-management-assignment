import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MonthDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMonth = value ? monthNames.find(
    (m) => m.toLowerCase() === value
  ) : "Select month";

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto bg-gray-100 border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 pr-6 sm:pr-8 focus:outline-none focus:ring-2 focus:ring-[#BFC6F4] flex items-center justify-between gap-1 sm:gap-2"
      >
        <span className="truncate">{selectedMonth}</span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-48 sm:max-h-60 overflow-y-auto w-full sm:w-48 overscroll-contain scrollbar-thin scrollbar-thumb-gray-300"
            onWheel={(e) => e.stopPropagation()} // Prevent parent scroll while using wheel
          >
            {monthNames.map((month) => (
              <button
                key={month}
                onClick={() => {
                  onChange(month.toLowerCase());
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-gray-50 transition ${
                  month.toLowerCase() === value
                    ? "bg-[#BFC6F4] bg-opacity-20 text-gray-800 font-medium"
                    : "text-gray-700"
                }`}
              >
                {month}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonthDropdown;