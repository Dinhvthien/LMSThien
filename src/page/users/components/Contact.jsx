import PhoneIcon from '@mui/icons-material/Phone';
import MailIcon from '@mui/icons-material/Mail';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
export default function Contact() {
return (
    <section id="contact" className="bg-mono-100 py-50">
      <div className="section-container">
        <h2 className="section-title text-center">Liên hệ với tôi</h2>
        <p className="subtitle text-center max-w-2xl mx-auto mb-16">Hãy liên hệ với tôi nếu bạn có nhu cầu hợp tác hoặc muốn trao đổi thêm về các dự án.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div className="space-y-8 md:col-span-1">
            <div className="flex items-start space-x-4">
              <div className="bg-mono-900 text-mono-100 p-3 rounded-full">
                <PhoneIcon size={20}></PhoneIcon>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Điện thoại</h4>
                <p className="text-mono-700">+84 981 790 617</p>
                <p className="text-mono-500 text-sm mt-1">Liên hệ trong giờ hành chính</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-mono-900 text-mono-100 p-3 rounded-full">
                <MailIcon size={20}></MailIcon>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Email</h4>
                <p className="text-mono-700">dinhthien18052003@gmail.com</p>
                <p className="text-mono-500 text-sm mt-1">Phản hồi trong vòng 24 giờ</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-mono-900 text-mono-100 p-3 rounded-full">
                <MessageIcon size={20}></MessageIcon>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1">Zalo</h4>
                <p className="text-mono-700">+84 981 790 617</p>
                <p className="text-mono-500 text-sm mt-1">Trực tuyến hàng ngày</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <form className="space-y-6 bg-mono-50 p-8 rounded-lg border border-mono-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium text-mono-900">Họ và tên</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="contact-input" 
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium text-mono-900">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="contact-input" 
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block mb-2 font-medium text-mono-900">Tiêu đề</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="contact-input" 
                  placeholder="Nhập tiêu đề"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 font-medium text-mono-900">Nội dung</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="contact-input" 
                  placeholder="Nhập nội dung tin nhắn"
                ></textarea>
              </div>
              
              <button type="submit" className="btn-primary w-full flex items-center justify-center">
                Gửi tin nhắn <SendIcon size={16} className="ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};