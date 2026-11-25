import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { money } from "../data";
import { statusText } from "./Orders";
import MemberList from "../components/MemberList";
import { ADMIN_DEFAULT_PIN, useAppContext } from "../context/AppContext";

const DRAWER_WIDTH = 260;

const STATUS_CHIP_COLOR = {
  awaiting_transfer: "warning",
  customer_reported: "info",
  confirmed: "primary",
  completed: "success",
  cancelled: "default",
};

const EMPTY_PRODUCT_FORM = {
  name: "",
  category: "Dụng cụ",
  price: "",
  label: "MỚI",
  type: "custom",
  color: "#e2ebd2",
  image: "",
  description: "",
  detailsText: "Bảo hành chính hãng tại phòng tập",
};

const EMPTY_CLASS_FORM = {
  name: "",
  coach: "",
  day: "Thứ 4",
  time: "18:00 - 19:00",
  capacity: 15,
};

export default function AdminPortal({
  products,
  setProducts,
  classes,
  setClasses,
  members,
  setMembers,
  bookings,
  setBookings,
  orders,
  onAdminOrderStatus,
  consultations,
  setConsultations,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const {
    themeMode,
    toggleTheme,
    adminAuthenticated,
    loginAdmin,
    logoutAdmin,
    showToast,
  } = useAppContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  // Order filter
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Product CRUD state
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);

  // Class CRUD state
  const [editingClassId, setEditingClassId] = useState(null);
  const [classForm, setClassForm] = useState(EMPTY_CLASS_FORM);

  // Quản lý đăng ký lớp cho hội viên
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  const visibleBookings = bookings.filter(
    (b) =>
      members.some((m) => m.id === b.memberId) &&
      classes.some((c) => c.id === b.classId),
  );

  function handleAdminRegisterClass(e) {
    e.preventDefault();
    if (!selectedMemberId || !selectedClassId) {
      showToast("Vui lòng chọn đầy đủ hội viên và lớp tập.", "warning");
      return;
    }

    const member = members.find((m) => String(m.id) === String(selectedMemberId));
    const gymClass = classes.find((c) => String(c.id) === String(selectedClassId));
    if (!member || !gymClass) return;

    const alreadyRegistered = visibleBookings.some(
      (b) => b.classId === gymClass.id && b.memberId === member.id,
    );
    if (alreadyRegistered) {
      showToast("Hội viên này đã đăng ký lớp này rồi.", "warning");
      return;
    }

    const registeredCount = visibleBookings.filter(
      (b) => b.classId === gymClass.id,
    ).length;
    if (registeredCount >= gymClass.capacity) {
      showToast("Lớp đã đủ sĩ số tối đa.", "error");
      return;
    }

    setBookings((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        memberId: member.id,
        classId: gymClass.id,
      },
    ]);
    showToast(`Đã xếp lớp "${gymClass.name}" cho ${member.name}.`, "success");
  }

  function handleAdminCancelBooking(bookingId) {
    if (!window.confirm("Bạn có chắc muốn hủy đăng ký lớp này không?")) return;
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    showToast("Đã hủy lượt đăng ký lớp.", "info");
  }

  // Determine active section from URL path (/admin, /admin/don-hang, /admin/san-pham, ...)
  const pathSuffix = location.pathname.replace(/^\/admin\/?/, "").split("/")[0];
  const activeSection = [
    "don-hang",
    "san-pham",
    "hoi-vien",
    "lich-lop",
    "tu-van",
  ].includes(pathSuffix)
    ? pathSuffix
    : "tong-quan";

  // Dedicated Admin Login Gate when accessing http://localhost:5173/admin
  if (!adminAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "background.default",
          px: 2,
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, sm: 4.5 },
            maxWidth: 430,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: "#263f2a",
                color: "#d8eb9b",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
              }}
            >
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
                FITNESS STUDIO PORTAL
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                Đăng nhập Quản trị (Admin)
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hệ thống quản trị riêng biệt cho nhân viên và quản lý phòng tập
            FITNESS Studio (<code>/admin</code>).
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const res = loginAdmin(pinInput);
              if (!res.ok) setPinError(res.message);
            }}
          >
            <Stack spacing={2.2}>
              <TextField
                autoFocus
                fullWidth
                type="password"
                label="Mật khẩu / PIN quản trị"
                placeholder="Nhập mã PIN..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError("");
                }}
                helperText={`Mã PIN mặc định: ${ADMIN_DEFAULT_PIN}`}
              />
              {pinError && <Alert severity="error">{pinError}</Alert>}
              <Button type="submit" variant="contained" size="large" fullWidth>
                Đăng nhập Admin
              </Button>
              <Button
                component="a"
                href="/"
                variant="text"
                size="small"
                endIcon={<OpenInNewIcon fontSize="small" />}
              >
                Về trang chủ Khách hàng
              </Button>
            </Stack>
          </form>
        </Paper>
      </Box>
    );
  }

  // KPI metrics
  const confirmedRevenue = orders
    .filter((o) => o.status === "confirmed" || o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingRevenue = orders
    .filter(
      (o) =>
        o.status === "awaiting_transfer" || o.status === "customer_reported",
    )
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "awaiting_transfer" || o.status === "customer_reported",
  ).length;

  const newConsultationsCount = consultations.filter(
    (c) => c.status !== "contacted",
  ).length;

  const filteredOrders = [...orders].reverse().filter((o) => {
    if (orderStatusFilter === "all") return true;
    return o.status === orderStatusFilter;
  });

  const adminMenu = [
    {
      key: "tong-quan",
      label: "Tổng quan",
      to: "/admin",
      icon: <DashboardOutlinedIcon fontSize="small" />,
      badge: 0,
    },
    {
      key: "don-hang",
      label: "Đơn hàng",
      to: "/admin/don-hang",
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
      badge: pendingOrdersCount,
    },
    {
      key: "san-pham",
      label: "Sản phẩm",
      to: "/admin/san-pham",
      icon: <Inventory2OutlinedIcon fontSize="small" />,
      badge: 0,
    },
    {
      key: "hoi-vien",
      label: "Hội viên",
      to: "/admin/hoi-vien",
      icon: <PeopleOutlineIcon fontSize="small" />,
      badge: 0,
    },
    {
      key: "lich-lop",
      label: "Lịch lớp",
      to: "/admin/lich-lop",
      icon: <EventNoteOutlinedIcon fontSize="small" />,
      badge: 0,
    },
    {
      key: "tu-van",
      label: "Tư vấn PT",
      to: "/admin/tu-van",
      icon: <SupportAgentOutlinedIcon fontSize="small" />,
      badge: newConsultationsCount,
    },
  ];

  // Product CRUD handlers
  function handleSaveProduct(e) {
    e.preventDefault();
    const cleanName = productForm.name.trim();
    const numericPrice = Number(productForm.price);
    if (cleanName.length < 2) {
      showToast("Tên sản phẩm cần ít nhất 2 ký tự.", "warning");
      return;
    }
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      showToast("Giá sản phẩm phải lớn hơn 0.", "warning");
      return;
    }

    const detailsArray = productForm.detailsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProductId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProductId
            ? {
                ...p,
                name: cleanName,
                category: productForm.category,
                price: numericPrice,
                label: productForm.label.trim() || "MỚI",
                type: productForm.type,
                color: productForm.color || "#e2ebd2",
                image: productForm.image.trim() || undefined,
                description:
                  productForm.description.trim() ||
                  "Sản phẩm chính hãng tại FITNESS Studio.",
                details: detailsArray.length
                  ? detailsArray
                  : ["Nhận hàng tại quầy lễ tân phòng tập"],
              }
            : p,
        ),
      );
      showToast(`Đã cập nhật "${cleanName}" & đồng bộ sang Web chính.`, "success");
    } else {
      const newProduct = {
        id: "prod-" + crypto.randomUUID().slice(0, 8),
        name: cleanName,
        category: productForm.category,
        price: numericPrice,
        label: productForm.label.trim() || "MỚI",
        type: productForm.type,
        color: productForm.color || "#e2ebd2",
        image: productForm.image.trim() || undefined,
        description:
          productForm.description.trim() ||
          "Sản phẩm chính hãng tại FITNESS Studio.",
        details: detailsArray.length
          ? detailsArray
          : ["Nhận hàng tại quầy lễ tân phòng tập"],
        maxQuantity: 10,
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Đã thêm "${cleanName}" lên Web chính.`, "success");
    }

    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      label: product.label || "",
      type: product.type || "custom",
      color: product.color || "#e2ebd2",
      image: product.image || "",
      description: product.description || "",
      detailsText: (product.details || []).join(", "),
    });
  }

  function handleDeleteProduct(product) {
    if (!window.confirm(`Xóa sản phẩm "${product.name}" khỏi Cửa hàng?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    if (editingProductId === product.id) {
      setEditingProductId(null);
      setProductForm(EMPTY_PRODUCT_FORM);
    }
    showToast(`Đã xóa sản phẩm "${product.name}".`, "info");
  }

  // Class CRUD handlers
  function handleSaveClass(e) {
    e.preventDefault();
    const cleanName = classForm.name.trim();
    const cleanCoach = classForm.coach.trim();
    const cap = Number(classForm.capacity);
    if (!cleanName || !cleanCoach || !Number.isInteger(cap) || cap <= 0) {
      showToast("Vui lòng nhập đầy đủ tên lớp, HLV và sĩ số hợp lệ.", "warning");
      return;
    }

    if (editingClassId !== null) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === editingClassId
            ? {
                ...c,
                name: cleanName,
                coach: cleanCoach,
                day: classForm.day,
                time: classForm.time.trim(),
                capacity: cap,
              }
            : c,
        ),
      );
      showToast(`Đã cập nhật lớp "${cleanName}".`, "success");
    } else {
      const newClass = {
        id: "cls-" + crypto.randomUUID().slice(0, 8),
        name: cleanName,
        coach: cleanCoach,
        day: classForm.day,
        time: classForm.time.trim(),
        capacity: cap,
      };
      setClasses((prev) => [...prev, newClass]);
      showToast(`Đã mở lớp "${cleanName}" lên Web chính.`, "success");
    }

    setEditingClassId(null);
    setClassForm(EMPTY_CLASS_FORM);
  }

  function handleEditClass(gymClass) {
    setEditingClassId(gymClass.id);
    setClassForm({
      name: gymClass.name,
      coach: gymClass.coach,
      day: gymClass.day,
      time: gymClass.time,
      capacity: gymClass.capacity,
    });
  }

  function handleDeleteClass(gymClass) {
    if (!window.confirm(`Xóa lớp tập "${gymClass.name}" (${gymClass.day})?`))
      return;
    setClasses((prev) => prev.filter((c) => c.id !== gymClass.id));
    if (editingClassId === gymClass.id) {
      setEditingClassId(null);
      setClassForm(EMPTY_CLASS_FORM);
    }
    showToast(`Đã xóa lớp "${gymClass.name}".`, "info");
  }

  // Consultation handlers
  function handleToggleConsultation(id) {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "contacted" ? "new" : "contacted" }
          : c,
      ),
    );
    showToast("Đã cập nhật trạng thái tư vấn.", "success");
  }

  function handleDeleteConsultation(id) {
    if (!window.confirm("Xóa yêu cầu tư vấn này?")) return;
    setConsultations((prev) => prev.filter((c) => c.id !== id));
    showToast("Đã xóa yêu cầu tư vấn.", "info");
  }

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1c2c1f",
        color: "#eef4e6",
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 30,
              height: 32,
              borderRadius: 1,
              bgcolor: "#d8eb9b",
              color: "#1b281d",
              display: "grid",
              placeItems: "center",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: 20,
            }}
          >
            F
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>
              FITNESS ADMIN
            </Typography>
            <Typography variant="caption" sx={{ color: "#a7b89c" }}>
              Quản trị hệ thống
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {adminMenu.map((item) => {
          const isSelected = activeSection === item.key;
          return (
            <ListItemButton
              key={item.key}
              component={NavLink}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1.5,
                mb: 0.75,
                color: isSelected ? "#1b281d" : "#d8e2cf",
                bgcolor: isSelected ? "#d8eb9b" : "transparent",
                "&:hover": {
                  bgcolor: isSelected ? "#d8eb9b" : "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: isSelected ? "#1b281d" : "#a7b89c",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: isSelected ? 700 : 500,
                }}
              />
              {item.badge > 0 && (
                <Chip
                  size="small"
                  label={item.badge}
                  color="warning"
                  sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <Box sx={{ p: 2 }}>
        <Button
          component="a"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          variant="outlined"
          endIcon={<OpenInNewIcon fontSize="small" />}
          sx={{
            color: "#d8eb9b",
            borderColor: "rgba(216,235,155,0.4)",
            mb: 1,
            fontSize: 12,
          }}
        >
          Mở Web Khách hàng
        </Button>
        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={() => {
            logoutAdmin();
            navigate("/admin");
          }}
          sx={{ color: "#bfd0b3", fontSize: 12 }}
        >
          Đăng xuất Admin
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar cố định trên Desktop, Drawer trên Mobile */}
      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          component="aside"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}
        >
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: DRAWER_WIDTH,
              height: "100vh",
            }}
          >
            {sidebarContent}
          </Box>
        </Box>
      )}

      {/* Nội dung chính bên phải */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", gap: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} edge="start">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="subtitle1" fontWeight={700}>
                {adminMenu.find((m) => m.key === activeSection)?.label ||
                  "Tổng quan"}
              </Typography>
              <Chip
                size="small"
                label="Đồng bộ trực tiếp với Web chính"
                color="success"
                variant="outlined"
                sx={{ display: { xs: "none", sm: "inline-flex" }, fontSize: 11 }}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Đổi giao diện Sáng / Tối">
                <IconButton size="small" onClick={toggleTheme}>
                  {themeMode === "light" ? (
                    <DarkModeOutlinedIcon fontSize="small" />
                  ) : (
                    <LightModeOutlinedIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>

              <Button
                component="a"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="outlined"
                endIcon={<OpenInNewIcon fontSize="small" />}
              >
                Xem Web chính
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ p: { xs: 2, sm: 3.5 }, flex: 1 }}>
          {/* TỔNG QUAN */}
          {activeSection === "tong-quan" && (
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                Tổng quan hoạt động
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Dữ liệu được đồng bộ tự động giữa Cổng quản trị (<code>/admin</code>) và Trang khách hàng (<code>/</code>).
              </Typography>

              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography variant="overline" color="text.secondary">
                      DOANH THU ĐÃ XÁC NHẬN
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="primary.main"
                      sx={{ my: 0.5 }}
                    >
                      {money(confirmedRevenue)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Chờ duyệt: {money(pendingRevenue)}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2.5, cursor: "pointer" }}
                    onClick={() => navigate("/admin/don-hang")}
                  >
                    <Typography variant="overline" color="text.secondary">
                      ĐƠN HÀNG HỆ THỐNG
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ my: 0.5 }}>
                      {orders.length} đơn
                    </Typography>
                    <Typography variant="caption" color="warning.main" fontWeight={600}>
                      {pendingOrdersCount} đơn chờ xác nhận →
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2.5, cursor: "pointer" }}
                    onClick={() => navigate("/admin/hoi-vien")}
                  >
                    <Typography variant="overline" color="text.secondary">
                      HỘI VIÊN & LỚP TẬP
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ my: 0.5 }}>
                      {members.length} hội viên
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {classes.length} lớp · {bookings.length} lượt đặt
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2.5, cursor: "pointer" }}
                    onClick={() => navigate("/admin/tu-van")}
                  >
                    <Typography variant="overline" color="text.secondary">
                      SẢN PHẨM & TƯ VẤN PT
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ my: 0.5 }}>
                      {products.length} sản phẩm
                    </Typography>
                    <Typography variant="caption" color="info.main" fontWeight={600}>
                      {newConsultationsCount} yêu cầu tư vấn mới →
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Đơn hàng mới nhất từ Web khách hàng
                  </Typography>
                  <Button size="small" onClick={() => navigate("/admin/don-hang")}>
                    Quản lý tất cả đơn →
                  </Button>
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Tổng tiền</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[...orders]
                        .reverse()
                        .slice(0, 5)
                        .map((o) => (
                          <TableRow key={o.id} hover>
                            <TableCell sx={{ fontWeight: 700 }}>{o.id}</TableCell>
                            <TableCell>
                              {o.customer.name} ({o.customer.phone})
                            </TableCell>
                            <TableCell>{money(o.total)}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={statusText[o.status] || o.status}
                                color={STATUS_CHIP_COLOR[o.status] || "default"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      {orders.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                            Chưa có đơn hàng nào. Hãy thử đặt đơn ở tab Web chính!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}

          {/* QUẢN LÝ ĐƠN HÀNG */}
          {activeSection === "don-hang" && (
            <Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 2.5 }}
              >
                <Typography variant="h5" fontWeight={700}>
                  Quản lý & Đối chiếu Đơn hàng
                </Typography>
                <FormControl size="small" sx={{ minWidth: 220, bgcolor: "background.paper" }}>
                  <InputLabel>Lọc trạng thái đơn</InputLabel>
                  <Select
                    value={orderStatusFilter}
                    label="Lọc trạng thái đơn"
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Tất cả đơn hàng</MenuItem>
                    <MenuItem value="customer_reported">Khách đã báo chuyển</MenuItem>
                    <MenuItem value="awaiting_transfer">Chưa báo chuyển khoản</MenuItem>
                    <MenuItem value="confirmed">Admin đã xác nhận tiền</MenuItem>
                    <MenuItem value="completed">Đã giao / Kích hoạt gói</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor: (t) =>
                          t.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "#e8eddd",
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Chi tiết đặt</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tổng tiền</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">
                        Duyệt đơn
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((o) => (
                      <TableRow key={o.id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{o.id}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {o.customer.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {o.customer.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {o.items
                              .map((i) => `${i.name} ×${i.quantity}`)
                              .join(", ")}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(o.createdAt).toLocaleString("vi-VN")}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>
                          {money(o.total)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={statusText[o.status] || o.status}
                            color={STATUS_CHIP_COLOR[o.status] || "default"}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            {(o.status === "awaiting_transfer" ||
                              o.status === "customer_reported") && (
                              <Tooltip title="Xác nhận đã nhận chuyển khoản">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    const res = onAdminOrderStatus(
                                      o.id,
                                      "confirmed",
                                    );
                                    showToast(
                                      res.message,
                                      res.ok ? "success" : "error",
                                    );
                                  }}
                                >
                                  <CheckCircleOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {o.status === "confirmed" && (
                              <Tooltip title="Hoàn tất giao hàng / Kích hoạt gói">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={() => {
                                    const res = onAdminOrderStatus(
                                      o.id,
                                      "completed",
                                    );
                                    showToast(
                                      res.message,
                                      res.ok ? "success" : "error",
                                    );
                                  }}
                                >
                                  <DoneAllIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {o.status !== "cancelled" &&
                              o.status !== "completed" && (
                                <Tooltip title="Hủy đơn hàng">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      if (
                                        !window.confirm(
                                          `Xác nhận hủy đơn ${o.id}?`,
                                        )
                                      )
                                        return;
                                      const res = onAdminOrderStatus(
                                        o.id,
                                        "cancelled",
                                      );
                                      showToast(
                                        res.message,
                                        res.ok ? "info" : "error",
                                      );
                                    }}
                                  >
                                    <CancelOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                          Chưa có đơn hàng nào trong mục này.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* QUẢN LÝ SẢN PHẨM */}
          {activeSection === "san-pham" && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4.5 }}>
                <Paper
                  component="form"
                  variant="outlined"
                  onSubmit={handleSaveProduct}
                  sx={{ p: 3 }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    {editingProductId
                      ? "Chỉnh sửa sản phẩm"
                      : "Thêm sản phẩm lên Web chính"}
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      label="Tên sản phẩm"
                      required
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                    />

                    <Stack direction="row" spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                          value={productForm.category}
                          label="Danh mục"
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              category: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="Dụng cụ">Dụng cụ</MenuItem>
                          <MenuItem value="Phụ kiện">Phụ kiện</MenuItem>
                          <MenuItem value="Trang phục">Trang phục</MenuItem>
                          <MenuItem value="Dinh dưỡng">Dinh dưỡng</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        size="small"
                        type="number"
                        label="Giá bán (VNĐ)"
                        required
                        fullWidth
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            price: e.target.value,
                          })
                        }
                      />
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Biểu tượng minh họa</InputLabel>
                        <Select
                          value={productForm.type}
                          label="Biểu tượng minh họa"
                          onChange={(e) =>
                            setProductForm({
                              ...productForm,
                              type: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="custom">Mặc định (FIT Gear)</MenuItem>
                          <MenuItem value="bottle">Bình nước</MenuItem>
                          <MenuItem value="dumbbell">Tạ tay</MenuItem>
                          <MenuItem value="mat">Thảm yoga</MenuItem>
                          <MenuItem value="bag">Túi thể thao</MenuItem>
                          <MenuItem value="rope">Dây nhảy</MenuItem>
                          <MenuItem value="towel">Khăn tập</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        size="small"
                        label="Nhãn nổi bật"
                        fullWidth
                        value={productForm.label}
                        onChange={(e) =>
                          setProductForm({
                            ...productForm,
                            label: e.target.value,
                          })
                        }
                      />
                    </Stack>

                    <TextField
                      size="small"
                      label="Link ảnh thật (tùy chọn)"
                      placeholder="https://..."
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({ ...productForm, image: e.target.value })
                      }
                    />

                    <TextField
                      size="small"
                      label="Mô tả ngắn"
                      multiline
                      rows={2}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          description: e.target.value,
                        })
                      }
                    />

                    <TextField
                      size="small"
                      label="Thông số (cách nhau dấu phẩy)"
                      value={productForm.detailsText}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          detailsText: e.target.value,
                        })
                      }
                    />

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        fullWidth
                      >
                        {editingProductId ? "Lưu cập nhật" : "Đăng lên Cửa hàng"}
                      </Button>
                      {editingProductId && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingProductId(null);
                            setProductForm(EMPTY_PRODUCT_FORM);
                          }}
                        >
                          Hủy
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 7.5 }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "#e8eddd",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700 }}>Sản phẩm</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Danh mục</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Giá bán</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {p.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {p.label}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip size="small" label={p.category} />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {money(p.price)}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditProduct(p)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProduct(p)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}

          {/* QUẢN LÝ HỘI VIÊN */}
          {activeSection === "hoi-vien" && (
            <Box sx={{ mt: -4 }}>
              <MemberList members={members} setMembers={setMembers} />
            </Box>
          )}

          {/* QUẢN LÝ LỊCH LỚP */}
          {activeSection === "lich-lop" && (
            <Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4.5 }}>
                <Paper
                  component="form"
                  variant="outlined"
                  onSubmit={handleSaveClass}
                  sx={{ p: 3 }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    {editingClassId !== null
                      ? "Cập nhật lớp tập"
                      : "Mở lớp tập mới"}
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      label="Tên lớp tập"
                      required
                      placeholder="Ví dụ: Pilates cơ bản"
                      value={classForm.name}
                      onChange={(e) =>
                        setClassForm({ ...classForm, name: e.target.value })
                      }
                    />

                    <TextField
                      size="small"
                      label="Huấn luyện viên"
                      required
                      placeholder="Ví dụ: HLV Hoàng Anh"
                      value={classForm.coach}
                      onChange={(e) =>
                        setClassForm({ ...classForm, coach: e.target.value })
                      }
                    />

                    <Stack direction="row" spacing={1.5}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>Ngày trong tuần</InputLabel>
                        <Select
                          value={classForm.day}
                          label="Ngày trong tuần"
                          onChange={(e) =>
                            setClassForm({ ...classForm, day: e.target.value })
                          }
                        >
                          {[
                            "Thứ 2",
                            "Thứ 3",
                            "Thứ 4",
                            "Thứ 5",
                            "Thứ 6",
                            "Thứ 7",
                            "Chủ nhật",
                          ].map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        size="small"
                        type="number"
                        label="Sĩ số tối đa"
                        fullWidth
                        value={classForm.capacity}
                        onChange={(e) =>
                          setClassForm({
                            ...classForm,
                            capacity: Number(e.target.value),
                          })
                        }
                      />
                    </Stack>

                    <TextField
                      size="small"
                      label="Khung giờ tập"
                      required
                      value={classForm.time}
                      onChange={(e) =>
                        setClassForm({ ...classForm, time: e.target.value })
                      }
                    />

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<AddCircleOutlineIcon />}
                        fullWidth
                      >
                        {editingClassId !== null ? "Lưu lớp" : "Thêm lớp mới"}
                      </Button>
                      {editingClassId !== null && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setEditingClassId(null);
                            setClassForm(EMPTY_CLASS_FORM);
                          }}
                        >
                          Hủy
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, lg: 7.5 }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.05)"
                              : "#e8eddd",
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700 }}>Lớp tập</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>HLV</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Thời gian</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Sĩ số</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {classes.map((c) => {
                        const count = bookings.filter(
                          (b) => b.classId === c.id,
                        ).length;
                        return (
                          <TableRow key={c.id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                            <TableCell>{c.coach}</TableCell>
                            <TableCell>
                              {c.day} · {c.time}
                            </TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={`${count}/${c.capacity}`}
                                color={count >= c.capacity ? "error" : "secondary"}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditClass(c)}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClass(c)}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Xếp lớp cho hội viên & Danh sách đăng ký ({visibleBookings.length} lượt)
            </Typography>

            <Paper
              component="form"
              variant="outlined"
              onSubmit={handleAdminRegisterClass}
              sx={{ p: 2.5, mb: 3 }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <FormControl size="small" fullWidth>
                  <InputLabel>Chọn hội viên đăng ký</InputLabel>
                  <Select
                    value={selectedMemberId}
                    label="Chọn hội viên đăng ký"
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                  >
                    <MenuItem value="">-- Chọn hội viên --</MenuItem>
                    {members.map((m) => (
                      <MenuItem key={m.id} value={String(m.id)}>
                        {m.name} ({m.packageName})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Chọn lớp tập</InputLabel>
                  <Select
                    value={selectedClassId}
                    label="Chọn lớp tập"
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    <MenuItem value="">-- Chọn lớp tập --</MenuItem>
                    {classes.map((c) => {
                      const count = visibleBookings.filter(
                        (b) => b.classId === c.id,
                      ).length;
                      return (
                        <MenuItem key={c.id} value={String(c.id)}>
                          {c.name} — {c.day} ({count}/{c.capacity})
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ minWidth: 160, whiteSpace: "nowrap" }}
                >
                  Đăng ký lớp
                </Button>
              </Stack>
            </Paper>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "#e8eddd",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Hội viên</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lớp tập</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lịch tập</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleBookings.map((booking, index) => {
                    const member = members.find((m) => m.id === booking.memberId);
                    const gymClass = classes.find((c) => c.id === booking.classId);
                    return (
                      <TableRow key={booking.id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {member?.name}
                        </TableCell>
                        <TableCell>{gymClass?.name}</TableCell>
                        <TableCell>
                          {gymClass?.day} · {gymClass?.time}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleAdminCancelBooking(booking.id)}
                          >
                            Hủy đăng ký
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {visibleBookings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        Chưa có hội viên nào được đăng ký lớp tập.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          )}

          {/* YÊU CẦU TƯ VẤN PT */}
          {activeSection === "tu-van" && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: (t) =>
                        t.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "#e8eddd",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Liên hệ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mục tiêu & Ghi chú</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...consultations].reverse().map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {item.lastName} {item.firstName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString("vi-VN")
                            : "Vừa xong"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.phone}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={item.goal}
                          sx={{ mr: 1, mb: 0.5 }}
                        />
                        <Typography variant="body2">{item.address}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            item.status === "contacted"
                              ? "Đã liên hệ tư vấn"
                              : "Mới gửi"
                          }
                          color={
                            item.status === "contacted" ? "success" : "warning"
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleToggleConsultation(item.id)}
                          >
                            {item.status === "contacted"
                              ? "Đánh dấu mới"
                              : "Đã tư vấn"}
                          </Button>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteConsultation(item.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {consultations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                        Chưa có yêu cầu tư vấn PT nào từ trang Tư vấn PT.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
}
