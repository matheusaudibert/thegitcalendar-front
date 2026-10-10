/**
 * Entrance animations render their hidden state on the server (blurred,
 * transparent) and rely on React hydrating to play them. If the page's
 * JavaScript never runs — an old or locked-down browser, a failed script
 * load, an in-app webview — that hidden state would be permanent and the page
 * unreadable. This guard keeps the hidden state opt-in:
 *
 * - `REVEAL_READY_ATTR` on `<html>` is what lets elements marked with
 *   `REVEAL_ATTR` start hidden (see `globals.css`). Without it they are shown
 *   as they are, so a browser that runs no script at all reads the page fine.
 * - The inline script below sets it before first paint, so a working page
 *   never flashes its content before animating it in.
 * - If the app has not marked itself hydrated (`HYDRATED_ATTR`) within
 *   `TIMEOUT_MS`, the script takes it away again and everything is shown.
 */
export const REVEAL_ATTR = "data-reveal";
export const REVEAL_READY_ATTR = "data-reveal-ready";
export const HYDRATED_ATTR = "data-hydrated";

const TIMEOUT_MS = 4000;

/** ES5 on purpose: it has to run in exactly the browsers the app may not. */
export const REVEAL_GUARD_SCRIPT = `(function(){var r=document.documentElement;r.setAttribute("${REVEAL_READY_ATTR}","");setTimeout(function(){if(!r.hasAttribute("${HYDRATED_ATTR}"))r.removeAttribute("${REVEAL_READY_ATTR}")},${TIMEOUT_MS})})();`;

export function markHydrated() {
  document.documentElement.setAttribute(HYDRATED_ATTR, "");
}
