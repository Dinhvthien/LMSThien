import React from 'react';
import { addToCart } from '../../../utils/addtocart';
import { useNotification } from '../../shared/context/NotificationContext';
import { Link } from 'react-router-dom';

function formatCurrencyVND(amount) {
  return amount ? amount.toLocaleString("vi-VN") + " VND" : "Miễn phí";
}

const CourseCard = ({ course }) => {
  const { showNotification } = useNotification();
  const handleAddToCart = () => {
    addToCart(course.id, course.title, course.description, course.price, course.thumbnailUrl, showNotification);
  };
  if (!course) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] snap-center">
      <img
        src={course.thumbnailUrl || 'https://via.placeholder.com/300x150'}
        alt={course.title}
        className="w-full h-32 sm:h-40 object-cover"
      />
      <div className="p-2 sm:p-4">
        <Link to={`/course/${course.id}/detail`}>
          <h3 className="text-sm sm:text-xl font-semibold text-gray-900 hover:text-[#F9A825] transition-colors truncate">
            {course.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{course.description || 'Không có mô tả'}</p>
          {course.price !== 0 && (
            <div className="text-[#F9A825] font-bold mt-2 text-xs sm:text-sm">{formatCurrencyVND(course.price)}</div>
          )}
        </Link>
        {course.price !== 0 && (
          <button
            onClick={handleAddToCart}
            className="mt-2 w-full bg-[#F9A825] text-white py-1 sm:py-2 rounded-md hover:bg-[#b09363] transition-colors text-xs sm:text-sm"
          >
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;