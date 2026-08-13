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
};

type WizardAction =
  | { type: "SET_USERNAME"; value: string }
  | { type: "SET_DEVICE"; value: Device; platform: Platform }
  | { type: "SET_BACKGROUND"; value: Background }
  | { type: "SET_COLOR"; value: ColorName }
  | { type: "SET_SHAPE"; value: Shape };

const initialState: WizardState = {
  username: "",
  device: null,
  devicePlatform: null,
  background: "github",
  color: "green",
  shape: "rounded",
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.value };
    case "SET_DEVICE":
      return { ...state, device: action.value, devicePlatform: action.platform };
    case "SET_BACKGROUND":
      return { ...state, background: action.value };
    case "SET_COLOR":
      return { ...state, color: action.value };
    case "SET_SHAPE":
      return { ...state, shape: action.value };
    default:
      return state;
  }
}

export function useWizardState() {
  return useReducer(wizardReducer, initialState);
}
