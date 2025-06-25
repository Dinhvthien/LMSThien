import React from 'react';

const skills = [
  {
    name: 'ASP.NET',
    icon: '🖥️',
    description: 'Phát triển các ứng dụng web với ASP.NET MVC và ASP.NET Core, tối ưu hóa hiệu suất và bảo mật.'
  },
  {
    name: 'Java',
    icon: '☕',
    description: 'Xây dựng ứng dụng enterprise với Spring Boot, microservices và Java EE.'
  },
  {
    name: 'JavaScript',
    icon: '📱',
    description: 'Phát triển frontend với React, Angular, và các công nghệ JavaScript hiện đại.'
  },
  {
    name: 'Automation',
    icon: '⚙️',
    description: 'Tự động hóa quy trình phát triển và triển khai với CI/CD, Docker và Kubernetes.'
  }
];
export default function Experience() {
return (
    <section id="experience" className="bg-mono-950 text-mono-100 py-50 ">
      <div className="section-container">
        <h2 className="section-title text-center mb-16">Kỹ năng & Công nghệ</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="bg-mono-900 p-6 rounded-lg border border-mono-800 hover:border-mono-700 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="text-3xl mb-4">{skill.icon}</div>
              <h3 className="text-xl font-bold mb-3">{skill.name}</h3>
              <p className="text-mono-400">{skill.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 pt-12 border-t border-mono-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Kinh nghiệm làm việc</h3>
              
              <div className="space-y-8">
                <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-xl font-bold">Thực tập tại solanar</h4>
                  <p className="text-mono-400">Công ty Solanar • 2024</p>
                  <p className="mt-2 text-mono-300">Phát triển web site block chain.</p>
                </div>
                
                <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-xl font-bold">Website Thương mại điện tử</h4>
                  <p className="text-mono-400">Dự án cá nhân</p>
                  <p className="mt-2 text-mono-300">Phát triển web site thương mại điện từ với asp.net với mô hình MVC</p>
                </div>
                                <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-xl font-bold">E-learning Website</h4>
                  <p className="text-mono-400">Dự án cá nhân</p>
                  <p className="mt-2 text-mono-300">Phát triển với ngôn ngữ java spring boot 3, react js và docker</p>
                  <p className="mt-2 text-mono-300"> Link web: <a href="https://www.dinhvanthien.shop">dinhvanthien.shop</a></p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Học vấn</h3>
              
              <div className="space-y-8">
                <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-xl font-bold">Thạc sĩ Khoa học Máy tính</h4>
                  <p className="text-mono-400">Đại học ABC • 2016 - 2018</p>
                  <p className="mt-2 text-mono-300">Chuyên ngành Trí tuệ nhân tạo và Học máy.</p>
                </div>
                
                <div className="relative pl-8 before:absolute before:left-0 before:top-1 before:h-full before:w-0.5 before:bg-mono-700">
                  <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-mono-100 -translate-x-[3px]"></div>
                  <h4 className="text-xl font-bold">Cử nhân Kỹ thuật Phần mềm</h4>
                  <p className="text-mono-400">Đại học XYZ • 2012 - 2016</p>
                  <p className="mt-2 text-mono-300">Tốt nghiệp loại Giỏi, GPA 3.8/4.0.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};