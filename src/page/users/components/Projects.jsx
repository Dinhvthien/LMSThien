

import React from 'react';
import ArrowUpRight from '@mui/icons-material/ArrowRightAlt';
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
    title: 'Healthcare App',
    description: 'Ứng dụng quản lý y tế với tính năng đặt lịch khám, quản lý hồ sơ bệnh án, và thông báo.',
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1520&q=80',
    url: '#'
  }
];
export default function Projects() {
 return (
    <section id="projects" className="py-50 bg-mono-100">
      <div className="section-container">
        <h2 className="section-title text-center">Dự án nổi bật</h2>
        <p className="subtitle text-center max-w-2xl mx-auto mb-16">Một số dự án tiêu biểu tôi đã thực hiện trong quá trình làm việc và nghiên cứu.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="project-card group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-mono-700 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="text-xs bg-mono-200 px-2 py-1 rounded text-mono-800">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={project.url} 
                  className="inline-flex items-center text-mono-900 font-medium hover:underline"
                >
                  Xem chi tiết <ArrowUpRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="btn-outline">
            Xem tất cả dự án
          </a>
        </div>
      </div>
    </section>
  );
};