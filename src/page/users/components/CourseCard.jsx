import React from 'react';
import { addToCart } from '../../../utils/addtocart';
import { useNotification } from '../../shared/context/NotificationContext';
import { Link } from 'react-router-dom';
  function formatCurrencyVND(amount) {
    return amount ? amount.toLocaleString("vi-VN") + " VND" : "N/A";
  }
const CourseCard = ({ course }) => {
  const { showNotification } = useNotification();
  const handleAddToCart = () => {
    addToCart(course.id, course.title, course.description, course.price, course.thumbnailUrl, showNotification);
  };
  if (!course) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <img
        src={course.thumbnailUrl || 'https://via.placeholder.com/300x150'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <Link  to={`/course/${course.id}/detail`}>
          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 mt-2 line-clamp-2">{course.description || 'Không có mô tả'}</p>
          <div className="text-blue-600 font-bold mt-4">{formatCurrencyVND(course.price)}</div>
        </Link>
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default CourseCard;