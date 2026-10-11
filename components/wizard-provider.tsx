"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ActionDispatch,
  type ReactNode,
  type RefObject,
} from "react";

import { useGithubUser, type GithubUserResult } from "@/hooks/use-github-user";
import {
  themedBackground,
  useWizardState,
  type WizardAction,
  type WizardState,
} from "@/hooks/use-wizard-state";
import { readWallpaperStyle, storeWallpaperStyle } from "@/lib/wallpaper-style";

/** The actions that count as the visitor customising the wallpaper. */
const STYLE_ACTIONS = new Set<WizardAction["type"]>([
  "SET_BACKGROUND",
  "SET_COLOR",
  "SET_SHAPE",
]);

type WizardContextValue = {
  state: WizardState;
  dispatch: ActionDispatch<[action: WizardAction]>;
  githubUser: GithubUserResult;
  usernameInputRef: RefObject<HTMLInputElement | null>;
  /** True once an install button was pressed before a username was typed. */
  usernameRequested: boolean;
  /** Sends the visitor to the username field, flagging it as required. */
  requestUsername: () => void;
};

const WizardContext = createContext<WizardContextValue | null>(null);

/**
 * One wizard state for the whole hero. The username is typed in the hero and
 * previewed on its phone, then the drawer picks up from there — so the field,
 * the phone and the drawer all have to read and write the same state.
 */
export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useWizardState();
  const customized = useRef(false);

  // The server knows neither the visitor's theme nor what they picked last
  // time, so the style is settled here, once, after hydration.
  useEffect(() => {
    const stored = readWallpaperStyle();
    if (stored) customized.current = true;
    rawDispatch({
      type: "RESTORE_STYLE",
      value: stored ?? {
        background: themedBackground(
          document.documentElement.classList.contains("dark")
        ),
      },
    });
  }, [rawDispatch]);

  // Only a visitor's own edit is persisted: until then the default keeps
  // following whichever theme they arrive in.
  // `styleReady` matters on mount: this effect runs right after the restore
  // above, while `state` still holds the server's default, and would
  // otherwise overwrite the stored style with it.
  useEffect(() => {
    if (!state.styleReady || !customized.current) return;
    storeWallpaperStyle({
      background: state.background,
      color: state.color,
      shape: state.shape,
    });
  }, [state.styleReady, state.background, state.color, state.shape]);

  const dispatch = useCallback((action: WizardAction) => {
    if (STYLE_ACTIONS.has(action.type)) customized.current = true;
    rawDispatch(action);
  }, [rawDispatch]);

  const githubUser = useGithubUser(state.username);
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [usernameRequested, setUsernameRequested] = useState(false);

  const requestUsername = useCallback(() => {
    setUsernameRequested(true);
    usernameInputRef.current?.focus();
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      githubUser,
      usernameInputRef,
      usernameRequested,
      requestUsername,
    }),
    [state, dispatch, githubUser, usernameRequested, requestUsername]
  );

  return <WizardContext value={value}>{children}</WizardContext>;
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error("useWizard must be used within <WizardProvider>");
  return context;
}
