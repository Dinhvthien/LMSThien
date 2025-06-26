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
  const [errors, setErrors] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validatePhoneNumber = (value) => {
    // Vietnamese phone number regex: starts with 0 followed by 9 digits
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value,
    });

    // Validate username if it's the field being changed
    if (name === "username") {
      if (!validatePhoneNumber(value)) {
        setErrors((prev) => ({
          ...prev,
          username: "Vui lòng nhập số điện thoại hợp lệ (10 chữ số, bắt đầu bằng 0)",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          username: "",
        }));
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Check if username is valid before submitting
    if (!validatePhoneNumber(form.username)) {
      setMessage("Vui lòng nhập số điện thoại hợp lệ cho tên đăng nhập.");
      return;
    }

    const formToSubmit = {
      ...form,
      fullName: form.username,
       phone: form.username,
    };

    try {
      await axios.post(`${apiUrl}/lms/users`, formToSubmit);
      setMessage("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      setMessage("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error(error);
    }
  };

  const fieldLabels = {
    username: "Tên đăng nhập (Số điện thoại)",
    email: "Email",
    passwordHash: "Mật khẩu",
  };

  const isFormValid = form.email.trim() !== "" || form.phone.trim() !== "" && !errors.username;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Đăng ký</h2>

        {Object.keys(fieldLabels).map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 text-sm text-gray-600">
              {fieldLabels[field]}
            </label>
            <input
              type={field === "passwordHash" ? "password" : field === "email" ? "email" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 ${
                field === "username" && errors.username ? "border-red-500" : ""
              }`}
              placeholder={
                field === "username" ? "0999999999" :
                field === "email" ? "Nhập email" :
                field === "phone" ? "Nhập số điện thoại" :
                "Nhập mật khẩu"
              }
            />
            {field === "username" && errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>
        ))}

        {message && <p className="text-sm text-center text-red-500 mb-4">{message}</p>}

        <button
          type="button"
          onClick={handleRegister}
          className={`w-full bg-[#F9A825] text-white py-2 px-4 rounded-lg transition duration-200 ${
            isFormValid ? "hover:bg-[#e6c289]" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}