import { Link } from "react-router-dom";
import { money } from "../data";

export const statusText = {
  awaiting_transfer: "Chưa báo chuyển khoản",
  customer_reported: "Đã báo chuyển · chờ Admin duyệt",
  confirmed: "Admin đã xác nhận tiền",
  completed: "Đã giao hàng / Hoàn tất",
  cancelled: "Đã hủy yêu cầu",
};

export default function Orders({ orders }) {
  return (
    <section className="section">
      <div className="page-heading">
        <div className="eyebrow">FITNESS / ĐƠN HÀNG</div>
        <h1>Đơn hàng của bạn.</h1>
        <p>Theo dõi thông tin đơn đã lưu và trạng thái xử lý từ phòng tập.</p>
      </div>
      {!orders.length ? (
        <div className="empty-state">
          <h2>Chưa có đơn hàng</h2>
          <Link to="/cua-hang" className="button primary">
            Khám phá cửa hàng ↗
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {[...orders].reverse().map((o) => (
            <Link
              className="order-list-item"
              to={"/don-hang/" + o.id}
              key={o.id}
            >
              <div>
                <span className="eyebrow">{o.id}</span>
                <h3>{o.items.map((i) => i.name).join(", ")}</h3>
                <small>
                  {new Date(o.createdAt).toLocaleString("vi-VN")} ·{" "}
                  {o.customer.name}
                </small>
              </div>
              <div>
                <strong>{money(o.total)}</strong>
                <span className={"status-label " + o.status}>
                  {statusText[o.status] || o.status}
                </span>
              </div>
              <span>↗</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
