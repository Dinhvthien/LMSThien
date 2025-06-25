import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => (
  <div className="flex justify-center items-center gap-1 sm:gap-2 mt-2 sm:mt-4">
    <button
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
    >
      Trước
    </button>
    <span className="text-xs sm:text-sm text-gray-700">Trang {currentPage} / {totalPages}</span>
    <button
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
    >
      Sau
    </button>
  </div>
);

export default Pagination;