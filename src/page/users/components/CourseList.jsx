import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import Pagination from './Pagination';


const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [error, setError] = useState('');
  const coursesPerPage = 6;
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchCourses = async (page) => {
    const token = localStorage.getItem('token');
    let url = `${apiUrl}/lms/course?page=${page - 1}&size=${coursesPerPage}`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (category !== 'all') url += `&courseType=${encodeURIComponent(category)}`;

    try {
      setError('');
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      const result = data.result;
      if (!result || !result.content) throw new Error('Invalid API response structure');
      setCourses(result.content);
      setTotalPages(result.totalPages);
      setCurrentPage(result.pageable.pageNumber + 1);
    } catch (err) {
      setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      setCourses([]);
      setTotalPages(0);
      err;
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage, searchQuery, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <SearchBar setSearchQuery={setSearchQuery} />
        <div className="flex items-center gap-4">
          <CategoryFilter setCategory={setCategory} />
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 && !error ? (
          <p className="text-gray-500 text-center col-span-full">Không tìm thấy khóa học nào.</p>
        ) : (
          courses.map((course) => <CourseCard key={course.id} course={course} />)
        )}
      </div>

      {totalPages > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default CourseList;