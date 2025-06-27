import React from 'react';

const testimonials = [
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "This is a great service! Highly recommend to everyone."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Amazing experience, very professional team."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Outstanding quality and support."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Exceptional service, exceeded expectations."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Highly reliable and professional."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Fantastic work, highly satisfied."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Impressive results, great team."
  },
  { 
    video: "https://www.youtube.com/embed/81Ub0SMxZQo", 
    author: "Nguyen van a", 
    title: "Giám đốc A", 
    image: "https://photo.znews.vn/w660/Uploaded/wohaahp/2021_04_11/Nguoi_mau_nam_noi_tieng_moi_thoi_dai_11.jpg",
    content: "Top-notch service, will use again."
  },
];

export default function Skills() {
  return (
    <section id="testimonials" className="py-12 sm:py-20 bg-gray-100">
      <div className="section-container px-4 sm:px-6 md:px-12 lg:px-16">
        <h2 className="section-title text-center text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Đánh giá nơi thực tập
        </h2>
        <p className="subtitle text-center max-w-2xl mx-auto mb-6 sm:mb-16 text-gray-600 text-lg">
          Những gì nơi thực tập nói về tôi.
        </p>
        
        <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hidden pb-4">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] snap-center"
            >
              <div className="video-container mb-4 relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={testimonial.video}
                  title={`Testimonial ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">{testimonial.title}</p>
                </div>
              </div>
              
              <svg 
                className="w-6 h-6 sm:w-10 sm:h-10 text-gray-400 mb-2 sm:mb-4" 
                fill="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.24-.317.55-.502.93-.558.42-.054.84.058 1.26.337.45.296.8.62 1.06.974.15.195.29.37.42.54.3.42.63.76 1 1.01.35.25.77.39 1.25.42v-.04c.27.03.55.05.83.05h.28c0 .66-.23 1.2-.7 1.63-.46.43-1.08.65-1.82.65-.2 0-.39-.01-.58-.04-.37 1.79-.97 2.68-1.8 2.68l-.21-.01c-.14-.02-.24-.12-.28-.3-.03-.2.05-.39.23-.55.84-.36 1.27-1.23 1.27-2.62v-.04Zm7.7 0c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.626.41-2.032.24-.317.55-.502.93-.558.42-.054.84.058 1.26.337.45.296.8.62 1.06.974.15.195.29.37.42.54.3.42.63.76 1 1.01.35.25.77.39 1.25.42v-.04c.27.03.55.05.83.05h.28c0 .66-.23 1.2-.7 1.63-.46.43-1.08.65-1.82.65-.2 0-.39-.01-.58-.04-.37 1.79-.97 2.68-1.8 2.68l-.21-.01c-.14-.02-.24-.12-.28-.3-.03-.2.05-.39.23-.55.84-.36 1.27-1.23 1.27-2.62v-.04Z"></path>
              </svg>
              
              <p className="text-gray-800 text-sm sm:text-base mb-4 sm:mb-6 line-clamp-3">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}