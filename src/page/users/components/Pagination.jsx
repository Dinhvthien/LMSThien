import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  if (totalPages <= 0) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-full disabled:bg-gray-300 hover:bg-gray-300 transition-colors"
      >
        Trang trước
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 cursor-pointer rounded-full ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-full disabled:bg-gray-300 hover:bg-gray-300 transition-colors"
      >
        Trang sau
      </button>
    </div>
  );
};

export default Pagination;