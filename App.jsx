import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Alert, CssBaseline, Snackbar, ThemeProvider } from "@mui/material";
import UserLayout from "./components/UserLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Packages from "./pages/Packages";
import Schedule from "./pages/Schedule";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Contact from "./pages/Contact";
import AdminPortal from "./pages/AdminPortal";
import NotFound from "./pages/NotFound";
import {
  changeQuantity,
  getCheckoutLines,
  orderTotal,
  validateCustomer,
} from "./shopLogic";
import {
  readLocalData,
  writeLocalData,
  writeShopData,
  createSampleData,
} from "./storage";
import { AppProvider, useAppContext } from "./context/AppContext";
import { createFitnessTheme } from "./theme/fitnessTheme";
import "./App.css";

function FitnessShell() {
  const { themeMode, toast, closeToast } = useAppContext();
  const theme = useMemo(() => createFitnessTheme(themeMode), [themeMode]);

  const [initial] = useState(readLocalData);
  const [data, setData] = useState(initial.data);
  const [storageError, setStorageError] = useState(initial.error);
  const [sandbox, setSandbox] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [viewVersion, setViewVersion] = useState(0);

  // Ghi dữ liệu vào localStorage
  useEffect(() => {
    if (sandbox || initial.error) return;
    try {
      writeLocalData(data);
      setStorageError("");
    } catch {
      setStorageError(
        "Không lưu được dữ liệu. Thay đổi có thể mất khi tải lại trang.",
      );
    }
  }, [data, sandbox, initial.error]);

  // Đồng bộ real-time giữa 2 tab (tab Web chính http://localhost:5173/ và tab Web Admin http://localhost:5173/admin)
  useEffect(() => {
    function handleStorageSync(event) {
      if (sandbox || !event.key || !event.key.startsWith("fitness-")) return;
      const latest = readLocalData();
      if (!latest.error) {
        setData(latest.data);
      }
    }
    window.addEventListener("storage", handleStorageSync);
    return () => window.removeEventListener("storage", handleStorageSync);
  }, [sandbox]);

  function setProducts(update) {
    setData((previous) => {
      const products =
        typeof update === "function" ? update(previous.products) : update;
      return {
        ...previous,
        products,
        cart: previous.cart.filter((item) =>
          products.some((p) => p.id === item.productId),
        ),
      };
    });
  }

  function setClasses(update) {
    setData((previous) => {
      const classes =
        typeof update === "function" ? update(previous.classes) : update;
      return {
        ...previous,
        classes,
        bookings: previous.bookings.filter((b) =>
          classes.some((c) => c.id === b.classId),
        ),
      };
    });
  }

  function setConsultations(update) {
    setData((previous) => ({
      ...previous,
      consultations:
        typeof update === "function" ? update(previous.consultations) : update,
    }));
  }

  function handleAddConsultation(item) {
    setConsultations((prev) => [...prev, item]);
  }

  function setMembers(update) {
    setData((previous) => {
      const members =
        typeof update === "function" ? update(previous.members) : update;
      return {
        ...previous,
        members,
        bookings: previous.bookings.filter((b) =>
          members.some((m) => m.id === b.memberId),
        ),
      };
    });
  }

  function setBookings(update) {
    setData((previous) => ({
      ...previous,
      bookings:
        typeof update === "function" ? update(previous.bookings) : update,
    }));
  }

  function onAdd(productId) {
    const product = data.products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: "Sản phẩm không tồn tại." };
    const maxQty = product.maxQuantity || 10;
    const quantity =
      data.cart.find((i) => i.productId === productId)?.quantity || 0;
    if (quantity >= maxQty)
      return {
        ok: false,
        message: "Đã đạt giới hạn " + maxQty + " sản phẩm cùng loại mỗi đơn.",
      };
    setData((previous) => {
      const current =
        previous.cart.find((i) => i.productId === productId)?.quantity || 0;
      return {
        ...previous,
        cart: changeQuantity(
          previous.cart,
          productId,
          current + 1,
          previous.products,
        ),
      };
    });
    return { ok: true, message: "Đã thêm " + product.name + " vào giỏ hàng." };
  }

  function onQuantity(id, quantity) {
    setData((previous) => ({
      ...previous,
      cart: changeQuantity(previous.cart, id, quantity, previous.products),
    }));
  }

  function onCreateOrder(customer, packageId) {
    if (sandbox)
      return { ok: false, message: "Thoát Sandbox trước khi tạo đơn." };
    if (initial.error) return { ok: false, message: initial.error };
    const error = validateCustomer(customer);
    if (error) return { ok: false, message: error };
    const items = getCheckoutLines(data.cart, packageId, data.products);
    if (!items.length)
      return {
        ok: false,
        message: "Giỏ hàng trống hoặc gói tập không hợp lệ.",
      };
    const order = {
      id:
        "FIT" +
        crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase(),
      createdAt: new Date().toISOString(),
      kind: packageId ? "package" : "products",
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email?.trim() || "",
        note: customer.note?.trim() || "",
      },
      items,
      total: orderTotal(items),
      status: "awaiting_transfer",
    };
    const orders = [...data.orders, order];
    const cart = packageId ? data.cart : [];
    try {
      writeShopData(cart, orders);
    } catch {
      return {
        ok: false,
        message:
          "Không lưu được đơn. Giỏ hàng được giữ nguyên; chưa có đơn mới.",
      };
    }
    setData((previous) => ({ ...previous, cart, orders }));
    return { ok: true, id: order.id };
  }

  function onStatus(id, status) {
    if (sandbox || initial.error)
      return {
        ok: false,
        message: "Không thể cập nhật đơn trong chế độ hiện tại.",
      };
    const order = data.orders.find((o) => o.id === id);
    if (
      !order ||
      order.status !== "awaiting_transfer" ||
      !["customer_reported", "cancelled"].includes(status)
    )
      return { ok: false, message: "Trạng thái không cho phép thao tác này." };
    const orders = data.orders.map((o) => (o.id === id ? { ...o, status } : o));
    try {
      writeShopData(data.cart, orders);
    } catch {
      return {
        ok: false,
        message: "Không lưu được trạng thái. Dữ liệu chưa thay đổi.",
      };
    }
    setData((previous) => ({ ...previous, orders }));
    return {
      ok: true,
      message:
        status === "cancelled"
          ? "Đã hủy yêu cầu."
          : "Đã gửi thông báo chuyển khoản tới phòng tập.",
    };
  }

  function onAdminOrderStatus(id, status) {
    if (sandbox || initial.error)
      return {
        ok: false,
        message: "Không thể cập nhật đơn trong chế độ Sandbox.",
      };
    const order = data.orders.find((o) => o.id === id);
    if (!order) return { ok: false, message: "Không tìm thấy đơn hàng." };
    const orders = data.orders.map((o) => (o.id === id ? { ...o, status } : o));
    try {
      writeShopData(data.cart, orders);
    } catch {
      return {
        ok: false,
        message: "Không lưu được trạng thái đơn.",
      };
    }
    setData((previous) => ({ ...previous, orders }));
    const labels = {
      confirmed: `Đã xác nhận thanh toán cho đơn ${id}.`,
      completed: `Đã hoàn tất đơn hàng ${id}.`,
      cancelled: `Đã hủy đơn hàng ${id}.`,
    };
    return {
      ok: true,
      message: labels[status] || `Đã cập nhật trạng thái đơn ${id}.`,
    };
  }

  function toggleSandbox() {
    if (sandbox) {
      if (!window.confirm("Thoát Sandbox và bỏ các thay đổi thử?")) return;
      setData(originalData);
      setOriginalData(null);
      setSandbox(false);
    } else {
      setOriginalData(structuredClone(data));
      setData(createSampleData());
      setSandbox(true);
    }
    setViewVersion((v) => v + 1);
  }

  function resetSandbox() {
    if (sandbox && window.confirm("Làm lại toàn bộ dữ liệu thử?")) {
      setData(createSampleData());
      setViewVersion((v) => v + 1);
    }
  }

  const cartCount = data.cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes key={viewVersion}>
          {/* 1. WEB PHỤ QUẢN TRỊ ADMIN (http://localhost:5173/admin) — Tách biệt layout hoàn toàn */}
          <Route
            path="/admin/*"
            element={
              <AdminPortal
                products={data.products}
                setProducts={setProducts}
                classes={data.classes}
                setClasses={setClasses}
                members={data.members}
                setMembers={setMembers}
                bookings={data.bookings}
                setBookings={setBookings}
                orders={data.orders}
                onAdminOrderStatus={onAdminOrderStatus}
                consultations={data.consultations}
                setConsultations={setConsultations}
              />
            }
          />

          {/* 2. WEB CHÍNH KHÁCH HÀNG (http://localhost:5173/) */}
          <Route
            element={
              <UserLayout
                cartCount={cartCount}
                sandbox={sandbox}
                storageError={storageError}
                onResetSandbox={resetSandbox}
                onToggleSandbox={toggleSandbox}
                products={data.products}
                classes={data.classes}
                onAdd={onAdd}
              />
            }
          >
            <Route
              path="/"
              element={<Home products={data.products} onAdd={onAdd} />}
            />
            <Route
              path="/cua-hang"
              element={<Shop products={data.products} onAdd={onAdd} />}
            />
            <Route
              path="/cua-hang/:id"
              element={<ProductDetail products={data.products} onAdd={onAdd} />}
            />
            <Route
              path="/gio-hang"
              element={
                <Cart
                  products={data.products}
                  cart={data.cart}
                  onQuantity={onQuantity}
                  sandbox={sandbox}
                />
              }
            />
            <Route path="/goi-tap" element={<Packages />} />
            <Route
              path="/lich-tap"
              element={
                <Schedule
                  classes={data.classes}
                  members={data.members}
                  bookings={data.bookings}
                />
              }
            />
            <Route
              path="/thanh-toan"
              element={
                <Checkout
                  products={data.products}
                  cart={data.cart}
                  onCreateOrder={onCreateOrder}
                  sandbox={sandbox}
                />
              }
            />
            <Route path="/don-hang" element={<Orders orders={data.orders} />} />
            <Route
              path="/don-hang/:id"
              element={
                <OrderDetail
                  orders={data.orders}
                  onStatus={onStatus}
                  sandbox={sandbox}
                />
              }
            />
            <Route
              path="/lien-he"
              element={<Contact onAddConsultation={handleAddConsultation} />}
            />
            <Route
              path="/hoi-vien"
              element={<Navigate to="/admin/hoi-vien" replace />}
            />
            <Route
              path="/members"
              element={<Navigate to="/admin/hoi-vien" replace />}
            />
            <Route path="/gioi-thieu" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>

        <Snackbar
          open={toast.open}
          autoHideDuration={3200}
          onClose={closeToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <FitnessShell />
    </AppProvider>
  );
}
