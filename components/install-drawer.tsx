"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CustomizationStep } from "@/components/customization-step";
import { DeviceStep } from "@/components/device-step";
import { InstructionStepView } from "@/components/instruction-step";
import { StepShell } from "@/components/step-shell";
import { UsernameStep } from "@/components/username-step";
import { useGithubUser } from "@/hooks/use-github-user";
import { useWizardState, type Platform } from "@/hooks/use-wizard-state";
import { buildImageUrl } from "@/lib/build-image-url";
import type { Dictionary } from "@/lib/i18n";
import { getInstructions } from "@/lib/instructions";

/** iPhone 14 Pro / 15 / 15 Pro / 16 — also the backend's own default size. */
const DEFAULT_WIDTH = 1179;
const DEFAULT_HEIGHT = 2556;

type InstallDrawerProps = {
  t: Dictionary;
  /** Which hero button opened the drawer; `null` keeps it closed. */
  platform: Platform | null;
  onClose: () => void;
};

export function InstallDrawer({ t, platform, onClose }: InstallDrawerProps) {
  const [state, dispatch] = useWizardState();
  const githubUser = useGithubUser(state.username);

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

  const usernameValid = githubUser.status === "valid";
  const deviceChosen = usernameValid && device !== null;

  const imageUrl = useMemo(
    () =>
      buildImageUrl({
        username: state.username.trim(),
        width: device?.width ?? DEFAULT_WIDTH,
        height: device?.height ?? DEFAULT_HEIGHT,
        background: state.background,
        color: state.color,
        shape: state.shape,
      }),
    [state.username, device, state.background, state.color, state.shape]
  );

  const instructions = useMemo(
    () => getInstructions(openPlatform, t),
    [openPlatform, t]
  );

  const w = t.wizard;

  return (
    <Drawer
      open={platform !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      showSwipeHandle
    >
      <DrawerContent className="mx-auto h-[95vh]! max-h-[95vh]! w-[calc(100%-1.5rem)] max-w-[650px]! sm:w-full">
        <DrawerHeader>
          <DrawerTitle>
            {openPlatform === "apple"
              ? w.drawerTitleApple
              : w.drawerTitleAndroid}
          </DrawerTitle>
          <DrawerDescription>
            {openPlatform === "apple"
              ? w.drawerDescriptionApple
              : w.drawerDescriptionAndroid}
          </DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6">
          <StepShell
            number={1}
            title={w.usernameTitle}
            description={w.usernameDescription}
            isLast={!usernameValid}
          >
            <UsernameStep
              t={t}
              value={state.username}
              onChange={(value) => dispatch({ type: "SET_USERNAME", value })}
              status={githubUser.status}
              avatarUrl={githubUser.avatarUrl}
            />
          </StepShell>

          {usernameValid && (
            <StepShell
              number={2}
              title={w.deviceTitle}
              description={w.deviceDescription}
              isLast={!deviceChosen}
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
          )}

          {deviceChosen && (
            <>
              <StepShell
                number={3}
                title={w.customizeTitle}
                description={w.customizeDescription}
              >
                <CustomizationStep
                  t={t}
                  background={state.background}
                  color={state.color}
                  shape={state.shape}
                  onBackgroundChange={(value) =>
                    dispatch({ type: "SET_BACKGROUND", value })
                  }
                  onColorChange={(value) =>
                    dispatch({ type: "SET_COLOR", value })
                  }
                  onShapeChange={(value) =>
                    dispatch({ type: "SET_SHAPE", value })
                  }
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
            <DrawerClose render={<Button variant="outline" />}>
              {w.close}
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
