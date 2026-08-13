export type Background = "github" | "dark" | "light";
export type ColorName =
  | "green"
  | "blue"
  | "purple"
  | "red"
  | "yellow"
  | "orange"
  | "pink"
  | "white"
  | "black";
export type Shape = "rounded" | "square" | "circle";

/**
 * Canonical host: `gitcallendar-image` (two L's) 307-redirects here, so we
 * point straight at the target and skip the extra hop on every image load.
 */
export const IMAGE_ENDPOINT = "https://gitcalendar-image.vercel.app/graph";

export type BuildImageUrlParams = {
  username: string;
  width: number;
  height: number;
  background: Background;
  color: ColorName;
  shape: Shape;
};

export function buildImageUrl({
  username,
  width,
  height,
  background,
  color,
  shape,
}: BuildImageUrlParams): string {
  const params = new URLSearchParams({
    username,
    background,
    color,
    shape,
    height: String(height),
    width: String(width),
  });

  return `${IMAGE_ENDPOINT}?${params.toString()}`;
}
