"use client";

import { useReducer } from "react";
import type { Device } from "@/lib/devices";
import type { Background, ColorName, Shape } from "@/lib/build-image-url";

export type Platform = "apple" | "android";

/**
 * Platform is deliberately absent: it is decided by which hero button opened
 * the drawer, so it arrives as a prop rather than as wizard state.
 *
 * `device` is stored with the platform it was picked under. The drawer stays
 * mounted between openings, so without that tag an Android phone chosen in one
 * session would still be selected after reopening for iOS.
 */
export type WizardState = {
  username: string;
  device: Device | null;
  devicePlatform: Platform | null;
  background: Background;
  color: ColorName;
  shape: Shape;
  /**
   * False until the client has picked the wallpaper style (the stored one, or
   * the theme's default). Before that the style is the server's guess.
   */
  styleReady: boolean;
};

export type WizardAction =
  | { type: "SET_USERNAME"; value: string }
  | { type: "SET_DEVICE"; value: Device; platform: Platform }
  | { type: "SET_BACKGROUND"; value: Background }
  | { type: "SET_COLOR"; value: ColorName }
  | { type: "SET_SHAPE"; value: Shape }
  /** Not a visitor's edit: the style picked on mount (stored or themed). */
  | { type: "RESTORE_STYLE"; value: Partial<WallpaperStyle> };

export type WallpaperStyle = Pick<WizardState, "background" | "color" | "shape">;

/**
 * The wallpaper style everyone starts on. `background` is only what the server
 * renders: on mount it becomes the one matching the site's theme (see
 * `themedBackground`), unless the visitor has a stored style.
 */
export const DEFAULT_STYLE = {
  background: "dark",
  color: "green",
  shape: "rounded",
} as const satisfies WallpaperStyle;

/** The default wallpaper background for the theme the site is shown in. */
export function themedBackground(dark: boolean): Background {
  return dark ? "dark" : "light";
}

const initialState: WizardState = {
  username: "",
  device: null,
  devicePlatform: null,
  ...DEFAULT_STYLE,
  styleReady: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.value };
    case "SET_DEVICE":
      return {
        ...state,
        device: action.value,
        devicePlatform: action.platform,
      };
    case "SET_BACKGROUND":
      return { ...state, background: action.value };
    case "SET_COLOR":
      return { ...state, color: action.value };
    case "SET_SHAPE":
      return { ...state, shape: action.value };
    case "RESTORE_STYLE":
      return { ...state, ...action.value, styleReady: true };
    default:
      return state;
  }
}

export function useWizardState() {
  return useReducer(wizardReducer, initialState);
}
