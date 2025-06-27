import React, { useState } from 'react';
import ArrowUpRight from '@mui/icons-material/ArrowRightAlt';

// Dữ liệu dự án
const projects = [
  { 
    title: 'E-Commerce Platform', 
    description: 'Nền tảng thương mại điện tử với tính năng giỏ hàng, thanh toán, và quản lý đơn hàng.', 
    technologies: ['ASP.NET Core', 'React', 'SQL Server'], 
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80', 
    url: '#' 
  },
  { 
    title: 'Quản lý Dự án', 
    description: 'Ứng dụng quản lý dự án với tính năng phân công công việc, theo dõi tiến độ, và báo cáo.', 
    technologies: ['Java', 'Spring Boot', 'Angular'], 
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80', 
    url: '#' 
  },
  { 
    title: 'Website Quản lý học tập', 
    description: 'Website LMS (Hệ thống quản lý học tập) là nền tảng trực tuyến hỗ trợ việc tạo, quản lý và theo dõi các khóa học.', 
    technologies: ['React Native', 'Node.js', 'MongoDB'], 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80', 
    url: '#' 
  }
];

// Component Modal
const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 sm:p-8 max-w-lg md:max-w-2xl w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">{project.title}</h3>
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span key={i} className="text-sm bg-gray-200 px-2 py-1 rounded text-gray-800">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="py-12 sm:py-20 bg-gray-100">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Dự án nổi bật
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 text-gray-600 text-lg">
          Một số dự án tiêu biểu tôi đã thực hiện trong quá trình làm việc và nghiên cứu.
        </p>
        
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] pb-4 [&::-webkit-scrollbar]:hidden">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] snap-center"
            >
              <div className="aspect-[16/9] overflow-hidden rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-200 mt-2">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{project.title}</h3>
                <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs sm:text-sm bg-gray-200 px-2 py-1 rounded text-gray-800">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleOpenModal(project)}
                  className="inline-flex items-center text-gray-900 font-medium text-sm sm:text-base hover:underline"
                >
                  Xem chi tiết <ArrowUpRight fontSize="small" className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
}