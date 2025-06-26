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
  if (url.includes('youtube.com/embed/')) {
    console.log('URL already in embed format:', url);
    return url;
  }
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
  <div className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 animate-pulse mb-2 sm:mb-3">
    <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16"></div>
  </div>
);

const ContentList = () => {
  const [contentType, setContentType] = useState('video');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoTypes, setVideoTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchContent = async (type, typeFilter, searchQuery, page) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/lms/${type}s`, {
        params: {
          status: 'PUBLIC',
          page,
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

  const debouncedSearch = useCallback(
    debounce((type, typeFilter, query) => {
      fetchContent(type, typeFilter, query, 0);
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchTypes();
    fetchContent(contentType, selectedType, search, currentPage - 1);
  }, [contentType, selectedType, currentPage]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedSearch(contentType, selectedType, query);
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSelectedType('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

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
    <div className="pt-4 sm:pt-20 pb-4 sm:pb-20 max-w-7xl mx-auto px-2 sm:px-6 bg-gray-100 min-h-screen">
      <h1 className="text-lg sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-6">
        {contentType === 'video' ? 'Danh sách Video' : 'Danh sách Tài liệu'}
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-2 sm:mb-6 space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-2 sm:p-3 rounded-lg shadow-sm">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
              contentType === 'video'
                ? 'bg-[#F9A825] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleContentTypeChange('video')}
          >
            Video
          </button>
          <button
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md font-semibold text-xs sm:text-sm transition-all duration-200 ${
              contentType === 'document'
                ? 'bg-[#F9A825] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleContentTypeChange('document')}
          >
            Tài liệu
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder={`Tìm kiếm ${contentType === 'video' ? 'video' : 'tài liệu'}...`}
          className="w-full sm:w-60 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />

        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full sm:w-44 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        >
          <option value="">Tất cả</option>
          {(contentType === 'video' ? videoTypes : documentTypes).map((type) => (
            <option key={type.id} value={type.id}>
              {type.name || 'N/A'}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-red-100 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2 sm:space-y-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <ItemSkeleton key={index} />
          ))
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-2 sm:py-6 text-sm">
            Không tìm thấy {contentType === 'video' ? 'video' : 'tài liệu'}.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center space-x-1 sm:space-x-3 flex-1 max-w-[80%] sm:max-w-[85%]">
                <img
                  src={contentType === 'video' ? YOUTUBE_LOGO : DRIVE_LOGO}
                  alt={contentType === 'video' ? 'YouTube' : 'Google Drive'}
                  className="w-5 h-5 sm:w-6 h-6"
                />
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate overflow-hidden line-clamp-2">
                    {item.title || 'N/A'}
                  </h3>
                  {contentType === 'video' ? (
                    <p className="text-gray-600 text-xs sm:text-sm truncate">
                      Thời lượng: {item.duration ? `${item.duration} phút` : 'N/A'}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-xs sm:text-sm truncate">
                      Loại: {documentTypes.find((type) => type.id === item.documentIdType)?.name || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="text-[#F9A825] text-xs sm:text-sm font-medium hover:underline"
                onClick={() => handleItemClick(item)}
              >
                {contentType === 'video' ? 'Xem video' : 'Mở tài liệu'}
              </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 0 && (
        <div className="mt-2 sm:mt-6 flex justify-center">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default ContentList;