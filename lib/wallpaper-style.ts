import type { WallpaperStyle } from "@/hooks/use-wizard-state";
import { BACKGROUND_OPTIONS, COLOR_OPTIONS, SHAPE_OPTIONS } from "@/lib/colors";

/**
 * The wallpaper style the visitor last picked, kept in `localStorage` so the
 * phone comes back the way they left it. Written only once they change
 * something, so an untouched visitor keeps getting the theme's default.
 */
const STORAGE_KEY = "wallpaper-style";

export function readWallpaperStyle(): WallpaperStyle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value: Partial<WallpaperStyle> = JSON.parse(raw);
    // Stored by an older build, or edited by hand: anything the pickers no
    // longer offer is dropped rather than sent to the image API.
    const valid =
      BACKGROUND_OPTIONS.some((option) => option.value === value.background) &&
      COLOR_OPTIONS.some((option) => option.value === value.color) &&
      SHAPE_OPTIONS.some((option) => option.value === value.shape);
    return valid ? (value as WallpaperStyle) : null;
  } catch {
    return null;
  }
}

export function storeWallpaperStyle(style: WallpaperStyle) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(style));
  } catch {
    // Not persisted, but still applied for this visit.
  }
}
