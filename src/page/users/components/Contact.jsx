import { useState } from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: 'dinhthien18052003@gmail.com',
      time: new Date().toLocaleString('vi-VN') // Thêm thời gian hiện tại
    };

    emailjs
      .send(
        'service_ftmqmc6', // Thay bằng Service ID của bạn
        'template_m06zx4m', // Thay bằng Template ID của bạn
        templateParams,
        'uJPcHBnFgjTFGblFk' // Thay bằng Public Key của bạn
      )
      .then(
        () => {
          toast.success('Tin nhắn đã được gửi thành công!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          setFormData({ name: '', email: '', subject: '', message: '' });
        },
        (error) => {
          toast.error('Lỗi khi gửi tin nhắn, vui lòng thử lại.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          console.error('EmailJS error:', error);
        }
      );
  };

  return (
    <section id="contact" className="bg-mono-100 py-12 sm:py-20">
      <div className="section-container px-4 sm:px-6 md:px-12 lg:px-16">
        <h2 className="section-title text-center">Liên hệ với tôi</h2>
        <p className="subtitle text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          Hãy liên hệ với tôi nếu bạn có nhu cầu hợp tác hoặc muốn trao đổi thêm về các dự án.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          <div className="space-y-6 sm:space-y-8 md:col-span-1">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-mono-900 text-mono-100 p-2 sm:p-3 rounded-full">
                <PhoneIcon fontSize="medium" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-1">Điện thoại</h4>
                <p className="text-mono-700 text-sm sm:text-base">+84 981 790 617</p>
                <p className="text-mono-500 text-xs sm:text-sm mt-1">Liên hệ trong giờ hành chính</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-mono-900 text-mono-100 p-2 sm:p-3 rounded-full">
                <MailIcon fontSize="medium" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-1">Email</h4>
                <p className="text-mono-700 text-sm sm:text-base">dinhthien18052003@gmail.com</p>
                <p className="text-mono-500 text-xs sm:text-sm mt-1">Phản hồi trong vòng 24 giờ</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="bg-mono-900 text-mono-100 p-2 sm:p-3 rounded-full">
                <MessageIcon fontSize="medium" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-semibold mb-1">Zalo</h4>
                <p className="text-mono-700 text-sm sm:text-base">+84 981 790 617</p>
                <p className="text-mono-500 text-xs sm:text-sm mt-1">Trực tuyến hàng ngày</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-mono-50 p-4 sm:p-6 rounded-lg border border-mono-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block mb-1 sm:mb-2 font-medium text-mono-900 text-sm sm:text-base">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="contact-input w-full text-sm sm:text-base"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 sm:mb-2 font-medium text-mono-900 text-sm sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="contact-input w-full text-sm sm:text-base"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block mb-1 sm:mb-2 font-medium text-mono-900 text-sm sm:text-base">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  id="subject"
                  className="contact-input w-full text-sm sm:text-base"
                  placeholder="Nhập tiêu đề"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-1 sm:mb-2 font-medium text-mono-900 text-sm sm:text-base">
                  Nội dung
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="contact-input w-full text-sm sm:text-base"
                  placeholder="Nhập nội dung tin nhắn"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center text-sm sm:text-base">
                Gửi tin nhắn <SendIcon fontSize="small" className="ml-1 sm:ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}