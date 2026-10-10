/**
 * SND01 sine taps — Yasuhiro Tsuchiya / https://snd.dev/
 *
 * Adapted from nerdsbrasil.com (MIT): a random tap from the set at a low
 * volume, so repeated interactions never sound like the same click.
 */

const TAP_SRC = [
  "/audio/snd01/tap_01.wav",
  "/audio/snd01/tap_02.wav",
  "/audio/snd01/tap_03.wav",
  "/audio/snd01/tap_04.wav",
  "/audio/snd01/tap_05.wav",
] as const;

const VOLUME = 0.2;
const cache = new Map<string, HTMLAudioElement>();

function ensure(src: string) {
  let el = cache.get(src);
  if (!el) {
    el = new Audio(src);
    el.preload = "auto";
    cache.set(src, el);
  }
  return el;
}

export function preloadTaps() {
  for (const src of TAP_SRC) ensure(src);
}

export function playTap() {
  const src = TAP_SRC[Math.floor(Math.random() * TAP_SRC.length)];
  // A clone per play, so overlapping taps don't cut each other off.
  const node = ensure(src).cloneNode(true) as HTMLAudioElement;
  node.volume = VOLUME;
  // Browsers reject playback until the visitor has interacted with the page;
  // a missed tap is harmless, so the rejection is swallowed.
  void node.play().catch(() => undefined);
}
