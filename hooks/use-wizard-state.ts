"use client";

import { useReducer } from "react";
import type { Device } from "@/lib/devices";
import type { Background, ColorName, Shape } from "@/lib/build-image-url";

export type Platform = "apple" | "android";

export type WizardState = {
  username: string;
  platform: Platform | null;
  device: Device | null;
  background: Background;
  color: ColorName;
  shape: Shape;
};

type WizardAction =
  | { type: "SET_USERNAME"; value: string }
  | { type: "SET_PLATFORM"; value: Platform }
  | { type: "SET_DEVICE"; value: Device }
  | { type: "SET_BACKGROUND"; value: Background }
  | { type: "SET_COLOR"; value: ColorName }
  | { type: "SET_SHAPE"; value: Shape };

const initialState: WizardState = {
  username: "",
  platform: null,
  device: null,
  background: "github",
  color: "green",
  shape: "rounded",
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.value };
    case "SET_PLATFORM":
      // Changing platform invalidates a previously chosen device (different device pools).
      return { ...state, platform: action.value, device: null };
    case "SET_DEVICE":
      return { ...state, device: action.value };
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
