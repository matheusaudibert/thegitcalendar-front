"use client";

import { useState } from "react";
import { FaAndroid, FaApple, FaSteam } from "react-icons/fa6";

import { InstallDrawer } from "@/components/install-drawer";
import { BrandButton } from "@/components/ui/brand-button";
import type { Platform } from "@/hooks/use-wizard-state";
import type { Dictionary } from "@/lib/i18n";

/**
 * The hero's CTA row. Split out of `hero.tsx` so the rest of the hero — and
 * the phone mockup it renders — stays a server component.
 */
export function InstallButtons({ t }: { t: Dictionary }) {
  const [platform, setPlatform] = useState<Platform | null>(null);

  return (
    <div className="mt-10 flex w-full max-w-[440px] flex-col gap-3">
      {/* Wraps to one button per row when the column gets too narrow. */}
      <div className="flex flex-wrap gap-3">
        <div className="min-w-[204px] flex-1">
          <BrandButton
            variant="apple"
            className="whitespace-nowrap"
            onClick={() => setPlatform("apple")}
          >
            <FaApple className="size-[1.15em]" />
            {t.installIos}
          </BrandButton>
        </div>

        <div className="min-w-[204px] flex-1">
          <BrandButton
            variant="android"
            className="whitespace-nowrap"
            onClick={() => setPlatform("android")}
          >
            <FaAndroid className="size-[1.15em]" />
            {t.installAndroid}
          </BrandButton>
        </div>
      </div>

      <BrandButton
        variant="neutral"
        disabled
        aria-describedby="desktop-soon"
        className="whitespace-nowrap"
      >
        <FaSteam className="size-[1.15em]" />
        {t.installDesktop}
        <span
          id="desktop-soon"
          className="ml-1 rounded-full bg-foreground/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase [text-shadow:none]"
        >
          {t.soon}
        </span>
      </BrandButton>

      <InstallDrawer
        t={t}
        platform={platform}
        onClose={() => setPlatform(null)}
      />
    </div>
  );
}
