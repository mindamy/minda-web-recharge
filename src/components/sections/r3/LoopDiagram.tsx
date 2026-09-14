import * as m from "motion/react-client";

import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PersonCircle } from "@/components/icons";
import { MicroEyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

import { LoopArcs } from "./LoopArcs";
import {
  DIAGRAM_H,
  DIAGRAM_W,
  LOOP_NODES,
  YOU_NODE,
  pctX,
  pctY,
  type LoopNode,
} from "./loopNodes";

/**
 * The R³ loop diagram, in its two forms.
 *
 * `LoopDiagram` renders the ellipse of arcs at `sm` and up, and the vertical
 * rail below it. DESIGN-SPEC §4.2 is explicit that the ellipse is *abandoned*
 * at `sm` rather than scaled: four labelled nodes on an ellipse cannot survive
 * 350 px, so the small-screen form becomes a stack that keeps the loop's
 * sequence and colour semantics and drops its shape.
 *
 * Construction: one inline SVG carrying nothing but the arcs, with the nodes
 * and labels as absolutely positioned HTML over it. The alternative —
 * `<foreignObject>` — would put the labels inside the SVG's coordinate space,
 * where they scale with the diagram: the 12px micro-eyebrows would shrink below
 * the spec's 13px floor whenever the column narrowed, and the text would stop
 * matching the type scale used everywhere else on the page. Positioned HTML
 * keeps the arcs fluid and the type fixed, and keeps the labels selectable and
 * reachable by find-in-page.
 */

/**
 * §5 #11 — node pop, with the slight overshoot from #5. Reduced motion is
 * handled by the root `MotionConfig reducedMotion="user"`, which drops the
 * transform and keeps the opacity fade, giving the required final state.
 */
const nodePop = (delay: number) => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay, ease: [0.34, 1.3, 0.64, 1] as const },
  },
});

/** §5 #12 — the status pill, 200ms behind the `You` node. */
const pillPop = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, delay: 0.2 } },
};

function LoopCircle({ node, className }: { node: LoopNode; className?: string }) {
  const { Icon } = node;

  if (node.id === "recharge") {
    return (
      <div className={cn("relative aspect-square", className)}>
        {/* The rose glow halo is a sibling of the disc, not a child: a child
            would paint on top of the node's own fill and tint it. */}
        <span aria-hidden className="absolute -inset-[9%] rounded-full bg-[#FBD3E2]/55" />
        <div className="border-border-rose relative flex size-full items-center justify-center rounded-full border-2 bg-[#FFFAFC]">
          <Icon
            className={cn("aspect-square", node.iconWidth, node.iconClass)}
            strokeWidth={1.8}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "shadow-node bg-surface-card flex aspect-square items-center justify-center rounded-full",
        className,
      )}
    >
      <Icon
        className={cn("aspect-square", node.iconWidth, node.iconClass)}
        strokeWidth={1.7}
      />
    </div>
  );
}

function NodeLabels({ node, className }: { node: LoopNode; className?: string }) {
  return (
    <div className={className}>
      <MicroEyebrow className={node.labelClass}>{node.label}</MicroEyebrow>
      <p className="mt-1.5 text-[0.9375rem] leading-tight font-semibold text-ink-800">
        {node.title}
      </p>
      <p className="text-card-body mt-1 text-ink-500">{node.sub}</p>
    </div>
  );
}

/**
 * The status pill carried inside the `You` node.
 *
 * Horizontal padding is the caller's, not a default: `cn` is plain `clsx` with
 * no tailwind-merge, so a `px-*` here could not be overridden by a call site —
 * whichever class Tailwind happens to emit later in the sheet would win.
 */
function StatusPill({ className }: { className?: string }) {
  return (
    <div className={cn("bg-surface-inner-blue rounded-full py-1.5 text-center", className)}>
      <p className="text-[0.6875rem] leading-[1.5] font-medium text-blue-ink xl:text-xs">
        {YOU_NODE.pill[0]}
        <br />
        {YOU_NODE.pill[1]}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The ellipse — `sm` and up                                                  */
/* -------------------------------------------------------------------------- */

function LoopEllipse() {
  return (
    <m.div
      className="relative w-full max-w-[42rem]"
      style={{ aspectRatio: `${DIAGRAM_W} / ${DIAGRAM_H}` }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -18% 0px" }}
    >
      {/* The arcs and this wrapper cover exactly the same box, so their two
          scroll observers cross the threshold on the same frame and the node
          pops stay in step with the arc that reaches them. */}
      <LoopArcs className="absolute inset-0 h-full w-full" />

      {/* Centre: the `You` squircle. A near-semicircular dome over softly
          rounded bottom corners — `rounded-t-[50%]` gives the top corners a
          radius of half the width horizontally and half the height vertically,
          which is the elliptical dome measured off the render (rx 59.5, ry 70
          on a 115 x 147 box), and the bottom keeps the 28px squircle token. */}
      <m.div
        className="absolute"
        style={{
          left: pctX(YOU_NODE.left),
          top: pctY(YOU_NODE.top),
          width: pctX(YOU_NODE.width),
          height: pctY(YOU_NODE.height),
        }}
        variants={nodePop(0)}
      >
        {/* Internal metrics are percentages of the squircle's own width so the
            stack still clears the dome at the narrowest two-column width
            (`lg`, where this box is only ~103 x 132 px). */}
        <div className="shadow-card rounded-b-squircle flex h-full flex-col items-center justify-center gap-1.5 rounded-t-[50%] bg-[#FDFDFD] px-[4%] pt-[10%] pb-[6%]">
          <PersonCircle className="aspect-square w-[34%] text-[#194BE4]" strokeWidth={1.8} />
          <p className="font-display text-[1.25rem] leading-none text-ink-900 xl:text-[1.5rem]">
            {YOU_NODE.title}
          </p>
          <m.div className="w-full" variants={pillPop}>
            <StatusPill className="px-1.5" />
          </m.div>
        </div>
      </m.div>

      {/* The three outer nodes. Each wrapper is exactly the circle's width so
          `aspect-square` keeps it circular at any column width; the label block
          hangs off it absolutely and holds its own typographic size. */}
      {LOOP_NODES.map((node) => (
        <m.div
          key={node.id}
          className="absolute -translate-x-1/2"
          style={{
            left: pctX(node.cx),
            top: pctY(node.cy - node.d / 2),
            width: pctX(node.d),
          }}
          variants={nodePop(node.delay)}
        >
          <div className="relative">
            <LoopCircle node={node} />
            <NodeLabels
              node={node}
              className={cn(
                "absolute top-[calc(100%+0.65rem)] left-1/2 -translate-x-1/2 text-center",
                node.id === "recharge" ? "w-52 xl:w-68" : "w-36 xl:w-44",
              )}
            />
          </div>
        </m.div>
      ))}
    </m.div>
  );
}

/* -------------------------------------------------------------------------- */
/* The vertical rail — below `sm`                                             */
/* -------------------------------------------------------------------------- */

/**
 * The connectors between stacked rows carry the ellipse's colour progression
 * top to bottom, so the loop still reads blue → green → rose in sequence even
 * though the shape is gone.
 */
const STACK_CONNECTORS = [
  "from-[#A9C9FB] to-[#99BFFA]",
  "from-[#99BFFA] to-[#9ED3B6]",
  "from-[#9ED3B6] to-[#F3A9BE]",
] as const;

function Connector({ gradient }: { gradient: string }) {
  return (
    <div
      aria-hidden
      className={cn("my-1 ml-[31px] h-10 w-0.5 rounded-full bg-linear-to-b", gradient)}
    />
  );
}

function LoopRail() {
  return (
    <RevealGroup stagger={0.08}>
      <RevealItem>
        <div className="flex items-start gap-4">
          <div className="shadow-card rounded-b-squircle flex size-16 shrink-0 flex-col items-center justify-center rounded-t-[50%] bg-[#FDFDFD] pt-[10%]">
            <PersonCircle className="aspect-square w-[42%] text-[#194BE4]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[1.25rem] leading-none text-ink-900">
              {YOU_NODE.title}
            </p>
            <StatusPill className="mt-2 inline-block px-3" />
          </div>
        </div>
      </RevealItem>

      {LOOP_NODES.map((node, index) => (
        <RevealItem key={node.id}>
          <Connector gradient={STACK_CONNECTORS[index]} />
          <div className="flex items-start gap-4">
            <LoopCircle node={node} className="size-16 shrink-0" />
            <NodeLabels node={node} className="min-w-0 flex-1" />
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function LoopDiagram({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* The RECHARGE label block hangs below the aspect box — it is absolutely
          positioned, so it contributes no height. The padding reserves flow
          space for it instead of letting it run into whatever follows. It is
          nearly zero at `xl`, where the box is wide enough that the title fits
          on one line and the block lands inside the box on its own. */}
      <div className="hidden pb-9 sm:block xl:pb-1">
        <LoopEllipse />
      </div>
      <div className="sm:hidden">
        <LoopRail />
      </div>
    </div>
  );
}
