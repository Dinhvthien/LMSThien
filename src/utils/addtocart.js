import axios from "axios";
import { getCart } from "./cartUtils";

export const CART_CHANGE_EVENT = 'cart-changed';
const apiUrl = import.meta.env.VITE_API_URL;
export const addToCart = async (id, title, description, price, thumbnailUrl, notify) => {
  const token = localStorage.getItem("token");

  const newItem = {
    id,
    title,
    description,
    price,
    thumbnailUrl,
  };

  if (token) {
    try {
      await axios.post(
        `${apiUrl}/lms/carts`,
        { courseId: id}, // Giả sử định dạng API, điều chỉnh nếu cần
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await getCart(); // Tải lại giỏ hàng từ server và hợp nhất
      notify && notify("Thêm vào giỏ hàng thành công", "success");
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      notify && notify(error.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  } else {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = storedCart.find(item => item.id === id);
    if (exists) {
      notify && notify("Khóa học đã có trong giỏ hàng!", "warning");
      return;
    }

    storedCart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(storedCart));
    notify && notify("Thêm vào giỏ hàng thành công", "success");
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }
};