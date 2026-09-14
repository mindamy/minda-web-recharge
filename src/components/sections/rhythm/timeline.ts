/**
 * Geometry for the Rhythm wavy timeline (DESIGN-SPEC §3.5, §4.2 #5).
 *
 * Everything here is pure maths evaluated once at module scope, so the rail
 * and the nodes are generated from *one* set of constants. That matters: the
 * nodes are absolutely-positioned HTML sitting over an inline SVG, so if the
 * two ever disagreed the dots would drift off the stroke. Nothing is measured
 * at runtime and nothing is animated by these numbers.
 *
 * Units are the deck's own 1448px reference pixels. The horizontal rail is
 * drawn in a viewBox whose x origin is shifted to the left edge of the `wide`
 * container's content box at that reference width, so a node's spec x-centre
 * can be written down verbatim and still land in the right place.
 */

/* -------------------------------------------------------------------------- */
/* Horizontal rail — lg and up                                                */
/* -------------------------------------------------------------------------- */

/**
 * The `wide` container's content box at the 1448px reference — §1.7 puts it
 * at 1360px, centred, so it runs from x 44 to x 1404.
 *
 * Node positions are emitted as percentages of this box, so if the container
 * width ever changes the timeline scales proportionally and stays centred:
 * the six spec x-centres are themselves symmetric about the page centre.
 */
const VIEW_X = 44;
export const VIEW_W = 1360;
/** Tall enough for the largest node plus its two label lines. */
export const VIEW_H = 224;

/** Y of every node circle's centre. The circles share one horizontal axis. */
const AXIS = 84;
/** The rail's midline sits below the axis, so crests cross the circles' lower half. */
const RAIL_MID = AXIS + 25;
/** §3.5: amplitude ~26px. */
const RAIL_AMP = 26;
/** §3.5: one full period roughly every 2 nodes (mean node gap is ~216px). */
const RAIL_PERIOD = 433;

/** Spec x-centres, verbatim from §3.5. */
const NODE_X = [182, 400, 616, 820, 1050, 1265] as const;

/**
 * The rail. Phase is anchored to node 1 so every node lands on an extreme:
 * odd nodes on a trough, even nodes on a crest, which is what makes the line
 * visibly rise and dip *between* nodes.
 */
function railY(x: number) {
  return RAIL_MID + RAIL_AMP * Math.cos((2 * Math.PI * (x - NODE_X[0])) / RAIL_PERIOD);
}

/**
 * Samples a curve into a polyline.
 *
 * A 12px step leaves a worst-case deviation from the true sine of under 0.1px
 * at this amplitude and period — invisible under a 1.5px stroke, and far
 * cheaper to reason about than fitting Béziers.
 */
function polyline(from: number, to: number, step: number, point: (t: number) => [number, number]) {
  const parts: string[] = [];
  for (let t = from; t < to; t += step) {
    const [x, y] = point(t);
    parts.push(`${parts.length === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  const [x, y] = point(to);
  parts.push(`L${x.toFixed(2)} ${y.toFixed(2)}`);
  return parts.join(" ");
}

/** The horizontal rail path, bleeding to both edges of the content box. */
export const RAIL_PATH_H = polyline(VIEW_X, VIEW_X + VIEW_W, 12, (x) => [x, railY(x)]);

/** `viewBox` for the horizontal rail — x-shifted so spec coordinates work as-is. */
export const RAIL_VIEWBOX_H = `${VIEW_X} 0 ${VIEW_W} ${VIEW_H}`;

/* -------------------------------------------------------------------------- */
/* Vertical rail — below lg                                                   */
/* -------------------------------------------------------------------------- */

/**
 * §4.2 #5 asks for a 64px row pitch, which cannot hold an 88px photo circle.
 * 112px is the smallest pitch that clears the photo nodes and still leaves a
 * readable gap between label blocks.
 */
const ROW_PITCH = 112;
const ROW_FIRST = ROW_PITCH / 2;
export const VERT_H = ROW_PITCH * NODE_X.length;
/** §4.2 #5: the rail runs down the left edge at x ~= 36. */
const RAIL_X = 36;
const VERT_AMP = 18;
const VERT_PERIOD = ROW_PITCH * 2;
/** §4.2 #5: nodes alternate their horizontal offset by +/-14px. */
const VERT_OFFSET = 14;
/** Wide enough for the rail's own excursion plus its stroke. */
export const VERT_W = 72;

function vertX(y: number) {
  return RAIL_X - VERT_AMP * Math.cos((2 * Math.PI * (y - ROW_FIRST)) / VERT_PERIOD);
}

export const RAIL_PATH_V = polyline(0, VERT_H, 8, (y) => [vertX(y), y]);
export const RAIL_VIEWBOX_V = `0 0 ${VERT_W} ${VERT_H}`;
/** The straight `sm` rail, inset from the ends so it reads as a rail, not a border. */
export const STRAIGHT_RAIL = { x: RAIL_X, top: 16, height: VERT_H - 32 } as const;

/* -------------------------------------------------------------------------- */
/* Per-node placement                                                         */
/* -------------------------------------------------------------------------- */

export type NodePlacement = {
  /** Desktop: `left`, as a percentage of the content box. */
  "--node-x": string;
  /** Desktop: padding that drops the circle's centre onto the node axis. */
  "--node-pt": string;
  /** Desktop: diameter of a photo node. */
  "--node-size": string;
  /** Below lg: `top` of the node's row. */
  "--row-y": string;
  /** Below lg: height of the node's row, which its contents centre against. */
  "--row-h": string;
  /** Mobile: the circle's centre x, on the straight rail. */
  "--circle-x": string;
  /** Tablet: the circle's centre x, offset onto the vertical sine. */
  "--circle-x-md": string;
};

/**
 * Placement for node `index`, given its desktop diameter.
 *
 * Returned as CSS custom properties rather than classes because the values
 * are per-node data; the responsive *rules* that consume them stay in the
 * component's class list where they can be read at a glance.
 */
export function nodePlacement(index: number, diameter: number): NodePlacement {
  const x = NODE_X[index];
  const offset = index % 2 === 0 ? -VERT_OFFSET : VERT_OFFSET;

  return {
    "--node-x": `${(((x - VIEW_X) / VIEW_W) * 100).toFixed(3)}%`,
    "--node-pt": `${AXIS - diameter / 2}px`,
    "--node-size": `${diameter}px`,
    "--row-y": `${index * ROW_PITCH}px`,
    "--row-h": `${ROW_PITCH}px`,
    "--circle-x": `${RAIL_X}px`,
    "--circle-x-md": `${RAIL_X + offset}px`,
  };
}

/**
 * Left edge of the label column below lg. Clears the widest circle at its
 * furthest right offset (60px icon centred at x 50) with room to breathe.
 */
export const LABEL_X = 104;
