import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Box, Button, Chip, Stack, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import { money } from "../data";
import ProductArt from "../components/ProductArt";
import { useAppContext } from "../context/AppContext";

export default function ProductDetail({ products, onAdd }) {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [message, setMessage] = useState("");
  const { showToast } = useAppContext();

  if (!product)
    return (
      <div className="empty-state">
        <h1>Không tìm thấy sản phẩm</h1>
        <Button component={Link} to="/cua-hang" variant="contained">
          Quay lại cửa hàng
        </Button>
      </div>
    );

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;

  return (
    <Box component="section" sx={{ py: 5 }}>
      <Link className="text-link" to="/cua-hang">
        ← Cửa hàng
      </Link>
      <div className="product-detail">
        <ProductArt product={product} />
        <div>
          <Chip
            label={`${product.category} · ${product.label || "FITNESS MALL"}`}
            size="small"
            color="secondary"
            sx={{ mb: 1.5, fontWeight: 700 }}
          />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1.25 }}>
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Stack direction="row" spacing={0.4} alignItems="center">
              <StarIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
              <Typography variant="body2" fontWeight={700}>
                {product.rating || 4.9} / 5.0
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.disabled">
              |
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đã bán <b>{product.sold || 120}</b> sản phẩm
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="baseline" sx={{ my: 2.5 }}>
            <Typography variant="h4" fontWeight={800} color="primary.main">
              {money(product.price)}
            </Typography>
            {hasDiscount && (
              <Typography
                variant="body1"
                color="text.disabled"
                sx={{ textDecoration: "line-through" }}
              >
                {money(product.originalPrice)}
              </Typography>
            )}
          </Stack>

          <p>{product.description}</p>
          <ul className="detail-list">
            {(product.details || []).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={() => {
              const res = onAdd(product.id);
              setMessage(res.message);
              showToast(res.message, res.ok ? "success" : "warning");
            }}
          >
            Thêm vào giỏ hàng
          </Button>
          {message && (
            <Alert
              severity="success"
              sx={{ mt: 2.5 }}
              action={
                <Button component={Link} to="/gio-hang" size="small" color="inherit">
                  Xem giỏ →
                </Button>
              }
            >
              {message}
            </Alert>
          )}
          <p className="subtle">
            Nhận hàng tại phòng tập. Tối đa {product.maxQuantity || 10} sản phẩm cùng
            loại mỗi đơn.
          </p>
        </div>
      </div>
    </Box>
  );
}
