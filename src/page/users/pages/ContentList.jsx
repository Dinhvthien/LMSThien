// src/ContentList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoModal from '../components/VideoModal';
import Pagination from '../components/Pagination';

const ContentList = () => {
  const [contentType, setContentType] = useState('video');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // One-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoTypes, setVideoTypes] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchTypes();
    fetchContent(contentType, selectedType, currentPage - 1); // Adjust to 0-based for API
  }, [contentType, selectedType, currentPage]);

  const fetchTypes = async () => {
    try {
      const videoTypesResponse = await axios.get(`${apiUrl}/lms/doc/video-types`);
      const documentTypesResponse = await axios.get(`${apiUrl}/lms/doc/document-types`);
      setVideoTypes(videoTypesResponse.data);
      setDocumentTypes(documentTypesResponse.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại:', error);
    }
  };

  const fetchContent = async (type, typeFilter, page) => {
    try {
      const response = await axios.get(`${apiUrl}/lms/doc/${type}s`, {
        params: { status: 'PUBLIC', page, size: 10, [`${type}Type`]: typeFilter },
      });
      setItems(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy nội dung:', error);
    }
  };

  const handleItemClick = (item) => {
    if (contentType === 'video') {
      setSelectedVideo(item);
    } else {
      if (!item.fileUrl) {
        alert('Không tìm thấy URL tài liệu!');
        return;
      }
      window.open(item.fileUrl, '_blank'); // Mở tài liệu trong tab mới
    }
  };

  return (
    <div className="pt-20 pb-20 max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Bộ lọc ở hàng ngang */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md border font-medium ${
              contentType === 'video' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => {
              setContentType('video');
              setSelectedType('');
              setCurrentPage(1);
            }}
          >
            Video
          </button>
          <button
            className={`px-4 py-2 rounded-md border font-medium ${
              contentType === 'document' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            } transition-colors duration-200`}
            onClick={() => {
              setContentType('document');
              setSelectedType('');
              setCurrentPage(1);
            }}
          >
            Tài liệu
          </button>
        </div>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          {(contentType === 'video' ? videoTypes : documentTypes).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách nội dung dạng card ngang */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Không có dữ liệu</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                {contentType === 'video' && (
                  <p className="text-gray-600">Thời lượng: {item.duration} phút</p>
                )}
              </div>
              {contentType === 'document' && (
                <span className="text-blue-500 text-sm">Mở tài liệu</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Phân trang luôn hiển thị ở dưới cùng */}
      <div className="mt-10">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};

export default ContentList;