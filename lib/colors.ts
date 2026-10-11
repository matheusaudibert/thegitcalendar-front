import type { Background, ColorName } from "@/lib/build-image-url";

/**
 * Swatches are the level-4 (brightest) shade of each theme in the renderer's
 * own palette — `app/themes.py` in the backend — so what the picker shows is
 * literally the colour a full-contribution day comes back as. Labels live in
 * the dictionaries, keyed by `value`.
 */
export const COLOR_OPTIONS: { value: ColorName; swatch: string }[] = [
  { value: "green", swatch: "#39d353" },
  { value: "blue", swatch: "#54aeff" },
  { value: "purple", swatch: "#a371f7" },
  { value: "red", swatch: "#ff7b72" },
  { value: "yellow", swatch: "#e3b341" },
  { value: "orange", swatch: "#ffa657" },
  { value: "pink", swatch: "#ff9bce" },
  { value: "white", swatch: "#ffffff" },
  { value: "black", swatch: "#000000" },
];

/** Backgrounds light enough that white text drawn over them disappears. */
export function isLightBackground(background: Background) {
  return background === "light";
}

/**
 * The lock-screen clock's colour: the swatch of the chosen contribution colour,
 * so the time is tinted like the brightest days. White on the light wallpaper
 * and black on the dark ones would vanish, so those fall back to the contrast
 * tone the clock used before.
 */
export function clockColor(color: ColorName, background: Background) {
  const light = isLightBackground(background);
  if (color === "white" && light) return "#151515";
  if (color === "black" && !light) return "#ffffff";
  return COLOR_OPTIONS.find((option) => option.value === color)?.swatch ?? "#ffffff";
}

/** Same source: the `BACKGROUND_THEMES` presets the `background` param selects. */
export const BACKGROUND_OPTIONS: { value: Background; swatch: string }[] = [
  { value: "github", swatch: "#0d1117" },
  { value: "dark", swatch: "#1a1a1a" },
  { value: "light", swatch: "#ffffff" },
];

export const SHAPE_OPTIONS: {
  value: "rounded" | "square" | "circle";
  radiusClass: string;
}[] = [
  { value: "rounded", radiusClass: "rounded-[5px]" },
  { value: "square", radiusClass: "rounded-none" },
  { value: "circle", radiusClass: "rounded-full" },
];
