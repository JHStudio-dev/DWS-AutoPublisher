import {
  DEFAULT_THEME_KEY,
  themes,
  type ThemeKey,
  type ThemeTokens,
} from "./themes";

export { DEFAULT_THEME_KEY, themes };
export type { ThemeKey, ThemeTokens };

export type ThemeCssVars = Record<`--dws-color-${string}`, string>;

const tokenToCssVar: Record<keyof ThemeTokens, `--dws-color-${string}`> = {
  background: "--dws-color-background",
  surface: "--dws-color-surface",
  surfaceMuted: "--dws-color-surface-muted",
  border: "--dws-color-border",
  text: "--dws-color-text",
  textMuted: "--dws-color-text-muted",
  primary: "--dws-color-primary",
  primaryHover: "--dws-color-primary-hover",
  accent: "--dws-color-accent",
  danger: "--dws-color-danger",
  success: "--dws-color-success",
  warning: "--dws-color-warning",
};

export function resolveThemeKey(key?: string | null): ThemeKey {
  return key && key in themes ? (key as ThemeKey) : DEFAULT_THEME_KEY;
}

export function themeCssVars(key: ThemeKey): ThemeCssVars {
  const tokens = themes[key];
  const vars = {} as ThemeCssVars;
  for (const tokenKey of Object.keys(tokens) as (keyof ThemeTokens)[]) {
    vars[tokenToCssVar[tokenKey]] = tokens[tokenKey];
  }
  return vars;
}
