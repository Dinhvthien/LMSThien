import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    passwordHash: "",
  });
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${apiUrl}/lms/users`, form);
      setMessage("Đăng ký thành công!");
      navigate("/login"); // Chuyển sang trang đăng nhập
    } catch (error) {
      setMessage("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      error;
    }
  };

  const fieldLabels = {
    fullName: "Họ và tên",
    username: "Tên đăng nhập",
    email: "Email",
    phone: "Số điện thoại",
    passwordHash: "Mật khẩu",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Đăng ký</h2>

        {Object.keys(fieldLabels).map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 text-sm text-gray-600">
              {fieldLabels[field]}
            </label>
            <input
              type={field === "passwordHash" ? "password" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder={`Nhập ${fieldLabels[field].toLowerCase()}`}
            />
          </div>
        ))}

        {message && <p className="text-sm text-center text-red-500 mb-4">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
