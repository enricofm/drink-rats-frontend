export const theme = {
  colors: {
    primary: "#732514",
    appBackground: "#0D0805",
    loginBackground: "#CF8D3C",
    secondary: "#3E3A38",
    white: "#FFFFFF",
    error: "#DC2626",
    success: "#16A34A",
    warning: "#F59E0B",
    textPrimary: "#FFFFFF",
    textSecondary: "#D1D5DB",
    textMuted: "#9CA3AF",
    border: "#3E3A38",
    cardBackground: "#1A1614",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const

export type Theme = typeof theme
