import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoModal from '../components/VideoModal';
import Pagination from '../components/Pagination';

const ContentList = () => {
  const [contentType, setContentType] = useState('video'); // Mặc định là video
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // One-based indexing cho UI
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoTypes, setVideoTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(''); // Loại video hoặc tài liệu
  const [search, setSearch] = useState(''); // Thanh tìm kiếm
  const apiUrl = import.meta.env.VITE_API_URL;

  // Tự động tải dữ liệu khi vào trang hoặc khi thay đổi contentType, selectedType, currentPage, search
  useEffect(() => {
    fetchTypes();
    fetchContent(contentType, selectedType, search, currentPage - 1); // Điều chỉnh về 0-based cho API
  }, [contentType, selectedType, search, currentPage]);

  // Lấy danh sách loại video và tài liệu
  const fetchTypes = async () => {
    try {
      const videoTypesResponse = await axios.get(`${apiUrl}/lms/video_types`);
      const documentTypesResponse = await axios.get(`${apiUrl}/lms/document_types`);
      setVideoTypes(videoTypesResponse.data.result || []);
      setDocumentTypes(documentTypesResponse.data.result || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại:', error);
    }
  };

  // Lấy danh sách video hoặc tài liệu
  const fetchContent = async (type, typeFilter, searchQuery, page) => {
    try {
      const response = await axios.get(`${apiUrl}/lms/${type}s`, {
        params: {
          status: 'PUBLIC',
          page,
          size: 10,
          search: searchQuery || undefined,
          [`${type}IdType`]: typeFilter || undefined,
        },
      });
      setItems(response.data.result.content || []);
      setTotalPages(response.data.result.totalPages || 0);
    } catch (error) {
      console.error('Lỗi khi lấy nội dung:', error);
      setItems([]);
      setTotalPages(0);
    }
  };

  // Xử lý khi nhấn vào item
  const handleItemClick = (item) => {
    if (contentType === 'video') {
      setSelectedVideo(item);
    } else {
      if (!item.fileUrl) {
        alert('Không tìm thấy URL tài liệu!');
        return;
      }
      window.open(item.fileUrl, '_blank');
    }
  };

  // Xử lý thay đổi content type
  const handleContentTypeChange = (type) => {
    setContentType(type);
    setSelectedType('');
    setSearch('');
    setCurrentPage(1);
  };

  // Xử lý thay đổi loại video/tài liệu
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý tìm kiếm
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Bộ lọc và tìm kiếm */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Nút chuyển đổi Video/Tài liệu */}
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              contentType === 'video'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => handleContentTypeChange('video')}
          >
            Video
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              contentType === 'document'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
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
          className="w-full sm:w-64 px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Bộ lọc loại */}
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="w-full sm:w-48 px-4 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          {(contentType === 'video' ? videoTypes : documentTypes).map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách nội dung dạng card ngang */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            Không có dữ liệu
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
                {contentType === 'video' ? (
                  <p className="text-gray-600 text-sm">Thời lượng: {item.duration} phút</p>
                ) : (
                  <p className="text-gray-600 text-sm">Loại: {documentTypes.find((type) => type.id === item.documentIdType)?.name || 'N/A'}</p>
                )}
              </div>
              <span className="text-blue-500 text-sm font-medium">
                {contentType === 'video' ? 'Xem video' : 'Mở tài liệu'}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 0 && (
        <div className="mt-8">
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