// src/services/courseService.js
const apiUrl = import.meta.env.VITE_API_URL;
export const getCourses = async () => {
  const response = await fetch(`${apiUrl}/lms/course?page=0&size=10`);

  if (!response.ok) {
    throw new Error('Lỗi khi lấy danh sách khóa học');
  }

  const data = await response.json();
  return data;
};
