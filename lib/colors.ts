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
