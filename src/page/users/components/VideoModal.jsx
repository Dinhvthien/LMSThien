// src/VideoModal.jsx
import React from 'react';

const VideoModal = ({ video, onClose }) => {
  // Hàm chuyển đổi URL YouTube thành URL nhúng
  const getYouTubeEmbedUrl = (url) => {
    let videoId = '';

    // Xử lý các định dạng URL YouTube
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    }

    // Nếu không tìm thấy videoId, trả về null
    if (!videoId) return null;

    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-11/12 relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-semibold mb-4">{video.title}</h2>
        {embedUrl ? (
          <iframe
            className="w-full h-[60vh] rounded-md"
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-red-500 text-center">Không thể tải video. URL không hợp lệ.</p>
        )}
      </div>
    </div>
  );
};

export default VideoModal;