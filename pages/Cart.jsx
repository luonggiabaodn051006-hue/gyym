import { Link } from "react-router-dom";
import { money } from "../data";
import { getCartLines, orderTotal } from "../shopLogic";
import ProductArt from "../components/ProductArt";

export default function Cart({ products, cart, onQuantity, sandbox }) {
  const lines = getCartLines(cart, products);
  if (!lines.length)
    return (
      <div className="empty-state">
        <div className="eyebrow">GIỎ HÀNG CỦA BẠN</div>
        <h1>Chưa có món đồ nào.</h1>
        <p>Khám phá những vật dụng cho buổi tập tiếp theo.</p>
        <Link to="/cua-hang" className="button primary">
          Ghé cửa hàng ↗
        </Link>
      </div>
    );
  return (
    <section className="section">
      <div className="page-heading">
        <div className="eyebrow">FITNESS / GIỎ HÀNG</div>
        <h1>Sẵn sàng cho buổi tập.</h1>
        <p>
          {lines.reduce((n, p) => n + p.quantity, 0)} sản phẩm trong giỏ hàng
        </p>
      </div>
      <div className="checkout-grid">
        <div className="cart-items">
          {lines.map((p) => (
            <article className="cart-item" key={p.id}>
              <Link to={"/cua-hang/" + p.id}>
                <ProductArt product={p} />
              </Link>
              <div className="cart-item-info">
                <Link to={"/cua-hang/" + p.id}>
                  <h3>{p.name}</h3>
                </Link>
                <p>{money(p.price)}</p>
                <div className="quantity-control">
                  <button
                    aria-label={"Giảm số lượng " + p.name}
                    onClick={() => onQuantity(p.id, p.quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-label="Số lượng">{p.quantity}</span>
                  <button
                    aria-label={"Tăng số lượng " + p.name}
                    disabled={p.quantity >= (p.maxQuantity || 10)}
                    onClick={() => onQuantity(p.id, p.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-end">
                <strong>{money(p.subtotal)}</strong>
                <button
                  className="text-button danger"
                  onClick={() => onQuantity(p.id, 0)}
                  aria-label={"Xóa " + p.name + " khỏi giỏ"}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="order-summary">
          <div className="eyebrow">TÓM TẮT GIỎ HÀNG</div>
          <h2>Thông tin thanh toán</h2>
          <div className="summary-row">
            <span>Tạm tính</span>
            <strong>{money(orderTotal(lines))}</strong>
          </div>
          <div className="summary-row">
            <span>Hình thức nhận</span>
            <span>Tại phòng tập</span>
          </div>
          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong>{money(orderTotal(lines))}</strong>
          </div>
          {sandbox ? (
            <p className="notice">
              Thoát Sandbox để tạo đơn và mở QR nhận tiền.
            </p>
          ) : (
            <Link className="button primary full-width" to="/thanh-toan">
              Tiếp tục thanh toán →
            </Link>
          )}
          <Link className="continue-link" to="/cua-hang">
            Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </section>
  );
}
