import React from 'react';

const skills = [
  { name: 'ASP.NET', icon: '🖥️', description: 'Phát triển các ứng dụng web với ASP.NET MVC và ASP.NET Core, tối ưu hóa hiệu suất và bảo mật.' },
  { name: 'Java', icon: '☕', description: 'Xây dựng ứng dụng enterprise với Spring Boot, microservices và Java EE.' },
  { name: 'JavaScript', icon: '📱', description: 'Phát triển frontend với React, Angular, và các công nghệ JavaScript hiện đại.' },
  { name: 'Automation', icon: '⚙️', description: 'Tự động hóa quy trình phát triển và triển khai với CI/CD, Docker và Kubernetes.' }
];

export default function Experience() {
  return (
    <section id="experience" className="bg-mono-950 text-mono-100 py-12 sm:py-20">
      <div className="section-container px-4 sm:px-6 md:px-12 lg:px-16">
        <h2 className="section-title text-center mb-8 sm:mb-16">Kỹ năng & Công nghệ</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-mono-900 p-4 sm:p-6 rounded-lg border border-mono-800 hover:border-mono-700 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-4">{skill.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{skill.name}</h3>
              <p className="text-mono-400 text-sm sm:text-base">{skill.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-16 pt-6 sm:pt-12 border-t border-mono-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Kinh nghiệm làm việc</h3>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-lg sm:text-xl font-bold">Thực tập tại Solanar</h4>
                  <p className="text-mono-400 text-sm sm:text-base">Công ty Solanar • 2024</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">Phát triển web site blockchain.</p>
                </div>
                
                <div className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-lg sm:text-xl font-bold">Website Thương mại điện tử</h4>
                  <p className="text-mono-400 text-sm sm:text-base">Dự án cá nhân</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">Phát triển web site thương mại điện tử với ASP.NET với mô hình MVC</p>
                </div>
                <div className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-lg sm:text-xl font-bold">E-learning Website</h4>
                  <p className="text-mono-400 text-sm sm:text-base">Dự án cá nhân</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">Phát triển với ngôn ngữ Java Spring Boot 3, React JS và Docker</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">Link web: <a href="https://www.dinhvanthien.shop">dinhvanthien.shop</a></p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Học vấn</h3>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="relative pl-6 sm:pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-lg sm:text-xl font-bold">Cử nhân thực hành Khoa học Máy tính</h4>
                  <p className="text-mono-400 text-sm sm:text-base">Cao đẳng fpt polytechnic • 2021 - 2024</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">Chuyên ngành công nghệ thông tin</p>
                  <p className="mt-1 sm:mt-2 text-mono-300 text-sm">GPA: 7.8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}