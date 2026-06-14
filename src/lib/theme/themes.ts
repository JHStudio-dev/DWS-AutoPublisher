// Theme

export type ThemeKey = "hernandez-car-import";

export type ThemeTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
};

export const DEFAULT_THEME_KEY: ThemeKey = "hernandez-car-import";

export const themes: Record<ThemeKey, ThemeTokens> = {
  "hernandez-car-import": {
    background: "#0a0a0b",
    surface: "#141416",
    surfaceMuted: "#1d1d20",
    border: "#2a2a2e",
    text: "#f5f5f6",
    textMuted: "#a1a1aa",
    primary: "#d11f2a",
    primaryHover: "#b51823",
    accent: "#c9a227",
    danger: "#dc2626",
    success: "#16a34a",
    warning: "#d97706",
  },
};
