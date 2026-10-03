/**
 * App Theme Configuration
 * Defines colors, typography, and spacing constants across environments.
 */
import "@/global.css";
import { Platform } from "react-native";

// --- COLORS ---

export const Colors = {
  light: {
    text: "#000000",
    background: "#ffffff",
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: "#60646C",
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// --- TYPOGRAPHY ---

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui", // UIFontDescriptorSystemDesignDefault
    serif: "ui-serif", // UIFontDescriptorSystemDesignSerif
    rounded: "ui-rounded", // UIFontDescriptorSystemDesignRounded
    mono: "ui-monospace", // UIFontDescriptorSystemDesignMonospaced
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

// --- LAYOUT & SPACING ---

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
    default: 0,
  }) ?? 0;

export const MaxContentWidth = 800;
