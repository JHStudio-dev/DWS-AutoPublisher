import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { DEFAULT_THEME_KEY, themeCssVars } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "DWS PublishFlow",
  description: "Plataforma interna de gestión de inventario y publicaciones",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeKey = DEFAULT_THEME_KEY;
  const themeStyle = themeCssVars(themeKey) as CSSProperties;

  return (
    <html
      lang="es"
      data-dws-theme={themeKey}
      style={themeStyle}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
