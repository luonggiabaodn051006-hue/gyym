import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { money } from "../data";
import { statusText } from "./Orders";

export default function OrderDetail({ orders, onStatus, sandbox }) {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);
  const [qrError, setQrError] = useState(false);
  const [message, setMessage] = useState("");

  if (!order)
    return (
      <div className="empty-state">
        <h1>Không tìm thấy đơn trên thiết bị này</h1>
        <p>
          Link không chứa dữ liệu đơn. Đơn nằm trong localStorage của trình
          duyệt đã tạo.
        </p>
        <Link to="/don-hang">Về danh sách đơn</Link>
      </div>
    );

  function update(status) {
    const prompt =
      status === "cancelled"
        ? "Chỉ hủy yêu cầu khi bạn chưa chuyển tiền. Thao tác này không hoàn tiền. Tiếp tục?"
        : "Bạn xác nhận đã thực hiện chuyển khoản? Phòng tập sẽ đối chiếu giao dịch.";
    if (!window.confirm(prompt)) return;
    const result = onStatus(order.id, status);
    setMessage(result.message);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(order.id);
      setMessage("Đã sao chép nội dung chuyển khoản.");
    } catch {
      setMessage(
        "Không sao chép tự động được. Hãy chọn mã trong ô và sao chép thủ công.",
      );
    }
  }

  function download() {
    const lines = [
      "FITNESS — THÔNG TIN ĐƠN HÀNG",
      "Mã: " + order.id,
      "Ngày: " + new Date(order.createdAt).toLocaleString("vi-VN"),
      "Tên: " + order.customer.name,
      "Điện thoại: " + order.customer.phone,
      ...order.items.map(
        (i) =>
          i.name + " × " + i.quantity + " = " + money(i.price * i.quantity),
      ),
      "Tổng: " + money(order.total),
      "Nội dung chuyển khoản: " + order.id,
      "Trạng thái: " + (statusText[order.status] || order.status),
      "Ghi chú: " + (order.customer.note || ""),
    ];
    const url = URL.createObjectURL(
      new Blob(["\ufeff" + lines.join("\n")], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = order.id + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="section">
      <Link to="/don-hang" className="text-link">
        ← Đơn hàng
      </Link>
      <div className="page-heading">
        <div className="eyebrow">THÔNG TIN ĐƠN HÀNG</div>
        <h1>{order.id}</h1>
        <span className={"status-label " + order.status}>
          {statusText[order.status] || order.status}
        </span>
      </div>

      {message && (
        <Alert severity="info" sx={{ mb: 2.5 }}>
          {message}
        </Alert>
      )}

      <div className="checkout-grid">
        <div className="form-panel">
          <h2>{order.customer.name}</h2>
          <p>{order.customer.phone}</p>
          {order.items.map((i, index) => (
            <div className="summary-row" key={index}>
              <span>
                {i.name} × {i.quantity}
              </span>
              <strong>{money(i.price * i.quantity)}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>Tổng cộng</span>
            <strong>{money(order.total)}</strong>
          </div>
          <label>
            Nội dung chuyển khoản
            <input readOnly value={order.id} />
          </label>
          <div className="button-row">
            <button onClick={copy}>Sao chép mã</button>
            <button onClick={download}>Tải thông tin đơn</button>
          </div>
          {order.customer.note && <p>Ghi chú: {order.customer.note}</p>}

          {order.status === "awaiting_transfer" && !sandbox && (
            <div className="button-row">
              <button
                className="primary"
                onClick={() => update("customer_reported")}
              >
                Tôi đã chuyển khoản
              </button>
              <button
                className="text-button danger"
                onClick={() => update("cancelled")}
              >
                Hủy yêu cầu
              </button>
            </div>
          )}

          {order.status === "customer_reported" && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info">
                Đã ghi nhận thông báo chuyển khoản. Phòng tập đang đối chiếu và
                xác nhận giao dịch của bạn.
              </Alert>
            </Box>
          )}

          {order.status === "confirmed" && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Phòng tập đã xác nhận thanh toán. Bạn có thể nhận đồ / bắt đầu
                tập tại quầy lễ tân FITNESS Studio.
              </Alert>
            </Box>
          )}

          {order.status === "completed" && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="success">
                Đơn hàng đã hoàn tất bàn giao. Cảm ơn bạn đã đồng hành cùng
                FITNESS Studio!
              </Alert>
            </Box>
          )}
        </div>

        <aside className="qr-panel">
          <h2>Chuyển khoản ngân hàng</h2>
          {sandbox ? (
            <p>Thoát Sandbox để dùng QR nhận tiền thật.</p>
          ) : order.status === "cancelled" ? (
            <p>Yêu cầu đã hủy. Không chuyển tiền theo yêu cầu này.</p>
          ) : (
            <>
              {qrError ? (
                <div className="qr-missing">
                  <strong>Chưa có ảnh QR nhận tiền</strong>
                  <p>
                    Chủ phòng tập cần thêm ảnh QR vào{" "}
                    <code>public/images/qr-thanh-toan.png</code>.
                  </p>
                </div>
              ) : (
                <img
                  className="qr-image"
                  src="/images/qr-thanh-toan.png"
                  alt="Mã QR ngân hàng nhận thanh toán"
                  onError={() => setQrError(true)}
                />
              )}
              <ol>
                <li>Quét mã trong ứng dụng ngân hàng.</li>
                <li>Kiểm tra đúng tài khoản và tên người nhận.</li>
                <li>
                  Nhập số tiền <b>{money(order.total)}</b>.
                </li>
                <li>
                  Nhập nội dung <b>{order.id}</b>.
                </li>
                <li>Kiểm tra lại rồi xác nhận trong ứng dụng ngân hàng.</li>
              </ol>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
