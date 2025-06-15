import React from 'react';

const testimonials = [
  {
    content: "Đinh Văn Thiện là một lập trình viên tài năng với khả năng giải quyết vấn đề xuất sắc. Anh ấy đã giúp dự án của chúng tôi hoàn thành đúng thời hạn với chất lượng cao.",
    author: "Nguyễn Văn A",
    title: "CEO, Công ty XYZ"
  },
  {
    content: "Làm việc với Thiện là một trải nghiệm tuyệt vời. Anh ấy không chỉ có kiến thức chuyên môn sâu rộng mà còn rất tận tâm và có trách nhiệm với công việc.",
    author: "Trần Thị B",
    title: "Project Manager, Công ty ABC"
  },
  {
    content: "Thiện là một đồng nghiệp tuyệt vời. Anh ấy luôn sẵn sàng chia sẻ kiến thức và hỗ trợ team khi cần thiết. Code của anh ấy luôn sạch sẽ và dễ bảo trì.",
    author: "Lê Văn C",
    title: "Senior Developer, Công ty DEF"
  }
];

export default function Skills() {
  return (
    <section id="testimonials" className="py-50 bg-mono-200">
      <div className="section-container">
        <h2 className="section-title text-center">Đánh giá từ khách hàng</h2>
        <p className="subtitle text-center max-w-2xl mx-auto mb-16">Những gì khách hàng và đồng nghiệp nói về tôi.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-mono-100 p-8 rounded-lg shadow-sm border border-mono-300 hover:shadow-md transition-all duration-300"
            >
              <svg className="w-10 h-10 text-mono-400 mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.24-.317.55-.502.93-.558.42-.054.84.058 1.26.337.45.296.8.62 1.06.974.15.195.29.37.42.54.3.42.63.76 1 1.01.35.25.77.39 1.25.42v-.04c.27.03.55.05.83.05h.28c0 .66-.23 1.2-.7 1.63-.46.43-1.08.65-1.82.65-.2 0-.39-.01-.58-.04-.37 1.79-.97 2.68-1.8 2.68l-.21-.01c-.14-.02-.24-.12-.28-.3-.03-.2.05-.39.23-.55.84-.36 1.27-1.23 1.27-2.62v-.04Zm7.7 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.24-.317.55-.502.93-.558.42-.054.84.058 1.26.337.45.296.8.62 1.06.974.15.195.29.37.42.54.3.42.63.76 1 1.01.35.25.77.39 1.25.42v-.04c.27.03.55.05.83.05h.28c0 .66-.23 1.2-.7 1.63-.46.43-1.08.65-1.82.65-.2 0-.39-.01-.58-.04-.37 1.79-.97 2.68-1.8 2.68l-.21-.01c-.14-.02-.24-.12-.28-.3-.03-.2.05-.39.23-.55.84-.36 1.27-1.23 1.27-2.62v-.04Z"></path>
              </svg>
              
              <p className="text-mono-800 mb-6">{testimonial.content}</p>
              
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-mono-600 text-sm">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
