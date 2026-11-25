import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import ProductArt from "./ProductArt";
import { money } from "../data";

const StyledProductCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  overflow: "hidden",
  boxShadow: "none",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  position: "relative",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: theme.palette.primary.main,
    boxShadow: "0 8px 22px rgba(26, 40, 29, 0.1)",
  },
}));

function formatSold(sold) {
  if (!sold) return "Đã bán 120";
  if (sold >= 1000) {
    return `Đã bán ${(sold / 1000).toFixed(1).replace(".0", "")}k`;
  }
  return `Đã bán ${sold}`;
}

export default function ProductCard({ product, onAdd }) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <StyledProductCard className="product-card">
      <Box
        component={Link}
        to={"/cua-hang/" + product.id}
        sx={{ display: "block", position: "relative" }}
      >
        <ProductArt product={product} />

        {/* Nhãn góc trái kiểu Shopee Mall / Yêu thích */}
        {product.label && (
          <Chip
            label={product.label}
            size="small"
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              height: 20,
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.4px",
              bgcolor: "#263f2a",
              color: "#d8eb9b",
              borderRadius: "4px",
            }}
          />
        )}

        {/* Nhãn % giảm giá góc phải */}
        {discountPercent > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 10,
              bgcolor: "#d8eb9b",
              color: "#1b281d",
              px: 0.9,
              py: 0.4,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
              fontSize: 10.5,
              fontWeight: 800,
              lineHeight: 1.1,
              textAlign: "center",
            }}
          >
            -{discountPercent}%
          </Box>
        )}
      </Box>

      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
          "&:last-child": { pb: 1.75 },
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              fontSize: 9.5,
              letterSpacing: "1.2px",
              color: "text.secondary",
              fontWeight: 700,
              display: "block",
              mb: 0.4,
            }}
          >
            {product.category}
          </Typography>

          <Typography
            component={Link}
            to={"/cua-hang/" + product.id}
            variant="subtitle2"
            sx={{
              fontSize: 13.5,
              fontWeight: 600,
              lineHeight: 1.4,
              color: "text.primary",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.8em",
              mb: 1,
              "&:hover": { color: "primary.main" },
            }}
          >
            {product.name}
          </Typography>

          {/* Đánh giá sao & Lượt đã bán kiểu Shopee */}
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ mb: 1.25 }}
          >
            <Stack direction="row" spacing={0.25} alignItems="center">
              <StarIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
              <Typography variant="caption" fontWeight={700}>
                {product.rating || 4.9}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.disabled">
              |
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatSold(product.sold)}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box>
            {hasDiscount && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  textDecoration: "line-through",
                  display: "block",
                  lineHeight: 1.1,
                  fontSize: 11,
                }}
              >
                {money(product.originalPrice)}
              </Typography>
            )}
            <Typography
              variant="body1"
              color="primary.main"
              sx={{ fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}
            >
              {money(product.price)}
            </Typography>
          </Box>

          <Tooltip title={"Thêm " + product.name + " vào giỏ"}>
            <IconButton
              size="small"
              color="primary"
              aria-label={"Thêm " + product.name + " vào giỏ"}
              onClick={() => onAdd(product.id)}
              sx={{
                bgcolor: (t) =>
                  t.palette.mode === "dark"
                    ? "rgba(216,235,155,0.16)"
                    : "#eef4e4",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                },
              }}
            >
              <AddShoppingCartIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </StyledProductCard>
  );
}
