import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { money } from "../data";
import { useAppContext } from "../context/AppContext";

const NAV_ITEMS = [
  { label: "Trang chủ", to: "/", end: true },
  { label: "Cửa hàng", to: "/cua-hang" },
  { label: "Gói tập", to: "/goi-tap" },
  { label: "Lịch tập", to: "/lich-tap" },
  { label: "Đơn hàng", to: "/don-hang" },
  { label: "Tư vấn PT", to: "/lien-he" },
];

const HOT_KEYWORDS = [
  "Tạ tay",
  "Thảm yoga",
  "Whey Protein",
  "Găng tay",
  "Bình nước",
  "Giày tập",
];

export default function Header({ cartCount, products = [] }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { themeMode, toggleTheme } = useAppContext();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const normalizedQuery = searchTerm.trim().toLocaleLowerCase("vi");

  const suggestions = normalizedQuery
    ? products
        .filter(
          (p) =>
            p.name.toLocaleLowerCase("vi").includes(normalizedQuery) ||
            p.category.toLocaleLowerCase("vi").includes(normalizedQuery) ||
            (p.description || "")
              .toLocaleLowerCase("vi")
              .includes(normalizedQuery) ||
            (p.label || "").toLocaleLowerCase("vi").includes(normalizedQuery),
        )
        .slice(0, 6)
    : [];

  function submitSearch(customQuery) {
    const q = (typeof customQuery === "string" ? customQuery : searchTerm).trim();
    setSearchFocused(false);
    if (q) {
      navigate(`/cua-hang?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/cua-hang");
    }
  }

  return (
    <>
      <Box
        sx={{
          bgcolor: "#203422",
          color: "#e5eddc",
          textAlign: "center",
          py: 1,
          px: 2,
          fontSize: 10.5,
          letterSpacing: "1.3px",
        }}
      >
        FITNESS STUDIO MALL
        <Box
          component="span"
          sx={{
            ml: 2.5,
            color: "#d8eb9b",
            letterSpacing: "0.3px",
            display: { xs: "none", sm: "inline" },
          }}
        >
          Chính hãng 100% · Nhận ngay tại quầy phòng tập · Đổi trả trong 7 ngày
        </Box>
      </Box>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          borderBottom: 1,
          borderColor: "divider",
          width: "100%",
        }}
      >
        {/* Hàng 1: Logo + Thanh tìm kiếm kiểu Shopee + Theme + Giỏ hàng */}
        <Toolbar
          sx={{
            maxWidth: 1440,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: "4%" },
            pt: 1.5,
            pb: { xs: 1.25, lg: 1 },
            justifyContent: "space-between",
            gap: { xs: 1.5, md: 3 },
          }}
        >
          {/* Brand Logo */}
          <Box
            component={Link}
            to="/"
            aria-label="FITNESS trang chủ"
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: { xs: 21, md: 25 },
              fontWeight: 900,
              letterSpacing: "-1.4px",
              gap: 0.75,
              color: "text.primary",
              flexShrink: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-grid",
                placeItems: "center",
                width: 30,
                height: 34,
                bgcolor: "#263f2a",
                color: "#d8eb9b",
                fontSize: 24,
                fontStyle: "italic",
                borderRadius: "6px",
                mr: 0.5,
              }}
            >
              F
            </Box>
            FITNESS
            <Box component="span" sx={{ color: "#809f46" }}>
              .
            </Box>
          </Box>

          {/* Thanh tìm kiếm Shopee-style */}
          <ClickAwayListener onClickAway={() => setSearchFocused(false)}>
            <Box sx={{ flex: 1, maxWidth: 660, position: "relative" }}>
              <Paper
                component="form"
                elevation={0}
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: "3px",
                  pl: 2,
                  borderRadius: "8px",
                  border: "2px solid",
                  borderColor: searchFocused ? "primary.main" : "#263f2a",
                  bgcolor: "background.paper",
                  boxShadow: searchFocused
                    ? "0 4px 16px rgba(38,63,42,0.12)"
                    : "none",
                }}
              >
                <InputBase
                  inputRef={inputRef}
                  value={searchTerm}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchFocused(true);
                  }}
                  placeholder="Tìm tạ tay, thảm yoga, whey, giày chạy bộ..."
                  inputProps={{ "aria-label": "Tìm kiếm sản phẩm" }}
                  sx={{ flex: 1, fontSize: 13.5 }}
                />

                {searchTerm && (
                  <IconButton
                    size="small"
                    aria-label="Xóa từ khóa"
                    onClick={() => {
                      setSearchTerm("");
                      inputRef.current?.focus();
                    }}
                    sx={{ mr: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  aria-label="Tìm kiếm"
                  sx={{
                    minWidth: { xs: 44, sm: 68 },
                    height: 36,
                    borderRadius: "6px",
                    px: { xs: 1.25, sm: 2.25 },
                    boxShadow: "none",
                  }}
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </Paper>

              {/* Từ khóa gợi ý nhanh ngay dưới thanh tìm kiếm trên Desktop */}
              <Stack
                direction="row"
                spacing={1.25}
                sx={{
                  mt: 0.6,
                  display: { xs: "none", md: "flex" },
                  overflow: "hidden",
                }}
              >
                {HOT_KEYWORDS.map((kw) => (
                  <Typography
                    key={kw}
                    variant="caption"
                    onClick={() => {
                      setSearchTerm(kw);
                      submitSearch(kw);
                    }}
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      fontSize: 11.5,
                      whiteSpace: "nowrap",
                      "&:hover": { color: "primary.main", fontWeight: 600 },
                    }}
                  >
                    {kw}
                  </Typography>
                ))}
              </Stack>

              {/* Dropdown gợi ý trực tiếp kiểu Shopee */}
              {searchFocused && (
                <Paper
                  elevation={8}
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    zIndex: 1400,
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    overflow: "hidden",
                  }}
                >
                  {!normalizedQuery ? (
                    <Box sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        spacing={0.75}
                        alignItems="center"
                        sx={{ mb: 1.25 }}
                      >
                        <TrendingUpIcon fontSize="small" color="primary" />
                        <Typography variant="caption" fontWeight={700}>
                          TÌM KIẾM PHỔ BIẾN
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        {HOT_KEYWORDS.map((kw) => (
                          <Chip
                            key={kw}
                            label={kw}
                            size="small"
                            clickable
                            onClick={() => {
                              setSearchTerm(kw);
                              submitSearch(kw);
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ) : suggestions.length > 0 ? (
                    <Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          bgcolor: (t) =>
                            t.palette.mode === "dark"
                              ? "rgba(255,255,255,0.04)"
                              : "#f4f7ee",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Gợi ý sản phẩm khớp với <b>"{searchTerm.trim()}"</b>
                        </Typography>
                        <Typography
                          variant="caption"
                          color="primary"
                          fontWeight={700}
                          sx={{ cursor: "pointer" }}
                          onClick={() => submitSearch()}
                        >
                          Xem tất cả →
                        </Typography>
                      </Box>
                      <List dense disablePadding>
                        {suggestions.map((item) => (
                          <ListItemButton
                            key={item.id}
                            onClick={() => {
                              setSearchFocused(false);
                              navigate(`/cua-hang/${item.id}`);
                            }}
                            sx={{ py: 1, px: 2, gap: 1.5 }}
                          >
                            <Avatar
                              variant="rounded"
                              src={item.image}
                              alt={item.name}
                              sx={{ width: 42, height: 42 }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                noWrap
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.category} · Đã bán {item.sold || 120}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="primary.main"
                            >
                              {money(item.price)}
                            </Typography>
                          </ListItemButton>
                        ))}
                      </List>
                    </Box>
                  ) : (
                    <Box sx={{ p: 2.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy sản phẩm khớp với "{searchTerm.trim()}".
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          {/* Nút đổi theme + Giỏ hàng + Menu mobile */}
          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
            <Tooltip
              title={
                themeMode === "light"
                  ? "Chuyển giao diện tối"
                  : "Chuyển giao diện sáng"
              }
            >
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label="Đổi chế độ sáng tối"
                size="small"
              >
                {themeMode === "light" ? (
                  <DarkModeOutlinedIcon fontSize="small" />
                ) : (
                  <LightModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>

            <Button
              component={Link}
              to="/gio-hang"
              variant="outlined"
              color="primary"
              size="small"
              startIcon={
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              }
              sx={{
                borderRadius: "20px",
                px: { xs: 1.5, sm: 2 },
                fontSize: 12.5,
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Giỏ hàng
              </Box>
            </Button>

            {isMobile && (
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Mở menu điều hướng"
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Stack>
        </Toolbar>

        {/* Hàng 2 (Desktop): Thanh danh mục điều hướng gọn gàng */}
        {!isMobile && (
          <Box
            sx={{
              borderTop: 1,
              borderColor: "divider",
              bgcolor: (t) =>
                t.palette.mode === "dark" ? "#161d17" : "#f7f9f2",
            }}
          >
            <Stack
              component="nav"
              direction="row"
              spacing={1}
              aria-label="Menu chính"
              sx={{
                maxWidth: 1440,
                width: "100%",
                mx: "auto",
                px: "4%",
              }}
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "text.secondary",
                    borderRadius: 0,
                    px: 1.75,
                    py: 0.9,
                    borderBottom: "2px solid transparent",
                    "&.active": {
                      color: "primary.main",
                      fontWeight: 700,
                      borderColor: "secondary.main",
                    },
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
        )}
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 260, p: 2 }} role="presentation">
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, px: 1 }}>
            FITNESS.
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.end}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&.active": {
                    bgcolor: "action.selected",
                    color: "primary.main",
                    fontWeight: 700,
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
