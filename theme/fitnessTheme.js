import { createTheme } from "@mui/material/styles";
import * as muiSystem from "@mui/system";

// Tham chiếu defaultTheme từ @mui/system (Chapter VII - Material UI)
export const baseDefaultTheme = muiSystem.defaultTheme || createTheme();

export function createFitnessTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#a9c96b" : "#263f2a",
        light: "#38563b",
        dark: "#18251b",
        contrastText: isDark ? "#18251b" : "#ffffff",
      },
      secondary: {
        main: "#84a348",
        light: "#d8eb9b",
        dark: "#5c7430",
        contrastText: "#1c281d",
      },
      background: {
        default: isDark ? "#121813" : "#f8f8f3",
        paper: isDark ? "#1b241d" : "#ffffff",
      },
      text: {
        primary: isDark ? "#eef3e8" : "#20291f",
        secondary: isDark ? "#b2bea8" : "#6f7765",
      },
      divider: isDark ? "#2d3a30" : "#dde2d6",
    },
    typography: {
      fontFamily:
        baseDefaultTheme.typography.fontFamily || "Arial, Helvetica, sans-serif",
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            padding: "10px 18px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
