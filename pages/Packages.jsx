import { Link } from "react-router-dom";
import { Box, Button, Chip, Grid } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { packages, money } from "../data";

export default function Packages() {
  return (
    <Box component="section" sx={{ py: 5 }}>
      <div className="page-heading">
        <div className="eyebrow">FITNESS / MEMBERSHIP</div>
        <h1>Chọn nhịp tập của bạn.</h1>
        <p>Một khởi đầu nhỏ cho một hành trình dài.</p>
      </div>
      <Grid container spacing={2.75}>
        {packages.map((p) => (
          <Grid key={p.id} size={{ xs: 12, md: 4 }}>
            <article
              className={"plan-card " + (p.id === "plus" ? "featured" : "")}
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <div className="plan-top" style={{ alignItems: "center" }}>
                <span>{p.months} THÁNG</span>
                {p.id === "plus" && (
                  <Chip
                    label="GÓI ĐỀ XUẤT"
                    size="small"
                    color="secondary"
                    sx={{ height: 22, fontSize: 10, fontWeight: 700 }}
                  />
                )}
              </div>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <div className="plan-price">{money(p.price)}</div>
              <small>Giá trọn gói</small>
              <ul style={{ flexGrow: 1 }}>
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <Button
                component={Link}
                to={"/thanh-toan?goi=" + p.id}
                variant="contained"
                color={p.id === "plus" ? "secondary" : "primary"}
                fullWidth
                endIcon={<ArrowOutwardIcon fontSize="small" />}
              >
                Chọn gói {p.name}
              </Button>
            </article>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
