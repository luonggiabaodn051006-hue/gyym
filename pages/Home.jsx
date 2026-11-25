import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import ProductArt from "../components/ProductArt";
import ProductCard from "../components/ProductCard";
import ApiMotivationBanner from "../components/ApiMotivationBanner";
import { useAppContext } from "../context/AppContext";

const CATEGORY_CARDS = [
  {
    name: "Dụng cụ",
    desc: "Tạ tay, thảm yoga, dây nhảy, xà đơn",
    icon: <FitnessCenterIcon />,
  },
  {
    name: "Phụ kiện",
    desc: "Bình giữ nhiệt, túi gym, găng tay, đồng hồ",
    icon: <SportsHandballIcon />,
  },
  {
    name: "Trang phục",
    desc: "Áo Dry-Fit, giày chạy bộ & tập gym",
    icon: <CheckroomIcon />,
  },
  {
    name: "Dinh dưỡng",
    desc: "Whey Protein Isolate, thanh năng lượng",
    icon: <LocalDrinkIcon />,
  },
];

export default function Home({ products, onAdd }) {
  const [message, setMessage] = useState("");
  const { showToast } = useAppContext();

  function add(id) {
    const res = onAdd(id);
    setMessage(res.message);
    showToast(res.message, res.ok ? "success" : "warning");
  }

  const featuredVisual = products[1] || products[0];

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">FITNESS STUDIO / EVERYDAY MOVEMENT</div>
          <h1>
            Tốt hơn
            <br />
            từ <em>hôm nay.</em>
          </h1>
          <p>
            Tập luyện theo cách của bạn. Tìm lớp tập yêu thích và mua sắm trọn
            bộ dụng cụ, phụ kiện, dinh dưỡng thể thao chính hãng.
          </p>
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            sx={{ my: 3.5 }}
          >
            <Button
              component={Link}
              to="/cua-hang"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowOutwardIcon fontSize="small" />}
            >
              Mua sắm ngay ({products.length} sản phẩm)
            </Button>
            <Link className="text-link" to="/goi-tap">
              Xem gói tập →
            </Link>
          </Stack>
          <div className="hero-caption">
            <span className="small-square" /> Mỗi buổi tập là một bước tiến.
          </div>
        </div>
        {featuredVisual && (
          <div className="hero-visual">
            <div className="visual-top">
              THE DAILY
              <br />
              ESSENTIALS <span>01 / {String(products.length).padStart(2, "0")}</span>
            </div>
            <ProductArt product={featuredVisual} />
            <div className="visual-bottom">
              <span>
                MOVE MORE.
                <br />
                <b>FEEL BETTER.</b>
              </span>
              <Link to={"/cua-hang/" + featuredVisual.id} aria-label="Xem chi tiết">
                ↗
              </Link>
            </div>
          </div>
        )}
      </section>

      <div className="benefit-strip">
        <span>
          <b>01</b> {products.length} sản phẩm chính hãng
        </span>
        <span>
          <b>02</b> Lịch lớp hàng tuần
        </span>
        <span>
          <b>03</b> Nhận hàng tại phòng tập
        </span>
      </div>

      {/* Danh mục sản phẩm nhanh kiểu Shopee */}
      <Box component="section" sx={{ pt: 4, pb: 1 }}>
        <div className="eyebrow">DANH MỤC NỔI BẬT</div>
        <Grid container spacing={2}>
          {CATEGORY_CARDS.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <Grid key={cat.name} size={{ xs: 6, md: 3 }}>
                <Paper
                  component={Link}
                  to={`/cua-hang?loai=${encodeURIComponent(cat.name)}`}
                  variant="outlined"
                  sx={{
                    p: 2.25,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.75,
                    height: "100%",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "#263f2a",
                      color: "#d8eb9b",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {cat.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {cat.name} ({count})
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {cat.desc}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box component="section" sx={{ py: 5 }}>
        <ApiMotivationBanner />

        <div className="section-heading">
          <div>
            <div className="eyebrow">GỢI Ý HÔM NAY</div>
            <h2>Sản phẩm bán chạy tại FITNESS.</h2>
          </div>
          <Link className="text-link" to="/cua-hang">
            Xem tất cả {products.length} sản phẩm ↗
          </Link>
        </div>

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
          {products.slice(0, 8).map((p) => (
            <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={p} onAdd={add} />
            </Grid>
          ))}
        </Grid>

        <Stack alignItems="center" sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/cua-hang"
            variant="outlined"
            size="large"
            endIcon={<ArrowOutwardIcon fontSize="small" />}
          >
            Khám phá thêm {Math.max(0, products.length - 8)} sản phẩm khác
          </Button>
        </Stack>
      </Box>

      <section className="membership-banner">
        <div>
          <div className="eyebrow">DÀNH THỜI GIAN CHO BẢN THÂN</div>
          <Typography variant="h4" component="h2" sx={{ mb: 1.5, fontWeight: 500 }}>
            Một thói quen mới.
            <br />
            Một phiên bản khỏe hơn.
          </Typography>
          <p>Tìm gói tập phù hợp và bắt đầu hành trình của bạn.</p>
        </div>
        <Button
          component={Link}
          to="/goi-tap"
          variant="contained"
          color="secondary"
          endIcon={<ArrowOutwardIcon fontSize="small" />}
          sx={{ whiteSpace: "nowrap" }}
        >
          Xem các gói tập
        </Button>
      </section>
    </>
  );
}
