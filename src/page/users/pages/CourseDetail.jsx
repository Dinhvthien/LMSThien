import React, { useState, useCallback } from "react";
import CourseSideVideo from "../components/CourseSideVideo";
import CourseSidebar from "../components/CourseSidebar";

export default function CourseDetail() {
  const [data, setData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleDataFromChild = useCallback((data) => {
    console.log("handleDataFromChild: Received data", data);
    setData(data);
  }, []);

  const handleVideoSelect = useCallback((url) => {
    console.log("handleVideoSelect: Selected video URL", url);
    setVideoUrl(url);
  }, []);

  const handleEnrollmentStatus = useCallback((status) => {
    console.log("handleEnrollmentStatus: Enrollment status", status);
    setIsEnrolled(status);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-auto mb-4 sm:mb-20 gap-2 sm:gap-4">
      {data ? (
        <CourseSideVideo courseList={data} selectedVideoUrl={videoUrl} isEnrolled={isEnrolled} />
      ) : (
        <div className="w-full md:w-3/4 h-64 sm:h-screen flex items-center justify-center">
          <p className="text-base sm:text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}
      <CourseSidebar
        onDataFetched={handleDataFromChild}
        onVideoSelect={handleVideoSelect}
        onEnrollmentStatus={handleEnrollmentStatus}
      />
    </div>
  );
}