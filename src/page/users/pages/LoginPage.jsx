import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${apiUrl}/lms/auth/token`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.result.token;
      localStorage.setItem("token", token);

      // Cập nhật cart từ localStorage vào database
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0); // Giỏ hàng trống thì không đồng bộ
      const courseId = cart.map((item) => item.id); // Lấy danh sách courseId
      if (cart.length > 0) {
        try {
          await fetch(`${apiUrl}/lms/carts/sync`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ courseId }),
          });
          localStorage.removeItem("cart");
        } catch (cartError) {
          console.error("Failed to update cart:", cartError);
          setError("Đăng nhập thành công, nhưng không thể cập nhật giỏ hàng.");
        }
      }

      // Giải mã phần payload từ token
      const base64Payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(base64Payload));
      let role = "user"; // Giá trị mặc định
      if (decodedPayload.scope && decodedPayload.scope.includes("_")) {
        role = decodedPayload.scope.split("_")[1].toLowerCase();
      }
      console.log("role", role);
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Đăng nhập
        </h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nhập tài khoản"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nhập mật khẩu"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Đăng nhập
        </button>

        <div className="text-center mt-4">
          <div className="text-gray-500 mb-2">Hoặc</div>
          <span className="text-gray-500">Đăng ký: </span>
          <a href="/register" className="text-blue-600 hover:underline ml-1">
            Tại đây
          </a>
        </div>
      </form>
    </div>
  );
}
