"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ActionDispatch,
  type ReactNode,
  type RefObject,
} from "react";

import { useGithubUser, type GithubUserResult } from "@/hooks/use-github-user";
import {
  useWizardState,
  type WizardAction,
  type WizardState,
} from "@/hooks/use-wizard-state";

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
  const [state, dispatch] = useWizardState();
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
