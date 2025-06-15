import axios from "axios";

export const CART_CHANGE_EVENT = 'cart-changed';

export const getCart = async () => {
  let cartItems = [];
  const token = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_API_URL;
  if (token) {
    try {
      const response = await axios.get(
        `${apiUrl}/lms/carts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      cartItems = response.data.result || [];

      // Hợp nhất với giỏ hàng cục bộ
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const mergedItems = [
        ...cartItems,
        ...localCart.filter(localItem => !cartItems.some(serverItem => serverItem.id === localItem.id)),
      ];
      cartItems = mergedItems;
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ server:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("storageChange"));
        window.location.href = "/login";
      }
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      cartItems = localCart;
    }
  } else {
    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems = localCart;
  }

  return Array.isArray(cartItems) ? cartItems : [];
};

export const updateCartCount = (setCount) => {
  const updateCount = async () => {
    const cart = await getCart();
    setCount(cart.length);
  };

  updateCount();

  const handleCartChange = () => {
    updateCount();
  };

  window.addEventListener(CART_CHANGE_EVENT, handleCartChange);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, handleCartChange);
  };
};