// src/DocumentPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const DocumentPage = () => {
  const { state } = useLocation();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Xem Tài Liệu</h2>
      <iframe
        src={state.url}
        title="Trình xem tài liệu"
        className="w-full h-[80vh] border rounded-md"
      />
    </div>
  );
};

export default DocumentPage;