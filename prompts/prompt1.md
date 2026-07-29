Project context

This is the front-end for "The Git Calendar" (gitcallendar). The back-end already exists and is deployed — it exposes an endpoint that generates a wallpaper PNG based on a GitHub user's commits:

https://gitcallendar-image.vercel.app/graph?username={username}&width={width}&height={height}&shape={shape}&background={background}&color={color}

The back-end source lives in a separate repository: https://github.com/matheusaudibert/gitcallendar

Before writing any code, fetch/read the README.md and RESOLUTIONS.md files from that exact repository (https://github.com/matheusaudibert/gitcallendar) to extract:
- the complete and exact list of query parameters accepted by the /graph endpoint and their defaults
- the complete list of resolutions (width/height) for ALL supported devices (iPhone and Android), with the exact device names
Use this real data to populate the selects — do not invent device models or resolutions.

IMPORTANT: All content on the page itself (headings, labels, buttons, helper text, instructions, error messages, etc.) must be written in English, regardless of what language this prompt is in.

Mandatory stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui — use shadcn components for ALL UI elements (Input, Select, Combobox, Button, Card, Badge, Separator, Skeleton, Tabs or ToggleGroup, RadioGroup, Alert, Tooltip, etc). Do not hand-roll inputs/selects.
- Theme: fixed dark mode (the whole page is dark, no light/dark toggle needed)
- Fully responsive: the layout must work well on mobile (primary use case), tablet, and desktop. Test breakpoints mentally for narrow phone widths especially, since most users will access this from their phone.

Icons
- Use icons wherever it makes sense to reinforce meaning, not just decoration. Use a proper icon library (e.g. lucide-react, which pairs well with shadcn) plus recognizable brand icons for Apple, Android, and GitHub (e.g. via simple-icons, react-icons, or inline SVG brand marks) — do not use generic/wrong icons for these three, they must be visually identifiable as the real brand marks.
- Suggested usage:
  - GitHub icon next to the username input / validation state
  - Apple icon on the "Apple / iOS Shortcuts" platform card
  - Android icon on the "Android / MacroDroid" platform card
  - Check icon for valid states, X or alert icon for invalid states, loading spinner for the checking state
  - Copy icon on the "copy URL" button (swap to a check icon briefly after copying)
  - Small icons for shape options (rounded square, square, circle) and relevant device/phone icon near the model selector

Title and subtitle (simple hero at the top of the page)
- Title: "Ship code. See it every day."
- Subtitle: "The Git Calendar turns your yearly GitHub contribution graph into a wallpaper that updates itself automatically."

Page flow — IMPORTANT: the entire process is a single wizard, numbered sequentially from step 1 to the final step (the final instructions are the numeric continuation of the same flow, not a separate section that restarts at 1). Each step only appears/unlocks once the previous one is valid. Render the numbering visually (e.g. a numbered badge/circle next to each step card).

STEP 1 — GitHub username
- "@username" style input (visual "@" prefix)
- As the user types (debounced), validate in real time whether the profile exists by hitting https://api.github.com/users/{username}
- Instant visual feedback: "checking" state (spinner/skeleton), "valid" state (green check + user avatar if desired), "invalid" state (red error, e.g. Alert variant destructive)
- Only unlocks Step 2 once the username is confirmed valid

STEP 2 — Choose platform
- Apple (iOS Shortcuts) or Android (MacroDroid)
- Use something like a ToggleGroup or two clickable "radio card" style Cards, each with the real Apple/Android brand icon
- Once chosen, unlocks Step 3

STEP 3 — Choose device model
- If Apple: shadcn Select (no free typing) listing all supported iPhones, pulled from RESOLUTIONS.md in the backend repo
- If Android: shadcn Combobox (Popover + Command, with search/typing) listing all supported Android devices, pulled from RESOLUTIONS.md in the backend repo
- The chosen model determines the width/height used in the final URL
- Once chosen, unlocks Step 4

STEP 4 — Customization (pre-filled with defaults)
- background: Select or RadioGroup with github | dark | light — default "github"
- color: Select or a grid of clickable color swatches with green, blue, purple, red, yellow, orange, pink, white, black — default "green"
- shape: RadioGroup/ToggleGroup with rounded | square | circle (show a small visual preview of each shape: rounded square, sharp square, circle) — default "rounded"

STEP 5 — Preview + dynamically generated link
- From the moment the username is valid (Step 1), a valid URL already exists using the defaults for the steps that follow. Any change to any field updates the URL live.
- Show the generated image (the endpoint URL itself as an <img src>) inside a Card, ideally with a light phone-mockup frame around it if feasible (optional visual polish)
- Show the final URL in a read-only field with a "copy" button (Button + icon, with "copied!" feedback)
- Exact format of the final URL, e.g.:
  https://gitcallendar-image.vercel.app/graph?username=matheusaudibert&background=github&color=green&shape=rounded&height=2556&width=1179

From here, the final steps depend on the platform chosen in Step 2 — but they keep the SAME sequential numbering (it does not restart at 1).

--- If Apple (iOS Shortcuts): ---

STEP 6 — Create shortcut
Open Shortcuts app → Go to Automation tab → New Automation → Time of Day → 6:00 AM → Repeat "Daily" → Select "Run Immediately" → "Create New Shortcut"

STEP 7 — Create automation
ADD THESE ACTIONS:
7.1 "Get Contents of URL" → paste the following URL there:
{DYNAMICALLY_GENERATED_URL}
7.2 "Set Wallpaper Photo" → choose "Lock Screen"
Important: In "Set Wallpaper Photo", tap the arrow (→) to show options → disable both "Crop to Subject" and "Show Preview".
This prevents iOS from cropping and asking for confirmation each time.

--- If Android (MacroDroid): ---

STEP 6 — Setup Macro
Open MacroDroid → Add Macro
Trigger: Date/Time → Day/Time → Set time to 00:01:00
→ Activate all weekdays

STEP 7 — Configure Actions
7.1 Download Image
- Go to Web Interactions → HTTP Request
- Request method: GET
- Paste the URL below:
{DYNAMICALLY_GENERATED_URL}
- Enable: Block next actions until complete
- Response: Tick Save HTTP response to file
- Folder & filename: /Download/life.png

7.2 Set Wallpaper
- Go to Device Settings → Set Wallpaper
- Choose Image and Screen
- Enter folder & filename: /Download/life.png

Important: Use the exact same folder and filename in both actions.

STEP 8 — Finalize
Give the macro a name → Tap Create Macro

STEP 9 — Testing & Managing
Test: MacroDroid → Macros → select your macro → More options → Test macro
Stop: Toggle off or delete the macro
Edit URL: Tap the HTTP Request action → Update the URL → Save

---

Render these final steps (6+) using the same visual "step" component as steps 1-5 (same numbered badge, same connecting vertical line/timeline), so it reads as the natural continuation of the wizard, not a separate section.

Only adjust the example filename/URL in these instructions ("life.png", "lifecal-virid.vercel.app") if needed to match the real gitcallendar endpoint — but keep the structure, steps, and formatting identical to what's specified above, translated/kept in English as shown.

UX/design requirements
- Single page, fully focused on this flow (no heavy navbar, no unrelated extra sections)
- Visible, consistent step numbering from start to finish (1 through 9, depending on platform), reinforcing that this is one linear process
- Fully responsive across mobile, tablet, and desktop — mobile is the primary target
- Each step animates in smoothly (fade/slide) as it unlocks — framer-motion is fine if you want it (optional)
- Dark, elegant, minimal design with strong typographic hierarchy — think dev-focused landing pages (Vercel/Linear/GitHub dark)
- Friendly error state if the username doesn't exist (don't let the wizard advance)
- Loading states using shadcn Skeleton where it makes sense (e.g. while the image preview loads)
- On desktop, constrain the entire page content to a max-width of 900px, horizontally centered (e.g. a wrapper with `max-w-[900px] mx-auto`, with reasonable side padding on smaller viewports so it doesn't touch the edges). Below desktop breakpoints, let the content use the full available width as usual for mobile-first responsiveness.
- Meaningful, correctly-branded icons throughout (see Icons section above)

Deliverable
Implement this as a single page in app/page.tsx (plus helper components in app/components/ if needed), using the necessary shadcn/ui components (install any missing ones). By the end, make sure the image URL and the instruction text update live as the user changes any option.