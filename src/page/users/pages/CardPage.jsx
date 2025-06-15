import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../shared/context/NotificationContext';
import { CART_CHANGE_EVENT } from '../../../utils/cartUtils';
import './CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const isLoggedIn = localStorage.getItem('token') !== null;
  const token = localStorage.getItem('token');

  // Hàm tải giỏ hàng
  const loadCart = async () => {
    setError('');
    setCartItems([]);

    if (!isLoggedIn) {
      const localCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(localCart);
    } else {
      try {
        const response = await fetch(`${apiUrl}/lms/carts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log("res", response);
        if (!response.ok) {
          throw new Error('Không thể tải giỏ hàng từ server 2');
        }

        const data = await response.json();
        const serverItems = data.result || [];

        // Hợp nhất với giỏ hàng cục bộ
        const localCart = JSON.parse(localStorage.getItem('cart')) || [];
        const mergedItems = [
          ...serverItems,
          ...localCart.filter(localItem => !serverItems.some(serverItem => serverItem.id === localItem.id)),
        ];
        setCartItems(mergedItems);

        window.dispatchEvent(new Event(CART_CHANGE_EVENT));
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    }

    // Tính tổng giá
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalPrice(total);
  };

    function formatCurrencyVND(amount) {
    return amount ? amount.toLocaleString("vi-VN") + " VND" : "N/A";
  }
  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (courseId) => {
    if (!isLoggedIn) {
      // Xóa từ localStorage nếu chưa đăng nhập
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart = cart.filter(item => item.id !== courseId);
      localStorage.setItem('cart', JSON.stringify(cart));
      setCartItems(cart);
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
      showNotification('Xóa khóa học thành công', 'success');
    } else {
      try {
        const response = await fetch(`${apiUrl}/lms/carts/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.result || 'Không thể xóa khóa học khỏi giỏ hàng 1');
        }

        // Cập nhật trực tiếp cartItems mà không gọi loadCart
        const updatedCartItems = cartItems.filter(item => item.id !== courseId);
        setCartItems(updatedCartItems);

        // Đồng bộ với localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCartItems));
        window.dispatchEvent(new Event(CART_CHANGE_EVENT));
        showNotification('Xóa khóa học thành công', 'success');
      } catch (error) {
        console.error('Error removing from cart:', error);
        setError(error.message || 'Không thể xóa khóa học. Vui lòng thử lại sau.');
        showNotification(error.message || 'Không thể xóa khóa học 2', 'error');
      }
    }
  };

  // Hàm thanh toán
  const checkout = async () => {
    if (!isLoggedIn) {
      showNotification('Vui lòng đăng nhập để thanh toán!', 'warning');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      const bankCode = 'NCB'; // Mặc định Ngân hàng Quốc Dân
      const url = `${apiUrl}/lms/payment/vn-pay?amount=${Math.round(totalAmount)}&bankCode=${bankCode}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Không thể tạo liên kết thanh toán VNPay');
      }

      const data = await response.json();
      const paymentUrl = data.result.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl; // Chuyển hướng đến VNPay
      } else {
        throw new Error('Không nhận được URL thanh toán từ VNPay');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError(error.message || 'Không thể thực hiện thanh toán. Vui lòng thử lại sau.');
      showNotification(error.message || 'Không thể thực hiện thanh toán', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Tải giỏ hàng khi component mount
  useEffect(() => {
    loadCart();
  }, []);

  // Tính tổng giá mỗi khi cartItems thay đổi
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalPrice(total);
  }, [cartItems]);

  return (
    <div className="cart-page container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

      {error && (
        <p id="error-message" className="text-red-500 text-center mb-6">
          {error}
        </p>
      )}

      <div id="cart-items" className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart text-gray-500 text-center">
            Giỏ hàng của bạn đang trống.
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id || item.courseID} className="cart-item flex items-center border-b py-4">
              <img
                src={item.thumbnailUrl || 'https://via.placeholder.com/100x50'}
                alt={item.title}
                className="w-24 h-12 object-cover mr-4"
              />
              <div className="cart-item-details flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.description || 'Không có mô tả'}</p>
              </div>
              <div className="cart-item-price text-blue-600 font-bold mr-4">
                {formatCurrencyVND(item.price)}
              </div>
              <button
                className="cart-item-remove bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => removeFromCart(item.id || item.courseID)}
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary mt-8 flex justify-between items-center">
        <button
          className="continue-shopping bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => navigate('/course')}
        >
          Tiếp tục mua sắm
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">
            Tổng cộng: <span id="total-price">{formatCurrencyVND(totalPrice)}</span>
          </span>
          <button
            id="pay-now-btn"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            onClick={checkout}
            disabled={cartItems.length === 0 || isLoading}
          >
            Thanh toán
          </button>
        </div>
      </div>

      {isLoading && (
        <div id="loading" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="spinner border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CartPage;