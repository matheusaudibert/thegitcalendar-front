"use client";

import { useEffect, useState } from "react";

import { PhoneMockup } from "@/components/phone-mockup";
import { WallpaperControls } from "@/components/wallpaper-controls";
import { useWizard } from "@/components/wizard-provider";
import { DEFAULT_STYLE } from "@/hooks/use-wizard-state";
import { buildImageUrl } from "@/lib/build-image-url";
import { isLightBackground } from "@/lib/colors";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  SHOWCASE_HEIGHT,
  SHOWCASE_USER,
  SHOWCASE_WIDTH,
  WALLPAPER_URL,
} from "@/lib/showcase-users";

/**
 * The hero's phone. It shows the showcase user's wallpaper until the visitor
 * enters a valid username, then theirs — either way in whatever style is
 * picked under the phone or in the drawer, since all of them share the wizard
 * state.
 */
export function HeroPhone({ t, locale }: { t: Dictionary; locale: Locale }) {
  const { state, githubUser } = useWizard();

  const username =
    githubUser.status === "valid" ? state.username.trim() : SHOWCASE_USER;
  const defaultStyle =
    state.background === DEFAULT_STYLE.background &&
    state.color === DEFAULT_STYLE.color &&
    state.shape === DEFAULT_STYLE.shape;
  // The showcase in the default style is pre-rendered, so it skips the API.
  const wantedUrl =
    username === SHOWCASE_USER && defaultStyle
      ? WALLPAPER_URL
      : buildImageUrl({
          username,
          width: SHOWCASE_WIDTH,
          height: SHOWCASE_HEIGHT,
          background: state.background,
          color: state.color,
          shape: state.shape,
        });
  const wantedLight = isLightBackground(state.background);

  // The image API takes a few seconds to render. Swapping `src` straight away
  // would blank the screen for that long, so the phone keeps the wallpaper it
  // has until the next one has fully loaded. Whether it is light travels
  // with it, so the clock always matches the wallpaper actually on screen.
  const [shown, setShown] = useState({ url: WALLPAPER_URL, light: false });

  useEffect(() => {
    const image = new Image();
    image.onload = () => setShown({ url: wantedUrl, light: wantedLight });
    image.src = wantedUrl;
    return () => {
      image.onload = null;
    };
  }, [wantedUrl, wantedLight]);

  return (
    <div className="flex flex-col items-center">
      <PhoneMockup
        imageUrl={shown.url}
        alt={t.wallpaperAlt}
        locale={locale}
        lightWallpaper={shown.light}
      />
      <WallpaperControls t={t} />
    </div>
  );
}
