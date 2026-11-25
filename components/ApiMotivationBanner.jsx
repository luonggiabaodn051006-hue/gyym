import { useState } from "react";
import { Box, Chip, IconButton, Paper, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAppContext } from "../context/AppContext";
import styles from "./ApiMotivationBanner.module.css";

export default function ApiMotivationBanner() {
  const { quotes, quotesSource, quotesLoading } = useAppContext();
  const [index, setIndex] = useState(0);

  if (quotesLoading) {
    return (
      <Paper variant="outlined" className={styles.banner} sx={{ mb: 3 }}>
        <Box sx={{ width: "100%" }}>
          <Skeleton width={180} height={24} />
          <Skeleton width="80%" height={28} />
        </Box>
      </Paper>
    );
  }

  if (!quotes.length) return null;

  const current = quotes[index % quotes.length];

  return (
    <Paper
      variant="outlined"
      className={styles.banner}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(169, 201, 107, 0.08)" : "#eff4e4",
        borderColor: "divider",
      }}
    >
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
          <Chip
            size="small"
            icon={<AutoAwesomeIcon fontSize="small" />}
            label={`Góc cảm hứng · API (${quotesSource})`}
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Typography variant="body1" className={styles.quoteText} sx={{ fontWeight: 500 }}>
          “{current.quote}”
        </Typography>
        <Typography variant="caption" color="text.secondary">
          — {current.author}
        </Typography>
      </Box>

      <Tooltip title="Đổi câu truyền cảm hứng">
        <IconButton
          color="primary"
          onClick={() => setIndex((prev) => prev + 1)}
          aria-label="Đổi câu truyền cảm hứng"
        >
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
