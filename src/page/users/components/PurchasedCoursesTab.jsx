import React, { useState, useEffect } from 'react';

const PurchasedCoursesTab = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, inProgress, completed

  useEffect(() => {
    // Giả lập gọi API để lấy danh sách khóa học đã mua
    const fetchPurchasedCourses = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Trong trường hợp thực tế, đây sẽ là API call
        // const response = await fetch('api/user/courses', {...});
        // const data = await response.json();
        
        // Mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockCourses = [
          {
            id: 1,
            title: 'Lập trình React JS cho người mới bắt đầu',
            description: 'Khóa học giúp bạn làm quen với React và xây dựng ứng dụng web hiện đại',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            instructor: 'Nguyễn Văn A',
            progress: 75,
            totalLessons: 24,
            completedLessons: 18,
            purchaseDate: '2023-10-15'
          },
          {
            id: 2,
            title: 'JavaScript nâng cao - ES6 và các tính năng mới',
            description: 'Khóa học giúp bạn nắm vững các tính năng mới của JavaScript để lập trình hiệu quả',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            instructor: 'Trần Thị B',
            progress: 100,
            totalLessons: 20,
            completedLessons: 20,
            purchaseDate: '2023-09-05'
          },
          {
            id: 3,
            title: 'Thiết kế UI/UX với Figma',
            description: 'Học cách thiết kế giao diện người dùng chuyên nghiệp với Figma',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            instructor: 'Lê Văn C',
            progress: 30,
            totalLessons: 15,
            completedLessons: 4,
            purchaseDate: '2023-11-20'
          },
          {
            id: 4,
            title: 'Lập trình Backend với Node.js và Express',
            description: 'Xây dựng API và ứng dụng server-side với Node.js và Express',
            thumbnailUrl: 'https://via.placeholder.com/300x150',
            instructor: 'Phạm Văn D',
            progress: 0,
            totalLessons: 30,
            completedLessons: 0,
            purchaseDate: '2023-12-01'
          }
        ];
        
        setCourses(mockCourses);
      } catch (err) {
        console.error('Error fetching purchased courses:', err);
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchasedCourses();
  }, []);

  // Lọc khóa học theo tab hoạt động
  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'inProgress') return course.progress > 0 && course.progress < 100;
    if (activeTab === 'completed') return course.progress === 100;
    return true;
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold text-gray-800">Khóa học đã mua</h2>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab('inProgress')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'inProgress'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Đang học
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${
              activeTab === 'completed'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Thử lại
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Không có khóa học nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-xs">
                      Ngày mua: {new Date(course.purchaseDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>Giảng viên: {course.instructor}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          course.progress === 100 
                            ? 'bg-green-500' 
                            : course.progress > 0 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                        }`} 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <a 
                    href={`/course/${course.id}`}
                    className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition-colors"
                  >
                    {course.progress === 0 ? 'Bắt đầu học' : 'Tiếp tục học'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedCoursesTab;