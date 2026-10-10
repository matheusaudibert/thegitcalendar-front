"use client";

import {
  ColorSelector,
  ColorSelectorItem,
  ColorSelectorList,
} from "@/components/motion/color-selector";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { useWizard } from "@/components/wizard-provider";
import type { Background, ColorName, Shape } from "@/lib/build-image-url";
import { BACKGROUND_OPTIONS, COLOR_OPTIONS, SHAPE_OPTIONS } from "@/lib/colors";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * The hero phone's style controls: commit color, shape and background, in
 * one compact card under the phone. Every option is drawn as what it does to
 * the wallpaper — a colored dot per color, a day in each shape, a swatch per
 * background — so the card needs no text labels. It writes the same wizard
 * state the install drawer reads, so the style picked here is the one
 * installed. Always shown: before a username is entered it styles the
 * showcase wallpaper, so the options can be tried right away.
 */
export function WallpaperControls({ t }: { t: Dictionary }) {
  const { state, dispatch } = useWizard();
  const w = t.wizard;

  const commitSwatch = COLOR_OPTIONS.find(
    (option) => option.value === state.color,
  )?.swatch;

  return (
    <div className="flex justify-center pt-6">
      <div className="flex w-max max-w-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-2">
        <ColorSelector
          value={state.color}
          onValueChange={(value) =>
            dispatch({ type: "SET_COLOR", value: value as ColorName })
          }
          aria-label={w.commitColor}
        >
          <ColorSelectorList className="justify-center gap-1 p-1">
            {COLOR_OPTIONS.map((option) => (
              <ColorSelectorItem
                key={option.value}
                value={option.value}
                color={option.swatch}
                label={w.colors[option.value]}
                className="size-8"
              />
            ))}
          </ColorSelectorList>
        </ColorSelector>

        <div className="flex items-center gap-2">
          <Tabs
            variant="segment"
            value={state.shape}
            onValueChange={(value) =>
              dispatch({ type: "SET_SHAPE", value: value as Shape })
            }
          >
            <TabsList aria-label={w.commitShape} className="bg-background">
              {SHAPE_OPTIONS.map((option) => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  aria-label={w.shapes[option.value]}
                  className="size-9 p-0"
                  // Neutral, so the commit-colored day stays visible
                  // on the selected option.
                  indicatorClassName="bg-foreground/10"
                >
                  {/* The ring keeps white and black days visible. */}
                  <span
                    className={cn(
                      "size-4 ring-1 ring-border-strong transition-colors duration-200",
                      option.radiusClass,
                    )}
                    style={{ backgroundColor: commitSwatch }}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Tabs
            variant="segment"
            value={state.background}
            onValueChange={(value) =>
              dispatch({
                type: "SET_BACKGROUND",
                value: value as Background,
              })
            }
          >
            <TabsList aria-label={w.backgroundColor} className="bg-background">
              {BACKGROUND_OPTIONS.map((option) => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  aria-label={w.backgrounds[option.value]}
                  className="size-9 p-0"
                  indicatorClassName="bg-foreground/10"
                >
                  <span
                    className="size-5 rounded-md ring-1 ring-border-strong"
                    style={{ backgroundColor: option.swatch }}
                  />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
