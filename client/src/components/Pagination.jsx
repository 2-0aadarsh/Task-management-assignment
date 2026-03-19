import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../features/tasks/taskSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { pagination } = useSelector((state) => state.tasks);

  if (!pagination) return null;

  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;

  // Hide pagination when there is nothing to paginate
  if (!totalPages || totalPages <= 1) return null;
  if (!currentPage || currentPage > totalPages) return null;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setPage(page));
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages !== 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <nav className="inline-flex rounded-lg shadow-sm" aria-label="Pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={!hasPrevPage}
          className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && goToPage(page)}
            disabled={page === "..."}
            className={`relative inline-flex items-center px-4 py-2 border-t border-b text-sm font-medium transition ${
              page === currentPage
                ? "z-10 bg-[#BFC6F4] border-[#BFC6F4] text-gray-800"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            } ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!hasNextPage}
          className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;