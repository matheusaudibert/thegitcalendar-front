"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { PhoneMockup } from "@/components/phone-mockup";
import { StepShell } from "@/components/step-shell";
import { UsernameStep } from "@/components/username-step";
import { PlatformStep } from "@/components/platform-step";
import { DeviceStep } from "@/components/device-step";
import { CustomizationStep } from "@/components/customization-step";
import { InstructionStepView } from "@/components/instruction-step";
import { useWizardState } from "@/hooks/use-wizard-state";
import { useGithubUser } from "@/hooks/use-github-user";
import { buildImageUrl } from "@/lib/build-image-url";
import {
  APPLE_INSTRUCTIONS,
  ANDROID_INSTRUCTIONS,
  MAC_INSTRUCTIONS,
} from "@/lib/instructions";

const DEFAULT_WIDTH = 1179;
const DEFAULT_HEIGHT = 2556;

const SHOWCASE_EXAMPLES = [
  "/phone_1.png",
  "/phone_2.png",
  "/phone_3.png",
];

export default function Home() {
  const [open, setOpen] = useState(false);
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [state, dispatch] = useWizardState();
  const githubUser = useGithubUser(state.username);

  const usernameValid = githubUser.status === "valid";
  const platformChosen = usernameValid && state.platform !== null;
  const deviceChosen = platformChosen && state.device !== null;

  const imageUrl = useMemo(
    () =>
      buildImageUrl({
        username: state.username.trim(),
        width: state.device?.width ?? DEFAULT_WIDTH,
        height: state.device?.height ?? DEFAULT_HEIGHT,
        background: state.background,
        color: state.color,
        shape: state.shape,
      }),
    [state]
  );

  const instructions =
    state.platform === "android"
      ? ANDROID_INSTRUCTIONS
      : state.platform === "mac"
        ? MAC_INSTRUCTIONS
        : APPLE_INSTRUCTIONS;

  return (
    <main className="flex min-h-screen flex-col bg-background px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[900px] flex-1 flex-col gap-4 py-6 sm:gap-6 sm:py-8">
        <header className="text-left">
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Ship code.
            <br />
            See it every day.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl md:text-2xl">
            The Git Calendar turns your yearly GitHub contribution graph into a wallpaper that updates itself automatically.
          </p>
        </header>

        <section
          aria-label="Examples"
          className="hidden items-center justify-center gap-3 sm:flex md:gap-6"
        >
          <PhoneMockup imageUrl={SHOWCASE_EXAMPLES[0]} />
          <PhoneMockup imageUrl={SHOWCASE_EXAMPLES[1]} />
          <PhoneMockup imageUrl={SHOWCASE_EXAMPLES[2]} />
        </section>

        <div
          aria-label="Examples"
          className="flex w-full items-center justify-center gap-3 sm:hidden"
        >
          <button
            type="button"
            aria-label="Previous example"
            onClick={() =>
              setShowcaseIndex(
                (i) => (i - 1 + SHOWCASE_EXAMPLES.length) % SHOWCASE_EXAMPLES.length
              )
            }
            className="flex shrink-0 items-center justify-center rounded-full border border-border p-2 text-foreground hover:bg-muted"
          >
            <ChevronLeft className="size-5" />
          </button>

          <PhoneMockup imageUrl={SHOWCASE_EXAMPLES[showcaseIndex]} />

          <button
            type="button"
            aria-label="Next example"
            onClick={() =>
              setShowcaseIndex((i) => (i + 1) % SHOWCASE_EXAMPLES.length)
            }
            className="flex shrink-0 items-center justify-center rounded-full border border-border p-2 text-foreground hover:bg-muted"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={() => setOpen(true)}>
            Install
          </Button>
        </div>

        <footer className="mt-auto">
          <Separator />
          <p className="py-3 text-center text-xs text-muted-foreground">
            Made by{" "}
            <a
              href="https://github.com/matheusaudibert"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              @audibert
            </a>
          </p>
        </footer>

        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent className="mx-auto h-[95vh]! max-h-[95vh]! w-[calc(100%-1.5rem)] max-w-[650px]! sm:w-full">
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6">
              <StepShell
                number={1}
                title="GitHub username"
                description="Enter the GitHub username whose contributions you want on your wallpaper."
                isLast={!usernameValid}
              >
                <UsernameStep
                  value={state.username}
                  onChange={(value) => dispatch({ type: "SET_USERNAME", value })}
                  status={githubUser.status}
                  avatarUrl={githubUser.avatarUrl}
                />
              </StepShell>

              {usernameValid && (
                <StepShell
                  number={2}
                  title="Choose platform"
                  description="Pick the platform you'll use to automate the wallpaper."
                  isLast={!platformChosen}
                >
                  <PlatformStep
                    value={state.platform}
                    onChange={(value) => dispatch({ type: "SET_PLATFORM", value })}
                  />
                </StepShell>
              )}

              {platformChosen && state.platform && (
                <StepShell
                  number={3}
                  title="Choose device model"
                  description="This determines the exact resolution used for your wallpaper."
                  isLast={!deviceChosen}
                >
                  <DeviceStep
                    platform={state.platform}
                    value={state.device}
                    onChange={(value) => dispatch({ type: "SET_DEVICE", value })}
                  />
                </StepShell>
              )}

              {deviceChosen && (
                <>
                  <StepShell
                    number={4}
                    title="Customize"
                    description="Tweak the look of your wallpaper."
                  >
                    <CustomizationStep
                      background={state.background}
                      color={state.color}
                      shape={state.shape}
                      onBackgroundChange={(value) =>
                        dispatch({ type: "SET_BACKGROUND", value })
                      }
                      onColorChange={(value) => dispatch({ type: "SET_COLOR", value })}
                      onShapeChange={(value) => dispatch({ type: "SET_SHAPE", value })}
                    />
                  </StepShell>

                  {instructions.map((step, i) => (
                    <InstructionStepView
                      key={step.number}
                      step={step}
                      imageUrl={imageUrl}
                      isLast={i === instructions.length - 1}
                    />
                  ))}
                </>
              )}

              <div className="mt-8 flex justify-center">
                <DrawerClose render={<Button variant="outline" />}>
                  Close
                </DrawerClose>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </main>
  );
}
