# FITNESS — Cửa hàng & Quản lý Phòng tập (ReactJS)

Dự án ReactJS + Vite hoàn chỉnh tích hợp toàn bộ kiến thức học phần cùng trợ lý ChatBot:
- **Trợ lý ChatBot nổi góc phải** (`src/components/ChatBot.jsx` + `askFitnessAssistant` trong `src/services/api.js`):
  - Tư vấn gói tập (`Basic`, `Plus`, `Pro`), báo giá dụng cụ, tra cứu lịch lớp và hỗ trợ **thêm sản phẩm trực tiếp vào giỏ hàng** ngay trong khung chat.
  - Chạy mượt ngay lập tức bằng dữ liệu Studio tích hợp sẵn, đồng thời hỗ trợ kết nối **Gemini 2.5 Flash API** qua nút Cài đặt (⚙️) hoặc biến môi trường `VITE_GEMINI_API_KEY`.
- **React Context API + `useReducer`** (`src/context/AppContext.jsx`): Quản lý Theme Sáng/Tối toàn cục, Thông báo Snackbar, và dữ liệu động lực từ API.
- **React Router DOM v7** (`src/App.jsx`): Điều hướng đa trang, Dynamic Route (`/cua-hang/:id`, `/don-hang/:id`), Query Params (`useSearchParams`), `Navigate`, trang 404.
- **CSS Modules & Material UI v7** (`src/theme/fitnessTheme.js`, `src/components/ApiMotivationBanner.module.css`, MUI `AppBar`, `Drawer`, `Grid`, `Table`, `Card`, `Pagination`, `Snackbar`, `ThemeProvider`).
- **React Hook Form + Yup Validation** (`src/pages/Checkout.jsx`, `src/pages/Contact.jsx`, `src/components/MemberList.jsx`): Kiểm tra dữ liệu đầu vào chặt chẽ bằng schema Yup.
- **REST API với Axios** (`src/services/api.js`):
  - `GET https://dummyjson.com/quotes?limit=3` (kèm fallback offline).
  - `POST https://jsonplaceholder.typicode.com/posts` khi tạo đơn hàng hoặc gửi form tư vấn PT.
  - `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent` cho ChatBot AI.

## Hướng dẫn chạy dự án

```bash
cd fitness-shop
npm install
npm run dev
```
