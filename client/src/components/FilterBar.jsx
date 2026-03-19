import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../features/tasks/taskSlice";
import MonthDropdown from "./MonthDropdown";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { filter } = useSelector((state) => state.tasks);

  const primaryFilters = [
    { label: "All", value: "all" },
    { label: "Today", value: "today" },
    { label: "Tomorrow", value: "tomorrow" },
    { label: "This Week", value: "thisweek" },
    { label: "Last Week", value: "lastweek" },
    { label: "This Month", value: "thismonth" },
    { label: "Overdue", value: "overdue" },
    { label: "Upcoming", value: "upcoming" },
  ];

  const monthFilters = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];

  const isMonthFilter = monthFilters.includes(filter);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Primary filter pills */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {primaryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => dispatch(setFilter(f.value))}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 ${
                filter === f.value
                  ? "bg-[#BFC6F4] text-gray-800 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Custom month dropdown */}
        <MonthDropdown
          value={isMonthFilter ? filter : ""}
          onChange={(monthValue) => dispatch(setFilter(monthValue))}
        />
      </div>
    </div>
  );
}