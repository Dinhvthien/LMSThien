import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

export default function About() {
  return (
    <section id="home" className="py-12 sm:py-20">
      <div className="section-container px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in">
            <h1 className="text-center md:text-left text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Đinh Văn Thiện
              <span className="block text-xl sm:text-3xl md:text-4xl text-mono-700 mt-2">
                Developer
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-mono-700 mb-6 sm:mb-8 max-w-lg">
              Lập trình viên chuyên nghiệp với đam mê tạo ra sản phẩm công nghệ
              đột phá, chất lượng cao và trải nghiệm người dùng xuất sắc.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <a href="#contact" className="btn-primary text-sm sm:text-base">
                Liên hệ ngay{" "}
                <ArrowRightAltIcon size={16} className="ml-1 sm:ml-2" />
              </a>
              <a href="#projects" className="btn-outline text-sm sm:text-base">
                Xem dự án
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 sm:border-8 border-mono-200">
              <img
                src="https://i.postimg.cc/2ys3qLpN/Swapfaces-AI-795092e5-5391-4c1d-bc2c-524fde27c8d8.png"
                alt="Đinh Văn Thiện"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
