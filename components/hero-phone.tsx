"use client";

import { useEffect, useState } from "react";

import { PhoneMockup } from "@/components/phone-mockup";
import { WallpaperControls } from "@/components/wallpaper-controls";
import { useWizard } from "@/components/wizard-provider";
import { DEFAULT_STYLE } from "@/hooks/use-wizard-state";
import { buildImageUrl } from "@/lib/build-image-url";
import { clockColor } from "@/lib/colors";
import type { Dictionary, Locale } from "@/lib/i18n";
import {
  SHOWCASE_HEIGHT,
  SHOWCASE_USER,
  SHOWCASE_WIDTH,
  WALLPAPER_URLS,
} from "@/lib/showcase-users";

/**
 * The hero's phone. It shows the showcase user's wallpaper until the visitor
 * enters a valid username, then theirs — either way in whatever style is
 * picked under the phone or in the drawer, since all of them share the wizard
 * state.
 */
export function HeroPhone({ t, locale }: { t: Dictionary; locale: Locale }) {
  const { state, githubUser } = useWizard();
  const { styleReady } = state;

  const username =
    githubUser.status === "valid" ? state.username.trim() : SHOWCASE_USER;
  const prerendered =
    username === SHOWCASE_USER &&
    state.color === DEFAULT_STYLE.color &&
    state.shape === DEFAULT_STYLE.shape &&
    (state.background === "dark" || state.background === "light");
  // The showcase in the default style is pre-rendered, so it skips the API.
  const wantedUrl = prerendered
    ? WALLPAPER_URLS[state.background as keyof typeof WALLPAPER_URLS]
    : buildImageUrl({
          username,
          width: SHOWCASE_WIDTH,
          height: SHOWCASE_HEIGHT,
          background: state.background,
          color: state.color,
          shape: state.shape,
        });
  const wantedClock = clockColor(state.color, state.background);

  // The image API takes a few seconds to render. Swapping `src` straight away
  // would blank the screen for that long, so the phone keeps the wallpaper it
  // has until the next one has fully loaded. The clock's colour travels with
  // it, so the clock always matches the wallpaper actually on screen.
  //
  // Until the client has settled the style, `url` is null and the phone shows
  // both pre-rendered defaults, letting CSS pick the one for the theme — so it
  // is right from the first paint, before any script has run.
  const [shown, setShown] = useState<{ url: string | null; clock: string }>({
    url: null,
    clock: clockColor(DEFAULT_STYLE.color, DEFAULT_STYLE.background),
  });

  useEffect(() => {
    if (!styleReady) return;
    const image = new Image();
    image.onload = () => setShown({ url: wantedUrl, clock: wantedClock });
    image.src = wantedUrl;
    return () => {
      image.onload = null;
    };
  }, [styleReady, wantedUrl, wantedClock]);

  return (
    <div className="flex flex-col items-center">
      <PhoneMockup
        imageUrl={shown.url ?? WALLPAPER_URLS}
        alt={t.wallpaperAlt}
        locale={locale}
        clockColor={shown.clock}
      />
      <WallpaperControls t={t} />
    </div>
  );
}
