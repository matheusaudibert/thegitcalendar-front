"use client";

import { useCallback, useMemo, useState } from "react";

import { BottomSheet } from "@/components/motion/bottom-sheet";
import { Button } from "@/components/motion/button/base";
import { CustomizationStep } from "@/components/customization-step";
import { DeviceStep } from "@/components/device-step";
import { InstructionStepView } from "@/components/instruction-step";
import { StepShell } from "@/components/step-shell";
import { useWizard } from "@/components/wizard-provider";
import type { Platform } from "@/hooks/use-wizard-state";
import { buildImageUrl, type Language } from "@/lib/build-image-url";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getInstructions } from "@/lib/instructions";

/** iPhone 14 Pro / 15 / 15 Pro / 16 — also the backend's own default size. */
const DEFAULT_WIDTH = 1179;
const DEFAULT_HEIGHT = 2556;

type InstallDrawerProps = {
  t: Dictionary;
  locale: Locale;
  /** Which hero button opened the drawer; `null` keeps it closed. */
  platform: Platform | null;
  onClose: () => void;
};

export function InstallDrawer({ t, locale, platform, onClose }: InstallDrawerProps) {
  const { state, dispatch } = useWizard();

  // `platform` doubles as the open flag, so it drops to null the moment the
  // drawer starts closing. Retaining the last one keeps the right content on
  // screen for the length of the closing animation instead of flipping to iOS.
  const [openPlatform, setOpenPlatform] = useState<Platform>("apple");
  if (platform !== null && platform !== openPlatform) {
    setOpenPlatform(platform);
  }

  // The iPhone and Android pools are disjoint, so a device picked under the
  // other platform is not a valid selection here.
  const device =
    state.devicePlatform === openPlatform ? state.device : null;

  // The hero only opens the drawer once the username is valid, so the flow
  // here starts at the device.
  const deviceChosen = device !== null;

  // Starts on the site's language; only the downloaded wallpaper follows it.
  const [language, setLanguage] = useState<Language>(locale);

  const imageUrl = useMemo(
    () =>
      buildImageUrl({
        username: state.username.trim(),
        width: device?.width ?? DEFAULT_WIDTH,
        height: device?.height ?? DEFAULT_HEIGHT,
        background: state.background,
        color: state.color,
        shape: state.shape,
        language,
      }),
    [state.username, device, state.background, state.color, state.shape, language]
  );

  const instructions = useMemo(
    () => getInstructions(openPlatform, t),
    [openPlatform, t]
  );

  const w = t.wizard;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose]
  );

  return (
    <BottomSheet
      open={platform !== null}
      onOpenChange={handleOpenChange}
      snapPoints={[0.95]}
      title={
        openPlatform === "apple" ? w.drawerTitleApple : w.drawerTitleAndroid
      }
      description={
        openPlatform === "apple"
          ? w.drawerDescriptionApple
          : w.drawerDescriptionAndroid
      }
      className="w-[calc(100%-1.5rem)] max-w-[650px] bg-card sm:w-full"
    >
      <div className="pt-4 pb-8">
        <StepShell
          number={1}
          title={w.deviceTitle}
          description={w.deviceDescription}
          isLast={!deviceChosen}
          // Each step's entry animation makes it its own stacking context, so
          // the device panel can't escape it with its own z-index — the whole
          // step has to sit above the steps that appear below it.
          className="z-10"
        >
          <DeviceStep
            t={t}
            platform={openPlatform}
            value={device}
            onChange={(value) =>
              dispatch({ type: "SET_DEVICE", value, platform: openPlatform })
            }
          />
        </StepShell>

        {deviceChosen && (
          <>
            <StepShell
              number={2}
              title={w.customizeTitle}
              description={w.customizeDescription}
            >
              <CustomizationStep
                t={t}
                background={state.background}
                color={state.color}
                shape={state.shape}
                language={language}
                onBackgroundChange={(value) =>
                  dispatch({ type: "SET_BACKGROUND", value })
                }
                onColorChange={(value) =>
                  dispatch({ type: "SET_COLOR", value })
                }
                onShapeChange={(value) =>
                  dispatch({ type: "SET_SHAPE", value })
                }
                onLanguageChange={setLanguage}
              />
            </StepShell>

            {instructions.map((step, i) => (
              <InstructionStepView
                key={step.number}
                t={t}
                step={step}
                imageUrl={imageUrl}
                isLast={i === instructions.length - 1}
              />
            ))}
          </>
        )}

        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={onClose}>
            {w.close}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
