import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { postConsultationForm } from "../services/api";
import { useAppContext } from "../context/AppContext";

const consultationSchema = yup.object({
  firstName: yup.string().trim().required("Vui lòng nhập tên."),
  lastName: yup.string().trim().required("Vui lòng nhập họ."),
  email: yup
    .string()
    .trim()
    .email("Email không đúng định dạng.")
    .required("Vui lòng nhập email."),
  phone: yup
    .string()
    .trim()
    .matches(/^0\d{9}$/, "Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.")
    .required("Vui lòng nhập số điện thoại."),
  dob: yup.string().required("Vui lòng chọn ngày sinh."),
  gender: yup
    .string()
    .oneOf(["female", "male", "other"], "Vui lòng chọn giới tính.")
    .required("Vui lòng chọn giới tính."),
  goal: yup.string().required("Vui lòng chọn mục tiêu tập luyện."),
  address: yup
    .string()
    .trim()
    .min(5, "Địa chỉ / mô tả cần ít nhất 5 ký tự.")
    .required("Vui lòng nhập địa chỉ hoặc nhu cầu tập luyện."),
  agree: yup
    .boolean()
    .oneOf([true], "Bạn cần đồng ý cho phép FITNESS Studio liên hệ tư vấn."),
});

export default function Contact({ onAddConsultation }) {
  const { showToast } = useAppContext();
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(consultationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "female",
      goal: "fitness",
      address: "",
      agree: false,
    },
  });

  async function onSubmit(data) {
    setApiError("");
    setApiResult(null);
    if (onAddConsultation) {
      onAddConsultation({
        id: crypto.randomUUID(),
        ...data,
        status: "new",
        createdAt: new Date().toISOString(),
      });
    }
    try {
      const responseData = await postConsultationForm(data);
      setApiResult(responseData);
      showToast(
        `Gửi thông tin thành công! Đã chuyển tới Admin & API (#${responseData.id}).`,
        "success",
      );
      reset();
    } catch {
      setApiError("Đã lưu yêu cầu cho Admin nhưng chưa kết nối được API từ xa.");
      showToast("Đã lưu yêu cầu tư vấn cho Admin.", "info");
    }
  }

  return (
    <Box component="section" sx={{ py: 5 }}>
      <div className="page-heading">
        <div className="eyebrow">FITNESS / ĐĂNG KÝ TƯ VẤN PT</div>
        <h1>Thông tin cá nhân & Lộ trình tập.</h1>
        <p>
          Gửi thông tin để huấn luyện viên FITNESS Studio liên hệ tư vấn và lưu
          vào bảng quản trị Admin.
        </p>
      </div>

      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 680, mx: "auto" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h5" fontWeight={600}>
            Personal Information Form
          </Typography>
          <Chip label="POST /posts" size="small" color="secondary" />
        </Stack>

        <Stack spacing={2.5}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Họ (Last Name)"
                  variant="outlined"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên (First Name)"
                  variant="outlined"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="filled"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
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
                  variant="filled"
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
          </Stack>

          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ngày sinh (Date of Birth)"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dob}
                helperText={errors.dob?.message}
              />
            )}
          />

          <FormControl error={!!errors.gender}>
            <FormLabel id="gender-group-label">Giới tính (Gender)</FormLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup row aria-labelledby="gender-group-label" {...field}>
                  <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                  <FormControlLabel value="male" control={<Radio />} label="Nam" />
                  <FormControlLabel value="other" control={<Radio />} label="Khác" />
                </RadioGroup>
              )}
            />
            {errors.gender && (
              <FormHelperText>{errors.gender.message}</FormHelperText>
            )}
          </FormControl>

          <Controller
            name="goal"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.goal}>
                <InputLabel id="goal-select-label">Mục tiêu tập luyện</InputLabel>
                <Select
                  {...field}
                  labelId="goal-select-label"
                  label="Mục tiêu tập luyện"
                >
                  <MenuItem value="fitness">Cải thiện vóc dáng & Thể lực</MenuItem>
                  <MenuItem value="muscle">Tăng cơ & Sức mạnh</MenuItem>
                  <MenuItem value="yoga">Yoga & Giãn cơ phục hồi</MenuItem>
                  <MenuItem value="cardio">Cardio & Sức bền</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Địa chỉ & Ghi chú mục tiêu (Address)"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />

          <Box>
            <Controller
              name="agree"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Tôi đồng ý nhận lịch hẹn tư vấn từ huấn luyện viên FITNESS Studio."
                />
              )}
            />
            {errors.agree && (
              <FormHelperText error>{errors.agree.message}</FormHelperText>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={isSubmitting}
            endIcon={<SendIcon />}
          >
            {isSubmitting ? "Đang gửi qua Axios..." : "SUBMIT"}
          </Button>

          {apiError && <Alert severity="warning">{apiError}</Alert>}

          {apiResult && (
            <Alert severity="success">
              <Typography variant="subtitle2" fontWeight={700}>
                Phản hồi từ API (ID: {apiResult.id})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2">
                Học viên:{" "}
                <strong>
                  {apiResult.lastName} {apiResult.firstName}
                </strong>{" "}
                — {apiResult.email} ({apiResult.phone})
              </Typography>
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
