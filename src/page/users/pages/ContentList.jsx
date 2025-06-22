import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VideoModal from '../components/VideoModal';
import Pagination from '../components/Pagination';
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
// URL API từ env
const API_URL = import.meta.env.VITE_API_URL;

// Logo YouTube và Google Drive
const YOUTUBE_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png';
const DRIVE_LOGO = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';

// Chuyển URL YouTube thành URL embed
const convertToEmbedUrl = (url) => {
  if (!url) {
    console.warn('videoUrl is empty or undefined');
    return '';
  }
  // Nếu đã là URL embed, giữ nguyên
  if (url.includes('youtube.com/embed/')) {
    console.log('URL already in embed format:', url);
    return url;
  }
  // Nếu là URL watch, chuyển thành embed
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : '';
  if (!videoId) {
    console.warn('Invalid YouTube URL:', url);
    return '';
  }
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  console.log('Converted to embed URL:', embedUrl);
  return embedUrl;
};

// Component skeleton cho loading
const ItemSkeleton = () => (
  <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-gray-200 animate-pulse mb-4">
    <div className="flex items-center space-x-4 flex-1">
      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-16"></div>
  </div>
);

const ContentList = () => {
  // State quản lý nội dung và bộ lọc
  const [contentType, setContentType] = useState('video'); // 'video' hoặc 'document'
  const [items, setItems] = useState([]); // Danh sách video/tài liệu
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại (1-based cho UI)
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [selectedVideo, setSelectedVideo] = useState(null); // Video được chọn để xem
  const [videoTypes, setVideoTypes] = useState([]); // Danh sách loại video
  const [documentTypes, setDocumentTypes] = useState([]); // Danh sách loại tài liệu
  const [selectedType, setSelectedType] = useState(''); // Loại video/tài liệu được chọn
  const [search, setSearch] = useState(''); // Từ khóa tìm kiếm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
  const [error, setError] = useState(''); // Thông báo lỗi

  // Lấy danh sách loại video và tài liệu
  const fetchTypes = async () => {
    try {
      const [videoTypesRes, documentTypesRes] = await Promise.all([
        axios.get(`${API_URL}/lms/video_types`),
        axios.get(`${API_URL}/lms/document_types`),
      ]);
      setVideoTypes(videoTypesRes.data.result || []);
      setDocumentTypes(documentTypesRes.data.result || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách loại:', err);
      setError('Không thể tải danh sách loại.');
    }
  };

  // Lấy danh sách video hoặc tài liệu
  const fetchContent = async (type, typeFilter, searchQuery, page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/lms/${type}s`, {
        params: {
          status: 'PUBLIC',
          page, // 0-based cho API
          size: 10,
          search: searchQuery || undefined,
          [`${type}IdType`]: typeFilter || undefined,
        },
      });
      const content = response.data.result.content || [];
      console.log('API response content:', content); 
      setItems(
        content.map((item) => ({
          ...item,
          videoUrl: type === 'video' ? convertToEmbedUrl(item.videoUrl) : undefined,
        }))
      );
      setTotalPages(response.data.result.totalPages || 0);
    } catch (err) {
      console.error('Lỗi khi lấy nội dung:', err);
      setItems([]);
      setTotalPages(0);
      setError(`Không thể tải danh sách ${type === 'video' ? 'video' : 'tài liệu'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce tìm kiếm
  const debouncedSearch = useCallback(
    debounce((type, typeFilter, query) => {
      fetchContent(type, typeFilter, query, 0);
      setCurrentPage(1); // Reset về trang 1
    }, 500),
    []
  );

  // Tải dữ liệu khi thay đổi contentType hoặc selectedType
  useEffect(() => {
    fetchTypes();
    fetchContent(contentType, selectedType, search, currentPage - 1);
  }, [contentType, selectedType, currentPage]);

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedSearch(contentType, selectedType, query);
  };

  // Xử lý thay đổi content type
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSelectedType('');
    setSearch('');
    setCurrentPage(1);
  };

  // Xử lý thay đổi loại
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý click vào item
  const handleItemClick = (item) => {
    console.log('Clicked item:', item); 
    if (contentType === 'video') {
      if (!item.videoUrl) {
        setError('URL video không hợp lệ hoặc không tồn tại.');
        return;
      }
      setSelectedVideo(item);
    } else {
      if (!item.fileUrl) {
        setError('URL tài liệu không hợp lệ hoặc không tồn tại.');
        return;
      }
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {contentType === 'video' ? 'Danh sách Video' : 'Danh sách Tài liệu'}
      </h1>

      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg shadow-sm">
        {/* Nút chuyển đổi */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              contentType === 'video'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleContentTypeChange('video')}
          >
            Video
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              contentType === 'document'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleContentTypeChange('document')}
          >
            Tài liệu
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder={`Tìm kiếm ${contentType === 'video' ? 'video' : 'tài liệu'}...`}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />

        {/* Bộ lọc loại */}
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        >
          <option value="">Tất cả</option>
          {(contentType === 'video' ? videoTypes : documentTypes).map((type) => (
            <option key={type.id} value={type.id}>
              {type.name || 'N/A'}
            </option>
          ))}
        </select>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Danh sách nội dung dạng hàng ngang */}
      <div className="space-y-4">
        {isLoading ? (
          // Hiển thị skeleton khi loading
          Array.from({ length: 6 }).map((_, index) => (
            <ItemSkeleton key={index} />
          ))
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không tìm thấy {contentType === 'video' ? 'video' : 'tài liệu'}.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer border border-gray-200"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center space-x-4 flex-1">
                {/* Logo */}
                <img
                  src={contentType === 'video' ? YOUTUBE_LOGO : DRIVE_LOGO}
                  alt={contentType === 'video' ? 'YouTube' : 'Google Drive'}
                  className="w-6 h-6"
                />
                {/* Thông tin */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title || 'N/A'}</h3>
                  {contentType === 'video' ? (
                    <p className="text-gray-600 text-sm">Thời lượng: {item.duration ? `${item.duration} phút` : 'N/A'}</p>
                  ) : (
                    <p className="text-gray-600 text-sm">
                      Loại: {documentTypes.find((type) => type.id === item.documentIdType)?.name || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
              {/* Nút hành động */}
              <span className="text-blue-500 text-sm font-medium hover:underline">
                {contentType === 'video' ? 'Xem video' : 'Mở tài liệu'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 0 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {/* Modal cho video */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default ContentList;