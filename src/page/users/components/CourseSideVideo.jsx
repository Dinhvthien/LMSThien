import React from "react";
import { Button } from "@mui/material";
import axios from "axios";

function formatCurrencyVND(amount) {
  return amount ? amount.toLocaleString("vi-VN") + " VND" : "Miễn phí";
}

const CourseSideVideo = ({ courseList, selectedVideoUrl, isEnrolled }) => {
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
    return <div className="text-base sm:text-lg text-gray-600">Không có dữ liệu khóa học.</div>;
  }

  const videoSrc = selectedVideoUrl || courseList.videoUrl || "https://www.youtube.com/embed/3Z0ZBBLOcrQ?si=y3FI-Ex_ed2ByHPI";
  console.log("CourseSideVideo: Video src", videoSrc, "isEnrolled", isEnrolled);

  return (
    <div className="w-full md:w-3/4 m-1 sm:m-2">
      <div className="h-48 sm:h-[80%] bg-blue-500 m-2 sm:m-4 rounded-md">
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
      <div className="m-2 sm:m-4 p-2 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">
            {courseList.title || "Chưa có tiêu đề"}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{courseList.description || "Chưa có mô tả"}</p>
        </div>
        {courseList.price !== 0 && (
          <div className="text-right">
            <h1 className="text-lg sm:text-2xl font-bold text-red-600">
              {formatCurrencyVND(courseList.price)}
            </h1>
          </div>
        )}
        {!isEnrolled && courseList.price !== 0 && (
          <div>
            <Button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:bg-red-600 transition duration-300 cursor-pointer text-sm sm:text-base"
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