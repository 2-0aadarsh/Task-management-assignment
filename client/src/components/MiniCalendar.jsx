import { useState } from "react";

const MiniCalendar = () => {
  const [today] = useState(new Date());

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const todayDate = today.getDate();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4">
      <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
        {monthNames[month]} {year}
      </h4>
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-[10px] sm:text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-gray-400 font-medium">{d}</div>
        ))}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="text-gray-200">-</div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`p-0.5 sm:p-1 rounded-full ${
              day === todayDate
                ? "bg-[#A2A755] text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCalendar;