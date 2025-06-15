import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../../shared/context/NotificationContext';
import { CART_CHANGE_EVENT } from '../../../utils/cartUtils';

const PaymentResultPage = () => {
  const [status, setStatus] = useState('Đang xử lý kết quả thanh toán...');
  const [isSuccess, setIsSuccess] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy tham số từ URL (redirect từ VNPay)
    const urlParams = new URLSearchParams(location.search);
    const responseCode = urlParams.get('status'); // Giả sử VNPay gửi 'status' như ví dụ của bạn
    console.log('URL Params:', Object.fromEntries(urlParams));

    // Xử lý trạng thái thanh toán
    if (responseCode === 'success') {
      setStatus('✅ Thanh toán thành công!');
      setIsSuccess(true);
      showNotification('Thanh toán thành công!', 'success');

      // Xóa giỏ hàng cục bộ sau khi thanh toán thành công
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    } else {
      setStatus('❌ Thanh toán thất bại!');
      setIsSuccess(false);
      showNotification('Thanh toán thất bại!', 'error');
    }

  }, [location.search, showNotification]);

  // Hàm điều hướng quay lại
  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </h2>
        <div className="bg-gray-200 p-4 rounded-lg mb-6">
          <p className="text-gray-700">Chi tiết thanh toán sẽ được gửi qua email của bạn.</p>
          <p className="text-gray-700">Xin vui lòng kiểm tra email để biết thêm thông tin.</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded ${isSuccess ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'} focus:outline-none`}
            onClick={handleBackToCart}
            disabled={!isSuccess}
          >
            Quay lại giỏ hàng
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
            onClick={handleBackToHome}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;