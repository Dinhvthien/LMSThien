import React, { useState, useEffect } from 'react';

const CategoryFilter = ({ setCategory }) => {
  const [courseTypes, setCourseTypes] = useState([]);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadCourseTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/lms/course-types`, {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const types = data.result.content || [];
        setCourseTypes(types);
      } catch (err) {
        setError('Không thể tải danh sách loại khóa học.');
        err;
      }
    };
    loadCourseTypes();
  }, []);

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <div className="relative">
      {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
      <select
        id="category-filter"
        onChange={handleChange}
        className="px-3 py-1 sm:py-2 w-32 sm:w-40 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-white text-sm sm:text-base"
      >
        <option value="all">Tất cả</option>
        {courseTypes.map((type) => (
          <option key={type.id} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

export default CategoryFilter;