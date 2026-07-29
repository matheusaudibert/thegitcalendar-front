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

export const IMAGE_ENDPOINT = "https://gitcallendar-image.vercel.app/graph";

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
