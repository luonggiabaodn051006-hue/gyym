import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

export default function Footer({ sandbox, onResetSandbox, onToggleSandbox }) {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#161d17" : "#f0f2e9",
        pt: 5,
        pb: 2.5,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "-1.2px",
                color: "text.primary",
                mb: 1.5,
              }}
            >
              FITNESS
              <Box component="span" sx={{ color: "#809f46" }}>
                .
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
              Tập luyện đều đặn. Chăm sóc bản thân mỗi ngày với gói tập linh
              hoạt, lịch lớp khoa học và dụng cụ chuẩn phòng tập.
            </Typography>
          </Grid>

          <Grid size={{ xs: 6, md: 3.5 }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                letterSpacing: "1.6px",
                color: "text.secondary",
                fontWeight: 700,
                mb: 1,
              }}
            >
              KHÁM PHÁ
            </Typography>
            <Stack spacing={1}>
              <Typography
                component={Link}
                to="/cua-hang"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Cửa hàng
              </Typography>
              <Typography
                component={Link}
                to="/goi-tap"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Gói tập
              </Typography>
              <Typography
                component={Link}
                to="/lich-tap"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Lịch tập
              </Typography>
              <Typography
                component={Link}
                to="/lien-he"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Đăng ký tư vấn PT
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3.5 }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                letterSpacing: "1.6px",
                color: "text.secondary",
                fontWeight: 700,
                mb: 1,
              }}
            >
              ĐƠN HÀNG
            </Typography>
            <Stack spacing={1}>
              <Typography
                component={Link}
                to="/gio-hang"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Giỏ hàng
              </Typography>
              <Typography
                component={Link}
                to="/don-hang"
                variant="body2"
                color="text.secondary"
                sx={{ "&:hover": { color: "primary.main" } }}
              >
                Đơn trên thiết bị này
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nhận hàng tại phòng tập.
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Typography variant="caption" color="text.secondary">
            FITNESS © 2026
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Typography variant="caption" color="text.secondary">
              {sandbox ? "Đang thử dữ liệu" : "Dữ liệu lưu trên trình duyệt"}
            </Typography>
            {sandbox && (
              <Button size="small" variant="outlined" onClick={onResetSandbox}>
                Làm lại dữ liệu thử
              </Button>
            )}
            <Button size="small" variant="outlined" onClick={onToggleSandbox}>
              {sandbox ? "Thoát Sandbox" : "Bật Sandbox"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
