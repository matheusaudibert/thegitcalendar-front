/**
 * The browser's zoom level, published as `--page-zoom` on `<html>` so a
 * decoration can divide its CSS size by it and keep the same size on screen
 * however far the page is zoomed.
 *
 * There is no API for the zoom level itself. `devicePixelRatio` is exact but
 * mixes it with the display's own density (a 1.5× laptop at 100% looks like a
 * 1× screen at 150%). The window's outer width (screen pixels) over its inner
 * width (CSS pixels) tells them apart, but only roughly: borders, the
 * scrollbar and whole-pixel widths put it a percent or two off, which is
 * enough to make the graphs creep as the zoom changes. So that ratio is only
 * used to guess the display density, which is then snapped to the scales
 * operating systems actually offer; the zoom is `devicePixelRatio` over that,
 * exact at every step.
 *
 * A docked devtools panel throws the ratio off, so an implausible one keeps
 * the last density found. Left unset (no script, or before it runs),
 * `var(--page-zoom, 1)` just scales with the page as before.
 *
 * `resize` fires in the same frame the zoom changes, before it is painted, so
 * the graphs never show a frame at the wrong size.
 */
export const PAGE_ZOOM_VAR = "--page-zoom";

/** Display scales offered by Windows, macOS and the common phone densities. */
const DENSITIES = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4];

/** ES5 on purpose, like the reveal guard: it runs inline before first paint. */
export const PAGE_ZOOM_SCRIPT = `(function(){var r=document.documentElement,d=${JSON.stringify(DENSITIES)},b=0;function u(){var p=window.devicePixelRatio||1,z=window.outerWidth/window.innerWidth;if(z>=0.25&&z<=5){var e=p/z,n=d[0];for(var i=1;i<d.length;i++)if(Math.abs(d[i]-e)<Math.abs(n-e))n=d[i];b=n}r.style.setProperty("${PAGE_ZOOM_VAR}",String(b?p/b:1))}u();window.addEventListener("resize",u)})();`;
