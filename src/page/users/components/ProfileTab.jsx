import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileTab = () => {
  const DEFAULT_AVATAR_URL = "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    avatarUrl: DEFAULT_AVATAR_URL,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: `${apiUrl}/lms`,
    headers: { "Content-Type": "application/json" },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const fetchUserProfile = async () => {
    if (!token) {
      setErrorMessage("Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/users/my-info", {});
      let userData = response.data.result;
      userData.avatarUrl = userData.avatarUrl || DEFAULT_AVATAR_URL;
      setUser(userData);
      setFormData(userData);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        "Lỗi khi tải thông tin người dùng. Vui lòng thử lại sau.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/users/profile", {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        birthDate: formData.birthDate,
      });

      if (!response.data || !response.data.result) {
        throw new Error("Dữ liệu trả về không đúng định dạng mong muốn.");
      }

      setUser(response.data.result);
      setSuccessMessage("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      try {
        setIsLoading(true);
        const formDataToUpload = new FormData();
        formDataToUpload.append("avatar", file);

        const response = await axiosInstance.post("/users/upload-avatar", formDataToUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (!response.data || !response.data.result) {
          throw new Error("Dữ liệu trả về không đúng định dạng mong muốn.");
        }

        const newAvatarUrl = response.data.result.avatarUrl || DEFAULT_AVATAR_URL;
        setFormData((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
        setUser((prev) => ({ ...prev, avatarUrl: newAvatarUrl }));
        setSuccessMessage("Cập nhật avatar thành công!");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải lên avatar. Vui lòng thử lại.";
        setErrorMessage(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (avatarFile) {
      await handleAvatarUpload({ target: { files: [avatarFile] } });
    }
    await updateUserProfile();
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto my-6">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h2>
      </div>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md">
          {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="relative w-36 h-36">
                <img
                  src={formData.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full border-4 border-gray-200"
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors duration-200">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      accept="image/*"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              ) : (
                <p className="text-gray-900 py-2">{user.fullName || "Chưa cập nhật"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900 py-2">{user.email || "Chưa cập nhật"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{user.phone || "Chưa cập nhật"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 py-2">{user.birthDate || "Chưa cập nhật"}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                ></textarea>
              ) : (
                <p className="text-gray-900 py-2">{user.address || "Chưa cập nhật"}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileTab;