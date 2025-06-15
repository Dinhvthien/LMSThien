import { useState, useEffect } from 'react';

const PurchasedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const loadPurchasedCourses = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn cần đăng nhập để xem khóa học đã mua.');
        window.location.href = '/pages/Login.html';
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/lms/user-course`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách khóa học.');
        }

        const data = await response.json();
        setCourses(data.result || []);
      } catch (err) {
        console.error('Lỗi khi tải khóa học đã mua:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPurchasedCourses();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600 mt-10">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">Lỗi: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 font-montserrat">
        Khóa học đã mua
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <p className="text-gray-600">Bạn chưa mua khóa học nào.</p>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 font-roboto">
                  {course.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">
                  {course.description}
                </p>
                <a
                  href={`/khoa-hoc/${course.id}/bai-hoc`}
                  className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Vào học
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasedCourses;