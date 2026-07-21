import { createContext, useContext } from "react";

export type ThemeMode = "dark" | "light";

export type ThemeColors = {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceStrong: string;
  border: string;
  borderStrong: string;
  primary: string;
  secondary: string;
  tertiary: string;
  textMain: string;
  textMuted: string;
  glowPrimary: string;
  glowSecondary: string;
  navBackground: string;
  gradientBg: [string, string, string];
  cardGradient: [string, string];
  heroGradient: [string, string, string];
};

export const darkTheme: ThemeColors = {
  background: "#05050A",
  backgroundAlt: "#0A0716",
  surface: "rgba(20, 15, 35, 0.55)",
  surfaceStrong: "rgba(28, 20, 48, 0.85)",
  border: "rgba(138, 43, 226, 0.35)",
  borderStrong: "rgba(138, 43, 226, 0.75)",
  primary: "#8A2BE2",
  secondary: "#00E5FF",
  tertiary: "#FF3D8A",
  textMain: "#FFFFFF",
  textMuted: "#A6A3B8",
  glowPrimary: "rgba(138, 43, 226, 0.7)",
  glowSecondary: "rgba(0, 229, 255, 0.6)",
  navBackground: "rgba(5, 5, 12, 0.75)",
  gradientBg: ["#05050A", "#0B0620", "#04030F"],
  cardGradient: ["rgba(28, 18, 52, 0.85)", "rgba(10, 8, 24, 0.9)"],
  heroGradient: ["#0A0620", "#160830", "#05050A"],
};

export const lightTheme: ThemeColors = {
  background: "#F4F6FB",
  backgroundAlt: "#ECECFA",
  surface: "rgba(255, 255, 255, 0.75)",
  surfaceStrong: "rgba(255, 255, 255, 0.95)",
  border: "rgba(98, 0, 234, 0.22)",
  borderStrong: "rgba(98, 0, 234, 0.55)",
  primary: "#6200EA",
  secondary: "#0088C7",
  tertiary: "#C2185B",
  textMain: "#0F0A1A",
  textMuted: "#4E4B62",
  glowPrimary: "rgba(98, 0, 234, 0.35)",
  glowSecondary: "rgba(0, 136, 199, 0.35)",
  navBackground: "rgba(244, 246, 251, 0.85)",
  gradientBg: ["#F4F6FB", "#E9E4FB", "#F4F6FB"],
  cardGradient: ["rgba(255, 255, 255, 0.95)", "rgba(240, 236, 252, 0.95)"],
  heroGradient: ["#EDE7FA", "#F4F6FB", "#F0EBFB"],
};

export const ThemeContext = createContext<{
  mode: ThemeMode;
  colors: ThemeColors;
  toggle: () => void;
}>({
  mode: "dark",
  colors: darkTheme,
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);
