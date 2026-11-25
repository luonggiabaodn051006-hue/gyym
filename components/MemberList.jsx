import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
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
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useAppContext } from "../context/AppContext";

const memberSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ tên có ít nhất 2 ký tự.")
    .max(80, "Họ tên tối đa 80 ký tự.")
    .required("Họ và tên không được để trống."),
  packageName: yup
    .string()
    .oneOf(["Basic", "Plus", "Pro"], "Gói tập không hợp lệ.")
    .required("Vui lòng chọn gói tập."),
});

const PACKAGE_COLOR = {
  Basic: "default",
  Plus: "secondary",
  Pro: "primary",
};

function MemberList({ members, setMembers }) {
  const { showToast } = useAppContext();
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      name: "",
      packageName: "Basic",
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const packageParam = searchParams.get("goi") || "all";
  const packageFilter = ["Basic", "Plus", "Pro"].includes(packageParam)
    ? packageParam
    : "all";

  function updateFilter(key, value) {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === "all") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  }

  function clearFilters() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    newParams.delete("goi");
    setSearchParams(newParams, { replace: true });
  }

  function resetForm() {
    reset({ name: "", packageName: "Basic" });
    setEditingId(null);
  }

  function onSubmitMember(formValues) {
    const cleanName = formValues.name.trim();

    if (editingId !== null) {
      setMembers((previousMembers) =>
        previousMembers.map((member) =>
          member.id === editingId
            ? {
                ...member,
                name: cleanName,
                packageName: formValues.packageName,
              }
            : member,
        ),
      );
      setMessage("Đã cập nhật thông tin hội viên.");
      showToast("Đã cập nhật hội viên.", "success");
    } else {
      const newMember = {
        id: crypto.randomUUID(),
        name: cleanName,
        packageName: formValues.packageName,
      };
      setMembers((previousMembers) => [...previousMembers, newMember]);
      setMessage("Đã thêm hội viên mới.");
      showToast(`Đã thêm hội viên ${cleanName}.`, "success");
    }

    resetForm();
  }

  function handleEditMember(member) {
    setEditingId(member.id);
    reset({
      name: member.name,
      packageName: member.packageName,
    });
    setMessage("");
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("Đã hủy chỉnh sửa.");
  }

  function handleDeleteMember(member) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hội viên "${member.name}" không?`,
    );
    if (!confirmed) return;

    setMembers((previousMembers) =>
      previousMembers.filter((item) => item.id !== member.id),
    );

    if (editingId === member.id) {
      resetForm();
    }

    setMessage("Đã xóa hội viên.");
    showToast(`Đã xóa hội viên ${member.name}.`, "info");
  }

  const filteredMembers = members.filter((member) => {
    const matchesName = member.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesPackage =
      packageFilter === "all" || member.packageName === packageFilter;
    return matchesName && matchesPackage;
  });

  return (
    <Box component="section" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.8px", mb: 2.5 }}
      >
        Quản lý hội viên
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}

      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit(onSubmitMember)}
        sx={{ p: 3.5, maxWidth: 620, mb: 4.5 }}
      >
        <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600 }}>
          {editingId !== null ? "Chỉnh sửa hội viên" : "Thêm hội viên mới"}
        </Typography>

        <Stack spacing={2.5}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="member-name"
                label="Họ và tên"
                placeholder="Nhập họ tên hội viên"
                variant="outlined"
                fullWidth
                inputProps={{ maxLength: 80 }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="packageName"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.packageName}>
                <InputLabel id="member-package-label">Gói tập</InputLabel>
                <Select
                  {...field}
                  labelId="member-package-label"
                  id="member-package"
                  label="Gói tập"
                >
                  <MenuItem value="Basic">Basic (1 tháng)</MenuItem>
                  <MenuItem value="Plus">Plus (3 tháng)</MenuItem>
                  <MenuItem value="Pro">Pro (6 tháng)</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Stack direction="row" spacing={1.5}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<PersonAddAlt1Icon />}
            >
              {editingId !== null ? "Lưu thay đổi" : "Thêm hội viên"}
            </Button>

            {editingId !== null && (
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Hủy sửa
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Danh sách hội viên
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          mb: 2.5,
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "#eff2e7",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            id="search-member"
            label="Tìm theo họ tên"
            placeholder="Ví dụ: Minh"
            size="small"
            value={search}
            onChange={(event) => updateFilter("q", event.target.value)}
            sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
          />

          <FormControl
            size="small"
            sx={{ minWidth: 190, bgcolor: "background.paper", borderRadius: 1 }}
          >
            <InputLabel id="filter-package-label">Lọc theo gói tập</InputLabel>
            <Select
              labelId="filter-package-label"
              id="filter-package"
              value={packageFilter}
              label="Lọc theo gói tập"
              onChange={(event) => updateFilter("goi", event.target.value)}
            >
              <MenuItem value="all">Tất cả gói tập</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Plus">Plus</MenuItem>
              <MenuItem value="Pro">Pro</MenuItem>
            </Select>
          </FormControl>

          <Button type="button" variant="outlined" onClick={clearFilters}>
            Xóa bộ lọc
          </Button>
        </Stack>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Hiển thị {filteredMembers.length} / {members.length} hội viên
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "#e8eddd",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Họ tên</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gói tập</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredMembers.map((member, index) => (
              <TableRow key={member.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{member.name}</TableCell>
                <TableCell>
                  <Chip
                    label={member.packageName}
                    size="small"
                    color={PACKAGE_COLOR[member.packageName] || "default"}
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title={`Sửa hội viên ${member.name}`}>
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label={`Sửa hội viên ${member.name}`}
                        onClick={() => handleEditMember(member)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={`Xóa hội viên ${member.name}`}>
                      <IconButton
                        size="small"
                        color="error"
                        aria-label={`Xóa hội viên ${member.name}`}
                        onClick={() => handleDeleteMember(member)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {members.length === 0
                      ? "Chưa có hội viên. Hãy thêm hội viên mới."
                      : "Không có hội viên phù hợp với bộ lọc."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MemberList;
