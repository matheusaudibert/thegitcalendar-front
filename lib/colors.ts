import type { ColorName } from "@/lib/build-image-url";

export const COLOR_OPTIONS: { value: ColorName; label: string; swatch: string }[] = [
  { value: "green", label: "Green", swatch: "#39d353" },
  { value: "blue", label: "Blue", swatch: "#3b82f6" },
  { value: "purple", label: "Purple", swatch: "#a855f7" },
  { value: "red", label: "Red", swatch: "#ef4444" },
  { value: "yellow", label: "Yellow", swatch: "#eab308" },
  { value: "orange", label: "Orange", swatch: "#f97316" },
  { value: "pink", label: "Pink", swatch: "#ec4899" },
  { value: "white", label: "White", swatch: "#f5f5f5" },
  { value: "black", label: "Black", swatch: "#18181b" },
];

export const BACKGROUND_OPTIONS: { value: "github" | "dark" | "light"; label: string; swatch: string }[] = [
  { value: "github", label: "GitHub", swatch: "#0d1117" },
  { value: "dark", label: "Dark", swatch: "#1a1a1a" },
  { value: "light", label: "Light", swatch: "#ffffff" },
];
