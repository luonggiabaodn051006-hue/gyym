import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ChatBot from "./ChatBot";

export default function UserLayout({
  cartCount,
  sandbox,
  storageError,
  onResetSandbox,
  onToggleSandbox,
  products,
  classes,
  onAdd,
}) {
  return (
    <>
      <Header cartCount={cartCount} products={products} />
      <main className="main-content">
        {sandbox && (
          <p className="sandbox-banner" role="status">
            SANDBOX · Dữ liệu thử, không ghi vào localStorage. Thanh toán thật
            đang tắt.
          </p>
        )}
        {!sandbox && storageError && (
          <p className="error-banner" role="alert">
            {storageError}
          </p>
        )}
        <Outlet />
      </main>
      <Footer
        sandbox={sandbox}
        onResetSandbox={onResetSandbox}
        onToggleSandbox={onToggleSandbox}
      />
      <ChatBot products={products} classes={classes} onAdd={onAdd} />
    </>
  );
}
