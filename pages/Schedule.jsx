import { Link } from "react-router-dom";
import { Box, Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

function Schedule({ classes, members, bookings }) {
  const visibleBookings = bookings.filter(
    (booking) =>
      members.some((member) => member.id === booking.memberId) &&
      classes.some((gymClass) => gymClass.id === booking.classId),
  );

  return (
    <Box component="section" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 600, letterSpacing: "-0.8px", mb: 1 }}
      >
        Lịch tập FITNESS
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Lịch lớp nhóm lặp lại hàng tuần tại phòng tập. Để đăng ký xếp lớp, vui
        lòng liên hệ quầy lễ tân hoặc gửi yêu cầu Tư vấn PT.
      </Typography>

      <Grid container spacing={2.75}>
        {classes.map((gymClass) => {
          const registeredCount = visibleBookings.filter(
            (booking) => booking.classId === gymClass.id,
          ).length;
          const isFull = registeredCount >= gymClass.capacity;

          return (
            <Grid key={gymClass.id} size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3.5, height: "100%" }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Chip
                    label={gymClass.day}
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 700 }}
                  />
                  <Chip
                    label={isFull ? "Lớp đã đầy" : "Đang mở đăng ký"}
                    size="small"
                    color={isFull ? "error" : "success"}
                    variant="outlined"
                  />
                </Stack>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 1.5, fontWeight: 600 }}
                >
                  {gymClass.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                  <strong>Huấn luyện viên:</strong> {gymClass.coach}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                  <strong>Giờ tập:</strong> {gymClass.time}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                  <strong>Sĩ số hiện tại:</strong> {registeredCount}/
                  {gymClass.capacity} học viên
                </Typography>

                <Button
                  component={Link}
                  to="/lien-he"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<EventAvailableIcon />}
                  disabled={isFull}
                >
                  {isFull ? "Lớp đã đầy" : "Liên hệ đăng ký giữ chỗ"}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default Schedule;
