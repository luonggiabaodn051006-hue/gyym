import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { money } from "../data";
import { getCheckoutLines, orderTotal } from "../shopLogic";
import { postOrderToApi } from "../services/api";
import { useAppContext } from "../context/AppContext";

const checkoutSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Họ tên cần ít nhất 2 ký tự.")
    .max(80, "Họ tên tối đa 80 ký tự.")
    .required("Vui lòng nhập họ và tên."),
  phone: yup
    .string()
    .trim()
    .matches(/^0\d{9}$/, "Số điện thoại cần 10 chữ số, bắt đầu bằng 0.")
    .required("Vui lòng nhập số điện thoại."),
  email: yup
    .string()
    .trim()
    .email("Email không đúng định dạng.")
    .required("Vui lòng nhập email nhận xác nhận."),
  note: yup.string().max(300, "Ghi chú tối đa 300 ký tự."),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "Vui lòng xác nhận đồng ý quy định nhận hàng và chuyển khoản."),
});

export default function Checkout({ products, cart, onCreateOrder, sandbox }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [serverError, setServerError] = useState("");

  const packageId = params.get("goi") || "";
  const lines = getCheckoutLines(cart, packageId, products);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      note: "",
      agreeTerms: false,
    },
  });

  async function onSubmit(formData) {
    setServerError("");
    const result = onCreateOrder(formData, packageId);
    if (!result.ok) {
      setServerError(result.message);
      return;
    }

    const apiResponse = await postOrderToApi({
      id: result.id,
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        note: formData.note?.trim() || "",
      },
      items: lines,
      total: orderTotal(lines),
    });

    if (apiResponse.ok) {
      showToast(
        `Đã lưu đơn ${result.id} & đồng bộ API (#${apiResponse.apiId}).`,
        "success",
      );
    } else {
      showToast(`Đã lưu đơn ${result.id} trên thiết bị.`, "info");
    }

    navigate("/don-hang/" + result.id);
  }

  if (sandbox)
    return (
      <div className="empty-state">
        <h1>Thanh toán chuyển khoản</h1>
        <p>
          Thoát Sandbox bằng nút cuối trang để sử dụng thông tin nhận tiền thật.
        </p>
      </div>
    );

  if (!lines.length)
    return (
      <div className="empty-state">
        <h1>{packageId ? "Gói tập không tồn tại" : "Giỏ hàng đang trống"}</h1>
        <Button
          component={Link}
          to={packageId ? "/goi-tap" : "/cua-hang"}
          variant="contained"
        >
          Quay lại lựa chọn
        </Button>
      </div>
    );

  return (
    <Box component="section" sx={{ py: 5 }}>
      <div className="page-heading">
        <div className="eyebrow">FITNESS / THANH TOÁN</div>
        <h1>Hoàn tất thông tin.</h1>
        <p>Tạo đơn trên thiết bị và đồng bộ dữ liệu qua Axios POST API.</p>
      </div>

      <form className="checkout-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Paper variant="outlined" sx={{ p: 3.5 }}>
          <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600 }}>
            Thông tin người đăng ký
          </Typography>

          <Stack spacing={2.5}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Số điện thoại"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  required
                  inputProps={{ maxLength: 10 }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email nhận xác nhận"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Ghi chú"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Thông tin cần lưu cùng đơn hàng"
                  error={!!errors.note}
                  helperText={errors.note?.message}
                />
              )}
            />

            <Box>
              <Controller
                name="agreeTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Tôi xác nhận thông tin chính xác và đồng ý nhận hàng / đối chiếu chuyển khoản tại phòng tập."
                  />
                )}
              />
              {errors.agreeTerms && (
                <FormHelperText error>
                  {errors.agreeTerms.message}
                </FormHelperText>
              )}
            </Box>

            <Alert severity="info">
              Đơn được lưu vào hệ thống đồng thời gửi bản ghi lên REST API
              (`jsonplaceholder.typicode.com/posts`) qua Axios.
            </Alert>

            {serverError && <Alert severity="error">{serverError}</Alert>}
          </Stack>
        </Paper>

        <Paper
          variant="outlined"
          sx={{
            p: 3.5,
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "background.paper" : "#eef2e4",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Đơn hàng của bạn
          </Typography>
          <Stack spacing={1.5} divider={<Divider />}>
            {lines.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
              >
                <Typography variant="body2">
                  {item.name} × {item.quantity}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {money(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Tổng cộng
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {money(orderTotal(lines))}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi & lưu đơn…" : "Lưu đơn & xem QR →"}
          </Button>
        </Paper>
      </form>
    </Box>
  );
}
