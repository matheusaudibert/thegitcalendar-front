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

/** Token substituted with the live, dynamically generated image URL at render time. */
export const URL_TOKEN = "{{URL}}";

export const APPLE_INSTRUCTIONS: InstructionStep[] = [
  {
    number: 5,
    title: "Create shortcut",
    paragraphs: [
      'Open Shortcuts app → Go to Automation tab → New Automation → Time of Day → 6:00 AM → Repeat "Daily" → Select "Run Immediately" → "Create New Shortcut"',
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
        note: 'In "Set Wallpaper Photo", tap the arrow (→) to show options → disable both "Crop to Subject" and "Show Preview". This prevents iOS from cropping and asking for confirmation each time.',
      },
    ],
  },
];

export const ANDROID_INSTRUCTIONS: InstructionStep[] = [
  {
    number: 5,
    title: "Setup Macro",
    paragraphs: [
      "Open MacroDroid → Add Macro",
      "Trigger: Date/Time → Day/Time → Set time to 00:01:00 → Activate all weekdays",
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
          "Go to Web Interactions → HTTP Request",
          "Request method: GET",
          "Paste the URL below:",
          URL_TOKEN,
          "Enable: Block next actions until complete",
          'Response: Tick "Save HTTP response to file"',
          "Folder & filename: /Download/life.png",
        ],
      },
      {
        number: "6.2",
        title: "Set Wallpaper",
        details: [
          "Go to Device Settings → Set Wallpaper",
          "Choose Image and Screen",
          "Enter folder & filename: /Download/life.png",
        ],
        note: "Use the exact same folder and filename in both actions.",
      },
    ],
  },
  {
    number: 7,
    title: "Finalize",
    paragraphs: ['Give the macro a name → Tap "Create Macro"'],
  },
  {
    number: 8,
    title: "Testing & Managing",
    paragraphs: [
      "Test: MacroDroid → Macros → select your macro → More options → Test macro",
      "Stop: Toggle off or delete the macro",
      "Edit URL: Tap the HTTP Request action → Update the URL → Save",
    ],
  },
];
