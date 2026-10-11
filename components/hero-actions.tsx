"use client";

import { useCallback, useState } from "react";
import { FaAndroid, FaApple, FaStar } from "react-icons/fa6";

import { Button, ButtonLink } from "@/components/motion/button/base";
import { InstallDrawer } from "@/components/install-drawer";
import { UsernameField } from "@/components/username-field";
import { useWizard } from "@/components/wizard-provider";
import type { Platform } from "@/hooks/use-wizard-state";
import { GITHUB_STARS } from "@/lib/github-stars";
import type { Dictionary } from "@/lib/i18n";
import { REPO_URL } from "@/lib/site";

/**
 * The hero's interactive column: the username field and the install buttons.
 * The drawer only opens once the username is valid, so it can start straight
 * at the device step; until then the buttons send the visitor to the field.
 */
export function HeroActions({ t }: { t: Dictionary }) {
  const { githubUser, requestUsername } = useWizard();
  const [platform, setPlatform] = useState<Platform | null>(null);
  // Stable, because the bottom sheet re-arms its scroll lock whenever this
  // callback's identity changes.
  const handleClose = useCallback(() => setPlatform(null), []);

  const open = (next: Platform) => {
    if (githubUser.status === "valid") setPlatform(next);
    else requestUsername();
  };

  return (
    <div className="mt-10 flex w-full max-w-[440px] flex-col gap-3">
      <UsernameField t={t} />

      {/* Wraps to one button per row when the column gets too narrow. */}
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[204px] flex-1">
          <Button
            size="lg"
            className="w-full whitespace-nowrap"
            onClick={() => open("apple")}
          >
            <FaApple className="size-[1.15em]" />
            {t.installIos}
          </Button>
        </div>

        <div className="min-w-[204px] flex-1">
          <Button
            size="lg"
            className="w-full whitespace-nowrap"
            onClick={() => open("android")}
          >
            <FaAndroid className="size-[1.15em]" />
            {t.installAndroid}
          </Button>
        </div>
      </div>

      {/* The count is baked in by a daily workflow, so it never hits the
          GitHub API at runtime. A zero would read as an empty badge. */}
      <ButtonLink
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="lg"
        className="w-full whitespace-nowrap"
      >
        <FaStar className="size-[1.05em] text-yellow-500" />
        {t.starProject}
        {GITHUB_STARS > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-sm tabular-nums text-muted-foreground">
            {GITHUB_STARS}
          </span>
        )}
      </ButtonLink>

      <InstallDrawer t={t} platform={platform} onClose={handleClose} />
    </div>
  );
}
