import type { Dictionary } from "@/lib/i18n";
import type { Platform } from "@/hooks/use-wizard-state";

/**
 * Instruction copy is plain markup-lite strings living in the dictionaries, so
 * it translates like everything else. This module only holds the *shape* — the
 * step/action tree — and reads the text out of `t.instructions`.
 */
export type InstructionAction = {
  number: string;
  title: string;
  details: string[];
  note?: string;
};

export type InstructionStep = {
  number: number;
  title: string;
  paragraphs?: string[];
  actions?: InstructionAction[];
};

/** A `details`/`paragraphs` line equal to this is replaced by the URL + copy button. */
export const URL_TOKEN = "{{URL}}";

/** Region-less store URLs so each user lands on their own storefront/language. */
export const SHORTCUTS_APP_URL = "https://apps.apple.com/app/id915249334";
export const MACRODROID_APP_URL =
  "https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid";

/**
 * Numbering runs continuously from the top of the wizard: the instructions are
 * its tail, not a section that restarts at 1. Steps 1–3 are username, device
 * and customisation, so these pick up at 4.
 */
const FIRST_INSTRUCTION_STEP = 4;

/** A step before its position in the wizard is known. */
type UnnumberedStep = Omit<InstructionStep, "number" | "actions"> & {
  actions?: Omit<InstructionAction, "number">[];
};

/**
 * Assigns each step its wizard number and each action a `<step>.<n>` label, so
 * inserting or dropping a step upstream can never leave the two out of sync.
 */
function number(steps: UnnumberedStep[]): InstructionStep[] {
  return steps.map((step, index) => {
    const stepNumber = FIRST_INSTRUCTION_STEP + index;

    return {
      ...step,
      number: stepNumber,
      actions: step.actions?.map((action, actionIndex) => ({
        ...action,
        number: `${stepNumber}.${actionIndex + 1}`,
      })),
    };
  });
}

export function getInstructions(
  platform: Platform,
  t: Dictionary
): InstructionStep[] {
  const copy = t.instructions;

  if (platform === "apple") {
    return number([
      {
        title: copy.appleCreateShortcutTitle,
        paragraphs: [copy.appleCreateShortcutBody],
      },
      {
        title: copy.appleCreateAutomationTitle,
        paragraphs: [copy.appleAddActions],
        actions: [
          {
            title: copy.appleGetContentsTitle,
            details: [copy.applePasteUrl, URL_TOKEN],
          },
          {
            title: copy.appleSetWallpaperTitle,
            details: [copy.appleChooseLockScreen],
            note: copy.appleCropNote,
          },
        ],
      },
    ]);
  }

  return number([
    {
      title: copy.androidSetupMacroTitle,
      paragraphs: [copy.androidOpenMacrodroid, copy.androidTrigger],
    },
    {
      title: copy.androidConfigureActionsTitle,
      actions: [
        {
          title: copy.androidDownloadImageTitle,
          details: [
            copy.androidHttpRequest,
            copy.androidRequestMethod,
            copy.androidPasteUrl,
            URL_TOKEN,
            copy.androidBlockNext,
            copy.androidSaveResponse,
            copy.androidDownloadPath,
          ],
        },
        {
          title: copy.androidSetWallpaperTitle,
          details: [
            copy.androidDeviceSettings,
            copy.androidImageAndScreen,
            copy.androidWallpaperPath,
          ],
          note: copy.androidSamePathNote,
        },
      ],
    },
    {
      title: copy.androidFinalizeTitle,
      paragraphs: [copy.androidFinalizeBody],
    },
    {
      title: copy.androidManagingTitle,
      paragraphs: [copy.androidTest, copy.androidStop, copy.androidEditUrl],
    },
  ]);
}
