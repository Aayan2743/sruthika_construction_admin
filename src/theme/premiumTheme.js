import { createTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

const brand = {
  primary: "#0f3d3e",
  teal: "#0b5a5b",
  cyan: "#0e7490",
  accent: "#22d3ee"
};

export const premiumTheme = createTheme({
  palette: {
    
    mode: "light",
    primary: { main: brand.primary },
    secondary: { main: brand.cyan },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff"
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569"
    }
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      "\"Inter\", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
    h5: { fontWeight: 800, letterSpacing: "-0.02em" },
    h6: { fontWeight: 800, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 700 }
  },
  shadows: [
    "none",
    "0 1px 2px rgba(15, 23, 42, 0.06)",
    "0 2px 8px rgba(15, 23, 42, 0.08)",
    "0 4px 14px rgba(15, 23, 42, 0.10)",
    "0 8px 24px rgba(15, 23, 42, 0.12)",
    ...Array.from({ length: 20 }, () => "0 10px 30px rgba(15, 23, 42, 0.12)")
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(900px 450px at 10% 0%, rgba(34, 211, 238, 0.12), transparent 60%)," +
            "radial-gradient(900px 450px at 90% 10%, rgba(14, 116, 144, 0.10), transparent 55%)," +
            "#f5f7fb"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 14,
          paddingBlock: 9
        },
        containedPrimary: {
          background:
            "linear-gradient(135deg, #0f3d3e 0%, #0b5a5b 55%, #0e7490 100%)",
          boxShadow: "0 10px 24px rgba(14, 116, 144, 0.18)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #0b3435 0%, #094b4c 55%, #0b5f78 100%)"
          }
        },
        outlinedPrimary: {
          borderColor: alpha(brand.cyan, 0.4),
          "&:hover": {
            borderColor: alpha(brand.cyan, 0.7),
            backgroundColor: alpha(brand.cyan, 0.06)
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: { size: "small" }
    },
    MuiSelect: {
      defaultProps: { size: "small" }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 18,
          borderBottomLeftRadius: 18
        }
      }
    }
  }
});

