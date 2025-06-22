import React from 'react';

const VideoModal = ({ video, onClose }) => {
  // Hàm xử lý URL YouTube để lấy URL nhúng
  const getYouTubeEmbedUrl = (url) => {
    if (!url) {
      console.warn('videoUrl is empty or undefined');
      return null;
    }

    // Nếu đã là URL embed, giữ nguyên
    if (url.includes('youtube.com/embed/')) {
      console.log('URL already in embed format:', url);
      return url;
    }

    // Xử lý URL dạng youtu.be
    if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (!videoId) {
        console.warn('Invalid youtu.be URL:', url);
        return null;
      }
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('Converted youtu.be to embed URL:', embedUrl);
      return embedUrl;
    }

    // Xử lý URL dạng youtube.com/watch
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      const videoId = urlParams.get('v');
      if (!videoId) {
        console.warn('Invalid youtube.com/watch URL:', url);
        return null;
      }
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      console.log('Converted watch to embed URL:', embedUrl);
      return embedUrl;
    }

    // Nếu không khớp định dạng nào
    console.warn('Unrecognized YouTube URL format:', url);
    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(video?.videoUrl);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 relative shadow-2xl">
        {/* Nút đóng */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 truncate">
          {video?.title || 'Video không có tiêu đề'}
        </h2>

        {/* Video hoặc thông báo lỗi */}
        {embedUrl ? (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              src={embedUrl}
              title={video?.title || 'YouTube video'}
              className="absolute top-0 left-0 w-full h-full rounded-md"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-red-500 text-lg font-medium">Không thể tải video. URL không hợp lệ.</p>
            <p className="text-gray-600 mt-2">Vui lòng kiểm tra URL video trong dữ liệu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoModal;