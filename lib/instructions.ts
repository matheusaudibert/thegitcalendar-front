import { createElement, type ReactNode } from "react";
import { StoreLink } from "@/components/store-link";

export type InstructionAction = {
  number: string;
  title: ReactNode;
  details: ReactNode[];
  note?: ReactNode;
};

export type InstructionStep = {
  number: number;
  title: ReactNode;
  paragraphs?: ReactNode[];
  actions?: InstructionAction[];
};

/** Token substituted with the live, dynamically generated image URL at render time. */
export const URL_TOKEN = "{{URL}}";

/** Bold, white-highlighted text inside an instruction line. */
const b = (key: string, text: string) =>
  createElement("strong", { key, className: "font-semibold text-white" }, text);

/**
 * Bold, white, underlined app link. On iOS `appScheme` opens the installed app
 * directly; everywhere else it falls back to the store page.
 */
const appLink = (
  key: string,
  label: string,
  storeUrl: string,
  appScheme?: string
) => createElement(StoreLink, { key, label, storeUrl, appScheme });

/** Bold text that keeps the surrounding color — used inside notes. */
const nb = (key: string, text: string) =>
  createElement("strong", { key, className: "font-semibold" }, text);

/** Inline monospaced snippet (paths, filenames) inside an instruction line. */
const code = (key: string, text: string) =>
  createElement(
    "code",
    {
      key,
      className:
        "rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground",
    },
    text
  );

/** Region-less store URLs so each user lands on their own storefront/language. */
const SHORTCUTS_APP_URL = "https://apps.apple.com/app/id915249334";
const MACRODROID_APP_URL =
  "https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid";

/** Opens the Shortcuts app itself on iOS instead of its App Store page. */
const SHORTCUTS_APP_SCHEME = "shortcuts://";

export const APPLE_INSTRUCTIONS: InstructionStep[] = [
  {
    number: 5,
    title: "Create shortcut",
    paragraphs: [
      [
        "Open ",
        appLink("shortcuts", "Shortcuts", SHORTCUTS_APP_URL, SHORTCUTS_APP_SCHEME),
        " app → Go to ",
        b("automation", "Automation"),
        " tab → New Automation → ",
        b("time-of-day", "Time of Day"),
        " → ",
        b("time", "6:00 AM"),
        " → Repeat ",
        b("daily", '"Daily"'),
        " → Select ",
        b("run-immediately", '"Run Immediately"'),
        " → ",
        b("create-shortcut", '"Create New Shortcut"'),
      ],
    ],
  },
  {
    number: 6,
    title: "Create automation",
    paragraphs: ["Add these actions:"],
    actions: [
      {
        number: "6.1",
        title: "Get Contents of URL",
        details: ["Paste the following URL there:", URL_TOKEN],
      },
      {
        number: "6.2",
        title: "Set Wallpaper Photo",
        details: ['Choose "Lock Screen"'],
        note: [
          "In ",
          nb("set-wallpaper-photo", '"Set Wallpaper Photo"'),
          ", tap the arrow (→) to show options → disable both ",
          nb("crop-to-subject", '"Crop to Subject"'),
          " and ",
          nb("show-preview", '"Show Preview"'),
          ". This prevents iOS from cropping and asking for confirmation each time.",
        ],
      },
    ],
  },
];

export const MAC_INSTRUCTIONS: InstructionStep[] = [
  {
    number: 5,
    title: "Create shortcut",
    paragraphs: [
      [
        "Open ",
        b("shortcuts-mac", "Shortcuts"),
        " (pre-installed since macOS Monterey) → Go to ",
        b("automation-mac", "Automation"),
        " tab → New Automation → ",
        b("time-of-day-mac", "Time of Day"),
        " → ",
        b("time-mac", "6:00 AM"),
        " → Repeat ",
        b("daily-mac", '"Daily"'),
        " → Select ",
        b("run-immediately-mac", '"Run Immediately"'),
        " → ",
        b("create-shortcut-mac", '"Create New Shortcut"'),
      ],
    ],
  },
  {
    number: 6,
    title: "Create automation",
    paragraphs: ["Add these actions:"],
    actions: [
      {
        number: "6.1",
        title: "Get Contents of URL",
        details: ["Paste the following URL there:", URL_TOKEN],
      },
      {
        number: "6.2",
        title: "Set Desktop Picture",
        details: ["Set the input to the downloaded image"],
      },
    ],
  },
];

export const ANDROID_INSTRUCTIONS: InstructionStep[] = [
  {
    number: 5,
    title: "Setup Macro",
    paragraphs: [
      [
        "Open ",
        appLink("macrodroid", "MacroDroid", MACRODROID_APP_URL),
        " → Add Macro",
      ],
      [
        b("trigger", "Trigger:"),
        " Date/Time → Day/Time → Set time to ",
        b("time", "00:01:00"),
        " → Activate ",
        b("weekdays", "all weekdays"),
      ],
    ],
  },
  {
    number: 6,
    title: "Configure Actions",
    actions: [
      {
        number: "6.1",
        title: "Download Image",
        details: [
          [
            "Go to ",
            b("web-interactions", "Web Interactions"),
            " → ",
            b("http-request", "HTTP Request"),
          ],
          "Request method: GET",
          "Paste the URL below:",
          URL_TOKEN,
          ["Enable: ", b("block-next", "Block next actions until complete")],
          ["Response: Tick ", b("save-response", '"Save HTTP response to file"')],
          ["Folder & filename: ", code("download-path", "/Download/life.png")],
        ],
      },
      {
        number: "6.2",
        title: "Set Wallpaper",
        details: [
          [
            "Go to ",
            b("device-settings", "Device Settings"),
            " → ",
            b("set-wallpaper", "Set Wallpaper"),
          ],
          ["Choose ", b("image-and-screen", "Image and Screen")],
          [
            "Enter folder & filename: ",
            code("wallpaper-path", "/Download/life.png"),
          ],
        ],
        note: [
          "Use the ",
          nb("exact-same", "exact same folder and filename"),
          " in both actions.",
        ],
      },
    ],
  },
  {
    number: 7,
    title: "Finalize",
    paragraphs: [
      ["Give the macro a name → Tap ", b("create-macro", '"Create Macro"')],
    ],
  },
  {
    number: 8,
    title: "Testing & Managing",
    paragraphs: [
      [
        b("test", "Test:"),
        " MacroDroid → Macros → select your macro → More options → ",
        b("test-macro", "Test macro"),
      ],
      [b("stop", "Stop:"), " Toggle off or delete the macro"],
      [
        b("edit-url", "Edit URL:"),
        " Tap the HTTP Request action → Update the URL → ",
        b("save", "Save"),
      ],
    ],
  },
];
