<div align="center">

# 🎨 Discord Animated Status Selfbot

<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-yellow.svg" />


**Selfbot Discord với giao diện Web đẹp mắt và đầy đủ tính năng**

[English](README.md) | [Tiếng Việt](README_VI.md)

[Tính năng](#-tính-năng) • [Cài đặt](#-cài-đặt) • [Sử dụng](#-sử-dụng) • [API](#-api) • [FAQ](#-faq)

</div>

---

## ⚠️ Cảnh báo

**Sử dụng selfbot vi phạm Điều khoản Dịch vụ của Discord.** Tài khoản của bạn có thể bị cấm. Sử dụng với rủi ro của riêng bạn. Dự án này chỉ nhằm mục đích giáo dục.

---

## ✨ Tính năng

### 🎯 Tính năng chính
- 🎨 **Giao diện Web đẹp mắt** - Theme tối hiện đại với hiệu ứng glow
- 🔄 **Tự động xoay Status** - Tự động thay đổi custom status của bạn
- 💎 **Hỗ trợ Custom Emoji** - Sử dụng emoji từ bất kỳ server nào bạn tham gia
- 💻 **JavaScript Eval** - Status động với code JavaScript (đồng hồ, bộ đếm, v.v.)
- 🎵 **Hỗ trợ Lyrics** - Hoàn hảo cho lời bài hát
- ⚡ **Cập nhật Real-time** - Hiển thị trạng thái trực tiếp trên Web UI

### 📦 Tính năng quản lý
- 💾 **Export/Import** - Chia sẻ animations giữa các tài khoản
- 📤 **Bulk Operations** - Export/Import tất cả animations cùng lúc
- 📋 **Quick Share** - Copy/Paste animations qua clipboard
- 🗂️ **MongoDB Storage** - Lưu trữ animation lâu dài
- 🔧 **Full API** - RESTful API cho advanced usage

### 🎨 Tính năng UI
- 🌟 **Hiệu ứng Glow** - Glow theo chuột trên cards
- 📱 **Responsive Design** - Hoạt động trên desktop và mobile
- 🎭 **Animations mượt mà** - Transitions đẹp mắt
- 🎨 **Modern Design** - Giao diện clean và chuyên nghiệp

---

## 🚀 Cài đặt

### Yêu cầu

- [Node.js](https://nodejs.org/) v16 trở lên
- [MongoDB](https://www.mongodb.com/) (local hoặc Atlas)
- Discord user token

### Bắt đầu nhanh

1. **Clone repository**
- git clone https://github.com/dnaptdpt/discord-animated-status.git
- cd discord-animated-status

2. **Cài đặt dependencies**
- npm install

3. **Cấu hình môi trường**
- cp .env.example .env
- Chỉnh sửa .env với Discord token của bạn

4. **Khởi động MongoDB** (nếu dùng local)
- mongod

5. **Chạy bot**
- npm start

6. **Mở Web UI**
- http://localhost:3000

### Lấy Discord Token

> ⚠️ **Không bao giờ chia sẻ token với ai!**

1. Mở Discord (Web hoặc Desktop)
2. Nhấn `F12` để mở DevTools
3. Vào tab **Console** → **Application** → **Local Storage** → https://discord.com → Filter (Token) → Ctrl + Shift + M
4. Copy token (giữ kín!)

---

## 🎯 Best Practices

### Sử dụng an toàn

1. **Dùng interval hợp lý**: Tối thiểu 5-10 giây
2. **Không spam**: Discord có rate limit (~30 thay đổi/phút)
3. **Dùng VPN**: Thêm lớp bảo vệ privacy
4. **Tài khoản phụ**: Đừng dùng trên tài khoản chính
5. **Theo dõi**: Check console để phát hiện lỗi

### Tips tối ưu hiệu suất

1. **Code đơn giản**: Giữ JavaScript eval đơn giản và hiệu quả
2. **Số lượng Frames**: 10-30 frames là tối ưu
3. **Interval**: 5-10 giây được khuyến nghị
4. **MongoDB**: Sử dụng indexes cho queries nhanh hơn
5. **Trình duyệt**: Dùng Chrome/Edge để UI hoạt động tốt nhất

---

## 🐛 Xử lý sự cố

### Bot không kết nối
- Kiểm tra xem token có đúng trong `.env` không
- Đảm bảo bạn không đăng nhập ở nơi khác
- Token có thể đã hết hạn - lấy token mới

### Emoji không load
- Acc phải ở trong servers có những emoji đó
- Kiểm tra xem emoji còn tồn tại không
- Thử refresh lại trang
- Phải có nitro

### Animation không start
- Đảm bảo ít nhất một frame có text
- Kiểm tra interval tối thiểu (2900ms)
- Xác minh kết nối MongoDB

### Bị Rate Limited
- Tăng interval giữa các frames
- Giới hạn Discord: ~30 thay đổi mỗi phút
- Dùng interval >= 5000ms

### Status không hiển thị
- Status chỉ hiển thị cho người khác
- Kiểm tra từ tài khoản khác
- Có thể mất vài giây để cập nhật

---

## 🤝 Đóng góp

Rất hoan nghênh đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/TinhNangTuyetVoi`)
3. Commit thay đổi (`git commit -m 'Thêm TinhNangTuyetVoi'`)
4. Push lên branch (`git push origin feature/TinhNangTuyetVoi`)
5. Mở Pull Request

---

## 📝 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem file [LICENSE](LICENSE) để biết chi tiết.

---

## 👨‍💻 Tác giả

**Alex Do**

- GitHub: [@dnaptdpt](https://github.com/dnaptdpt)
- Discord: Alexdo199

---

## 🙏 Cảm ơn

- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) - Thư viện Discord selfbot
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- Lấy cảm hứng từ [BetterDiscord Animated Status](https://github.com/toluschr/BetterDiscord-Animated-Status)

---

## 🔒 Bảo mật

- Không bao giờ chia sẻ token của bạn
- Dùng `.env` cho dữ liệu nhạy cảm
- Không commit `.env` vào git
- Dùng mật khẩu MongoDB mạnh
- Chỉ chạy trên mạng tin cậy

---

## 💡 FAQ

### Bot có an toàn không?
Sử dụng selfbot vi phạm ToS của Discord. Dùng với rủi ro của bạn.

### Có thể dùng trên Heroku không?
Có, nhưng cần cấu hình thêm cho MongoDB Atlas và environment variables.

### Tại sao status không hiển thị?
Status của selfbot chỉ hiển thị cho người khác, không hiển thị cho chính bạn.

### Interval tối thiểu là bao nhiêu?
2900ms là an toàn, nhưng khuyến nghị >= 5000ms để tránh rate limit.

### Có thể import lyrics từ file text không?
Hiện tại chưa, nhưng bạn có thể copy-paste hoặc dùng feature import JSON.

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Đọc phần [Xử lý sự cố](#-xử-lý-sự-cố)
2. Kiểm tra console để tìm lỗi
3. Xác minh kết nối MongoDB
4. Kiểm tra Discord token

---
## 📝 Giấy phép

Dự án này được cấp phép theo **Giấy phép MIT**.

### Điều này có nghĩa là gì?

✅ **Bạn CÓ THỂ:**
- Sử dụng cho mục đích thương mại
- Chỉnh sửa
- Phân phối
- Sử dụng riêng tư

❌ **Bạn KHÔNG THỂ:**
- Buộc tác giả phải chịu trách nhiệm pháp lý

⚠️ **Bạn PHẢI:**
- Bao gồm thông tin bản quyền
- Bao gồm giấy phép

### Văn bản Giấy phép Đầy đủ

- Giấy phép MIT

Bản quyền (c) 2025 Alex Do

Cho phép miễn phí cho bất kỳ người nào có được bản sao của phần mềm này
và các tệp tài liệu liên quan (gọi chung là "Phần mềm"), được phép sử dụng
Phần mềm không bị hạn chế, bao gồm nhưng không giới hạn các quyền sử dụng,
sao chép, sửa đổi, hợp nhất, xuất bản, phân phối, cấp phép lại và/hoặc bán
các bản sao của Phần mềm, và cho phép những người được cung cấp Phần mềm
được phép làm như vậy, với các điều kiện sau:

Thông báo bản quyền ở trên và thông báo cho phép này phải được bao gồm
trong tất cả các bản sao hoặc phần quan trọng của Phần mềm.

PHẦN MÊM ĐƯỢC CUNG CẤP "NGUYÊN TRẠNG", KHÔNG CÓ BẢO HÀNH DƯỚI BẤT KỲ HÌNH
THỨC NÀO, RÕ RÀNG HAY NGỤ Ý, BAO GỒM NHƯNG KHÔNG GIỚI HẠN ĐẾN CÁC BẢO HÀNH
VỀ KHẢ NĂNG THƯƠNG MẠI, SỰ PHÙ HỢP CHO MỤC ĐÍCH CỤ THỂ VÀ KHÔNG VI PHẠM.
TRONG BẤT KỲ TRƯỜNG HỢP NÀO, CÁC TÁC GIẢ HOẶC CHỦ SỞ HỮU BẢN QUYỀN KHÔNG
CHỊU TRÁCH NHIỆM ĐỐI VỚI BẤT KỲ KHIẾU NẠI, THIỆT HẠI HOẶC TRÁCH NHIỆM PHÁP LÝ
NÀO KHÁC, DÙ TRONG HÀNH ĐỘNG HỢP ĐỒNG, DO LỖI HOẶC THEO CÁCH KHÁC, PHÁT SINH
TỪ, NGOÀI HOẶC LIÊN QUAN ĐẾN PHẦN MỀM HOẶC VIỆC SỬ DỤNG HOẶC CÁC GIAO DỊCH
KHÁC TRONG PHẦN MỀM.

Xem file [LICENSE](LICENSE) để biết chi tiết đầy đủ.


<div align="center">

### Được tạo với ❤️ bởi Alex Do

**⚠️ Nhớ: Sử dụng có trách nhiệm và tự chịu rủi ro!**

[⬆ Về đầu trang](#-discord-animated-status-selfbot)

</div>
