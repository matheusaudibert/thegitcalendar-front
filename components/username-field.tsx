"use client";

import { SiGithub } from "react-icons/si";
import { TriangleAlert, XCircle } from "lucide-react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
} from "@/components/motion/alert";
import { Input } from "@/components/motion/input";
import { Loader } from "@/components/motion/loader";
import { useWizard } from "@/components/wizard-provider";
import type { GithubUserStatus } from "@/hooks/use-github-user";
import type { Dictionary } from "@/lib/i18n";

/**
 * What sits at the right edge of the field. `null` (not an empty element) when
 * there is nothing to show, so the input only reserves room for real content.
 */
function statusIcon(status: GithubUserStatus, avatarUrl: string | null) {
  switch (status) {
    case "checking":
      return <Loader variant="spinner" size={16} />;
    case "invalid":
    case "malformed":
      return <XCircle className="text-destructive" />;
    case "rate-limited":
      return <TriangleAlert />;
    case "valid":
      return avatarUrl ? (
        // Decorative: the username is already in the field.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          width={24}
          height={24}
          className="size-6 rounded-full ring-1 ring-border"
        />
      ) : null;
    default:
      return null;
  }
}

/** The hero's GitHub username input: the first thing the install flow needs. */
export function UsernameField({ t }: { t: Dictionary }) {
  const { state, dispatch, githubUser, usernameInputRef, usernameRequested } =
    useWizard();
  const { status, avatarUrl } = githubUser;
  const w = t.wizard;

  const error =
    status === "invalid"
      ? w.usernameNotFound
      : status === "malformed"
        ? w.usernameMalformed
        : status === "idle" && usernameRequested
          ? w.usernameRequired
          : undefined;

  return (
    <div className="w-full space-y-3 text-left">
      <Input
        ref={usernameInputRef}
        placeholder={w.usernamePlaceholder}
        value={state.username}
        onChange={(next) =>
          dispatch({ type: "SET_USERNAME", value: next.trim() })
        }
        error={error}
        // The avatar is a better "found it" signal than beUI's tick, so the
        // tick only shows for the rare valid user without one.
        success={status === "valid" && !avatarUrl}
        leftIcon={
          <span className="flex items-center gap-1.5">
            <SiGithub />
            <span className="text-sm">@</span>
          </span>
        }
        rightIcon={statusIcon(status, avatarUrl)}
        autoComplete="off"
        spellCheck={false}
        aria-label={w.usernameTitle}
        classNames={{
          field: "h-12 bg-card",
          input: "pl-14",
          rightIcon: "pr-3 [&_svg]:h-4 [&_svg]:w-4",
        }}
      />

      {/* Not the user's fault and not their username's fault, so this is a
          warning rather than an error — the name may well be perfectly valid. */}
      <Alert variant="warning" open={status === "rate-limited"}>
        <AlertIcon />
        <AlertContent>
          <AlertDescription className="text-current">
            {w.usernameRateLimited}
          </AlertDescription>
        </AlertContent>
      </Alert>
    </div>
  );
}
