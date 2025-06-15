import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

const CourseSideVideo = ({ courseList, selectedVideoUrl, isEnrolled }) => {
  function formatCurrencyVND(amount) {
    return amount ? amount.toLocaleString("vi-VN") + " VND" : "N/A";
  }

  const handleAddToCart = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    try {
      const token = localStorage.getItem("token");
      console.log("handleAddToCart: Token", token ? "present" : "missing");
      if (!token) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
      }
      console.log("handleAddToCart: Adding course", courseList.id);
      await axios.post(
        `${apiUrl}/lms/carts`,
        { courseId: courseList.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      alert("Lỗi: " + err.message);
      console.log("handleAddToCart: Error", err.message);
    }
  };

  if (!courseList) {
    console.log("CourseSideVideo: No courseList data");
    return <div>Không có dữ liệu khóa học.</div>;
  }

  const videoSrc = selectedVideoUrl || courseList.videoUrl || "https://www.youtube.com/embed/3Z0ZBBLOcrQ?si=y3FI-Ex_ed2ByHPI";
  console.log("CourseSideVideo: Video src", videoSrc, "isEnrolled", isEnrolled);

  return (
    <div className="w-3/4 h-screen m-2">
      <div className="h-[80%] bg-blue-500 m-10 rounded-md">
        <iframe
          width="100%"
          height="100%"
          src={videoSrc}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <div className="m-10 p-6 bg-white rounded-xl shadow-md flex items-center justify-between space-x-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {courseList.title || "Chưa có tiêu đề"}
          </h2>
          <p className="text-gray-600">{courseList.description || "Chưa có mô tả"}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-red-600">
            {formatCurrencyVND(courseList.price)}
          </h1>
        </div>
        {!isEnrolled && (
          <div>
            <Button
              onClick={handleAddToCart}
              className="px-5 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300 cursor-pointer"
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSideVideo;