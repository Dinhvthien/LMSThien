import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CourseSidebar = ({ onDataFetched, onVideoSelect, onEnrollmentStatus }) => {
  const [courseData, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;

  const toEmbedUrl = (url) => {
    if (!url) {
      console.log("toEmbedUrl: No URL provided");
      return null;
    }
    if (url.includes("youtube.com/embed")) {
      console.log("toEmbedUrl: Already embed format", url);
      return url;
    }
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0];
    if (!videoId) {
      console.log("toEmbedUrl: Invalid YouTube URL", url);
      return null;
    }
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log("toEmbedUrl: Converted to", embedUrl);
    return embedUrl;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetchData: Fetching course data for id", id);
        const response = await axios.get(`${apiUrl}/lms/course/${id}/details`);
        if (response.data && response.data.result) {
          console.log("fetchData: Course data fetched", response.data.result);
          setData(response.data.result);
          onDataFetched(response.data.result);
          const firstVideoUrl = response.data.result.sections[0]?.lessons[0]?.videoUrl;
          if (firstVideoUrl) {
            const embedUrl = toEmbedUrl(firstVideoUrl);
            console.log("fetchData: Selecting first video", embedUrl);
            onVideoSelect(embedUrl);
          } else {
            console.log("fetchData: No valid first video URL");
          }
        } else {
          setError("Dữ liệu không hợp lệ");
          console.log("fetchData: Invalid data format");
        }
      } catch (err) {
        setError(err.message);
        console.log("fetchData: Error", err.message);
      } finally {
        setLoading(false);
      }
    };

    const checkEnrollment = async () => {
      const token = localStorage.getItem("token");
      console.log("checkEnrollment: Token", token ? "present" : "missing");
      if (!token) {
        setIsEnrolled(false);
        onEnrollmentStatus(false);
        return;
      }
      try {
        const response = await axios.get(`${apiUrl}/lms/user-course/enrolled/9`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("checkEnrollment: Enrollment status", response.data.result);
        setIsEnrolled(response.data.result || false);
        onEnrollmentStatus(response.data.result || false);
      } catch (err) {
        setIsEnrolled(false);
        onEnrollmentStatus(false);
        console.log("checkEnrollment: Error", err.message);
      }
    };

    fetchData();
    checkEnrollment();
  }, [id, onDataFetched, onVideoSelect, onEnrollmentStatus]);

  if (loading) return <p className="text-base sm:text-lg">Đang tải...</p>;
  if (error) return <p className="text-base sm:text-lg">Lỗi: {error}</p>;
  if (!courseData) return <p className="text-base sm:text-lg">Không có dữ liệu khóa học.</p>;

  return (
    <div className="w-full md:w-1/4 h-auto md:h-screen m-1 sm:m-2 overflow-y-auto md:overflow-y-auto">
      <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {courseData.sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-white border-l-2 sm:border-l-4 border-indigo-600 rounded-lg sm:rounded-xl shadow-sm p-2 sm:p-4"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">{section.title}</h2>
            <ul className="space-y-2 sm:space-y-4">
              {section.lessons.map((lesson) => {
                const isFirstSection = sectionIndex === 0;
                return (
                  <li
                    key={lesson.id}
                    className="p-2 sm:p-4 bg-gray-50 border border-gray-200 rounded-md sm:rounded-lg hover:shadow transition duration-300"
                  >
                    <h3 className="text-sm sm:text-lg font-semibold text-indigo-700">{lesson.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">⏱ Thời lượng: {lesson.duration}</p>
                    <div className="space-y-0.5 sm:space-y-1">
                      {isFirstSection || isEnrolled ? (
                        <>
                          <span
                            onClick={() => {
                              const embedUrl = toEmbedUrl(lesson.videoUrl);
                              console.log("Video clicked:", lesson.title, embedUrl);
                              if (embedUrl) onVideoSelect(embedUrl);
                            }}
                            className={`inline-block text-xs sm:text-sm ${
                              lesson.videoUrl ? "text-blue-600 hover:underline cursor-pointer" : "text-gray-400"
                            }`}
                          >
                            ▶️ Xem video
                          </span>
                          <br />
                          <a
                            href={lesson.documentUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block text-xs sm:text-sm ${
                              lesson.documentUrl ? "text-blue-600 hover:underline" : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            📄 Xem tài liệu
                          </a>
                        </>
                      ) : (
                        <>
                          <span className="inline-block text-xs sm:text-sm text-gray-400">
                            ▶️ Xem video <span className="ml-0.5 sm:ml-1">🔒</span>
                          </span>
                          <br />
                          <span className="inline-block text-xs sm:text-sm text-gray-400">
                            📄 Xem tài liệu <span className="ml-0.5 sm:ml-1">🔒</span>
                          </span>
                          <p className="text-xs sm:text-sm text-red-600">Vui lòng đăng ký khóa học để truy cập.</p>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;