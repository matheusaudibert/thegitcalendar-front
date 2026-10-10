import { cn } from "@/lib/utils";

/**
 * Contribution graphs, after the one on github.com's old landing page, lining
 * both sides of the viewport from top to bottom. Each is generated from a
 * fixed seed, so the two sides differ from each other but render the same on
 * every visit and on server and client alike.
 */

const COLUMNS = 17;
/** Enough rows to run past the bottom of the tallest common viewport. */
const ROWS = 44;

const CELL = 42;
const GAP = 8;
const PITCH = CELL + GAP;

/** GitHub's dark-theme contribution colors, by level (0 = no commits). */
const LEVEL_FILL = [
  "fill-graph-empty",
  "fill-[#0e4429]",
  "fill-[#006d32]",
  "fill-[#26a641]",
  "fill-[#39d353]",
] as const;

/** Upper bounds of each level's share of days, most days having none. */
const LEVEL_ODDS = [0.7, 0.82, 0.91, 0.96, 1];

/** How far the ragged inner edge reaches into the graph, in columns. */
const MAX_INSET = 6;
/** Chance of a stray gap in the inner half, which roughens the edge. */
const GAP_ODDS = 0.12;

/**
 * Share of the active days actually painted; the rest are left empty, which
 * keeps the graphs sparse enough to sit behind the content.
 */
const PAINTED_SHARE = 0.2;

type Cell = { x: number; y: number; level: number };

/** mulberry32: a tiny seeded PRNG, so the pattern is fixed per seed. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A graph dense along its right edge, thinning into a ragged edge on the
 * left. The inset wanders a column at a time, so the edge reads as a
 * staircase rather than noise.
 */
function generateCells(seed: number): Cell[] {
  const random = seededRandom(seed);
  // A stream of its own, so thinning the days never shifts the pattern.
  const painted = seededRandom(seed + 1);
  const cells: Cell[] = [];
  let inset = MAX_INSET / 2;

  for (let y = 0; y < ROWS; y++) {
    const step = Math.floor(random() * 3) - 1;
    inset = Math.min(MAX_INSET, Math.max(0, inset + step));

    for (let x = Math.round(inset); x < COLUMNS; x++) {
      if (x < COLUMNS / 2 && random() < GAP_ODDS) continue;
      const roll = random();
      const active = LEVEL_ODDS.findIndex((odds) => roll < odds);
      const level = painted() < PAINTED_SHARE ? active : 0;
      cells.push({ x: x * PITCH, y: y * PITCH, level });
    }
  }
  return cells;
}

const LEFT_CELLS = generateCells(17);
const RIGHT_CELLS = generateCells(42);

function Graph({
  cells,
  mirrored = false,
  className,
}: {
  cells: Cell[];
  mirrored?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${COLUMNS * PITCH - GAP} ${ROWS * PITCH - GAP}`}
      // Covers the strip at any viewport height, keeping the dense outer edge
      // and the top row in place; whatever is cut off is the faded inner edge
      // or rows below the fold.
      preserveAspectRatio="xMaxYMin slice"
      className={cn(
        // Fades out toward the content, so the graph frames it rather than
        // competing with it. The mask flips along with a mirrored graph.
        "absolute top-0 h-full w-[28rem] mask-l-from-40% mask-l-to-100%",
        mirrored && "-scale-x-100",
        className,
      )}
    >
      {cells.map(({ x, y, level }) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={CELL}
          height={CELL}
          rx={5}
          className={LEVEL_FILL[level]}
        />
      ))}
    </svg>
  );
}

/**
 * The graphs pinned behind every page, one per side, each with its dense edge
 * against the viewport's edge and its ragged edge facing the content. Only
 * where the margins beside the content are wide enough to hold them; on
 * narrower screens they would sit under the text.
 */
export function ContributionDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden select-none lg:block"
    >
      <Graph cells={LEFT_CELLS} mirrored className="-left-16" />
      <Graph cells={RIGHT_CELLS} className="-right-16" />
    </div>
  );
}
