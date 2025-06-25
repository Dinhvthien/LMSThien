import React, { useCallback } from 'react';
import { debounce } from '../../../utils/debounce';

const SearchBar = ({ setSearchQuery }) => {
  const debouncedSearch = useCallback(debounce((value) => setSearchQuery(value), 500), [setSearchQuery]);
  const handleInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <input
        type="text"
        id="search-input"
        placeholder="Tìm kiếm khóa học..."
        onChange={handleInputChange}
        className="w-full px-3 py-1 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
      />
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
};

export default SearchBar;