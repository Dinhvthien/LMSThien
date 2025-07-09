import React, { useState } from 'react';
import { addToCart } from '../../../utils/addtocart';
import { useNotification } from '../../shared/context/NotificationContext';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function formatCurrencyVND(amount) {
  return amount ? amount.toLocaleString('vi-VN') + ' VND' : 'Miễn phí';
}

const CourseCard = ({ course }) => {
  const { showNotification } = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleAddToCart = () => {
    addToCart(course.id, course.title, course.description, course.price, course.thumbnailUrl, showNotification);
  };

  const checkEmailSent = (action) => {
    const hasSentEmail = localStorage.getItem('hasSentEmail');
    if (!hasSentEmail) {
      setShowModal(true);
    } else {
      if (action === 'addToCart') handleAddToCart();
      if (action === 'navigate') window.location.href = `/course/${course.id}/detail`;
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'dinhthien18052003@gmail.com',
      time: new Date().toLocaleString('vi-VN')
    };

    emailjs
      .send(
        'service_ftmqmc6',
        'template_m06zx4m',
        templateParams,
        'uJPcHBnFgjTFGblFk'
      )
      .then(
        () => {
          toast.success('Thông tin đã được gửi thành công! Bạn giờ có thể truy cập.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          localStorage.setItem('hasSentEmail', 'true');
          setShowModal(false);
          handleAddToCart(); // Tùy ý bạn có muốn thêm khi gửi xong
        },
        (error) => {
          toast.error('Lỗi khi gửi thông tin, vui lòng thử lại.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          console.error('EmailJS error:', error);
        }
      );
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
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            checkEmailSent('navigate');
          }}
        >
          <h3 className="text-sm sm:text-xl font-semibold text-gray-900 hover:text-[#F9A825] transition-colors truncate">
            {course.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
            {course.description || 'Không có mô tả'}
          </p>
          {course.price !== 0 && (
            <div className="text-[#F9A825] font-bold mt-2 text-xs sm:text-sm">
              {formatCurrencyVND(course.price)}
            </div>
          )}
        </Link>

        {course.price !== 0 && (
          <button
            onClick={() => checkEmailSent('addToCart')}
            className="mt-2 w-full bg-[#F9A825] text-white py-1 sm:py-2 rounded-md hover:bg-[#b09363] transition-colors text-xs sm:text-sm"
          >
            Thêm vào giỏ hàng
          </button>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/75 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-mono-300 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Nhập thông tin để tiếp tục</h3>
              <form onSubmit={handleSubmitEmail} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium text-sm sm:text-base">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium text-sm sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block mb-1 font-medium text-sm sm:text-base">
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                    placeholder="Nhập tiêu đề"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1 font-medium text-sm sm:text-base">
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
                    placeholder="Nhập nội dung tin nhắn"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-[#F9A825] hover:bg-[#b09363] text-white font-semibold py-2 px-4 rounded w-full text-sm sm:text-base"
                >
                  Gửi thông tin <SendIcon fontSize="small" className="ml-2" />
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 w-full text-[#555] hover:text-black font-medium py-2 px-4 rounded border border-gray-300 text-sm sm:text-base"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

// Dummy icon
const SendIcon = () => <span className="material-icons">send</span>;

export default CourseCard;
