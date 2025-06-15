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
    <div className="flex h-auto mb-20">
      {data ? (
        <CourseSideVideo courseList={data} selectedVideoUrl={videoUrl} isEnrolled={isEnrolled} />
      ) : (
        <div className="w-3/4 h-screen m-2 flex items-center justify-center">
          <p>Đang tải dữ liệu...</p>
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