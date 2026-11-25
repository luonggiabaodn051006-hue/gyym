import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const PAGE_SIZE = 8;
const CATEGORIES = ["Tất cả", "Dụng cụ", "Phụ kiện", "Trang phục", "Dinh dưỡng"];

export default function Shop({ products, onAdd }) {
  const [params, setParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const { showToast } = useAppContext();

  const query = params.get("q") || "";
  const category = CATEGORIES.includes(params.get("loai"))
    ? params.get("loai")
    : "Tất cả";
  const sort = ["popular", "newest", "bestseller", "asc", "desc"].includes(
    params.get("sapxep"),
  )
    ? params.get("sapxep")
    : "popular";
  const rawPage = Number.parseInt(params.get("trang") || "1", 10);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "Tất cả" || value === "popular") next.delete(key);
    else next.set(key, value);
    if (key !== "trang") {
      next.delete("trang");
    }
    setParams(next, { replace: true });
  }

  const normalized = query.trim().toLocaleLowerCase("vi");
  const shown = products.filter(
    (p) =>
      (!normalized ||
        p.name.toLocaleLowerCase("vi").includes(normalized) ||
        p.category.toLocaleLowerCase("vi").includes(normalized) ||
        (p.description || "").toLocaleLowerCase("vi").includes(normalized)) &&
      (category === "Tất cả" || p.category === category),
  );

  if (sort === "asc") shown.sort((a, b) => a.price - b.price);
  if (sort === "desc") shown.sort((a, b) => b.price - a.price);
  if (sort === "bestseller")
    shown.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  if (sort === "newest") shown.reverse();

  const totalPages = Math.max(1, Math.ceil(shown.length / PAGE_SIZE));
  const currentPage =
    Number.isFinite(rawPage) && rawPage >= 1 && rawPage <= totalPages
      ? rawPage
      : 1;
  const paginatedProducts = shown.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handlePageChange(_, pageValue) {
    const next = new URLSearchParams(params);
    if (pageValue <= 1) next.delete("trang");
    else next.set("trang", String(pageValue));
    setParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box component="section" sx={{ py: 4 }}>
      <div className="page-heading">
        <div className="eyebrow">FITNESS MALL / CỬA HÀNG CHÍNH HÃNG</div>
        <h1>Đủ đồ. Sẵn sàng tập.</h1>
        <p>
          Hơn {products.length} dụng cụ, phụ kiện, trang phục và dinh dưỡng thể
          thao sẵn sàng nhận tại phòng tập.
        </p>
      </div>

      {/* Thanh Tabs Danh mục kiểu Shopee */}
      <Paper variant="outlined" sx={{ mb: 2.5, bgcolor: "background.paper" }}>
        <Tabs
          value={category}
          onChange={(_, val) => update("loai", val)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat === "Tất cả"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <Tab
                key={cat}
                value={cat}
                label={`${cat} (${count})`}
                sx={{ fontWeight: 600 }}
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Thanh Sắp xếp kiểu Shopee + Ô lọc nhanh */}
      <Paper
        variant="outlined"
        sx={{
          p: 1.75,
          mb: 2.5,
          bgcolor: (t) =>
            t.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#f3f6ec",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mr: 0.5, fontWeight: 600 }}
            >
              Sắp xếp theo:
            </Typography>
            {[
              { id: "popular", label: "Phổ biến" },
              { id: "bestseller", label: "Bán chạy" },
              { id: "newest", label: "Mới nhất" },
            ].map((opt) => (
              <Chip
                key={opt.id}
                label={opt.label}
                clickable
                color={sort === opt.id ? "primary" : "default"}
                variant={sort === opt.id ? "filled" : "outlined"}
                onClick={() => update("sapxep", opt.id)}
                sx={{ fontWeight: 600 }}
              />
            ))}

            <FormControl
              size="small"
              sx={{ minWidth: 185, bgcolor: "background.paper" }}
            >
              <InputLabel id="shop-price-sort-label">Giá</InputLabel>
              <Select
                labelId="shop-price-sort-label"
                value={["asc", "desc"].includes(sort) ? sort : ""}
                label="Giá"
                onChange={(e) => update("sapxep", e.target.value || "popular")}
              >
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="asc">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="desc">Giá: Cao đến Thấp</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            size="small"
            placeholder="Lọc nhanh trong danh mục..."
            value={query}
            onChange={(e) => update("q", e.target.value)}
            sx={{ minWidth: { xs: "100%", md: 260 }, bgcolor: "background.paper" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="caption" color="text.secondary">
          Hiển thị <b>{paginatedProducts.length}</b> / <b>{shown.length}</b> sản
          phẩm · Trang {currentPage} / {totalPages}
        </Typography>
        {(query || category !== "Tất cả" || sort !== "popular") && (
          <Button size="small" onClick={() => setParams({})}>
            Xóa bộ lọc
          </Button>
        )}
      </Stack>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 2.5 }}
          action={
            <Button component={Link} to="/gio-hang" size="small" color="inherit">
              Xem giỏ hàng →
            </Button>
          }
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2.25}>
        {paginatedProducts.map((p) => (
          <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <ProductCard
              product={p}
              onAdd={(id) => {
                const res = onAdd(id);
                setMessage(res.message);
                showToast(res.message, res.ok ? "success" : "warning");
              }}
            />
          </Grid>
        ))}
      </Grid>

      {shown.length > PAGE_SIZE && (
        <Stack alignItems="center" sx={{ mt: 4.5 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}

      {shown.length === 0 && (
        <div className="empty-state">
          <h2>Không tìm thấy sản phẩm phù hợp</h2>
          <p>Thử từ khóa khác hoặc bấm xóa bộ lọc để xem toàn bộ cửa hàng.</p>
          <Button variant="outlined" onClick={() => setParams({})}>
            Xem tất cả sản phẩm
          </Button>
        </div>
      )}
    </Box>
  );
}
