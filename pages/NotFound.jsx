import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <h2>404 — Không tìm thấy trang</h2>

      <p>Đường dẫn bạn nhập không tồn tại.</p>

      <Link to="/" className="primary-link">
        Về trang chủ
      </Link>
    </section>
  );
}

export default NotFound;
