// TEMPORARY visual-verification route for src/components/aurora.
// Delete before finishing the claim.
import { AuroraWaveform } from "@/components/aurora/AuroraWaveform";
import {
  ConnectedAurora,
  CtaAurora,
  HeroAurora,
  MomentsAurora,
  MomentsCardAurora,
  PlansAurora,
  R3Aurora,
  RhythmAurora,
  TrustAurora,
} from "@/components/aurora/presets";

const SECTIONS = [
  { name: "1 Hero", h: 1086, node: <HeroAurora /> },
  { name: "2 Moments", h: 966, node: <MomentsAurora /> },
  { name: "3 R3 Loop", h: 815, node: <R3Aurora /> },
  { name: "4 Connected", h: 815, node: <ConnectedAurora /> },
  { name: "5 Rhythm", h: 815, node: <RhythmAurora /> },
  { name: "6 Trust", h: 1086, node: <TrustAurora /> },
  { name: "7 Plans", h: 1086, node: <PlansAurora /> },
  { name: "8 Final CTA", h: 966, node: <CtaAurora /> },
];

export default function AuroraPreview() {
  return (
    <main>
      {SECTIONS.map((s) => (
        <section
          key={s.name}
          id={`sec-${s.name.split(" ")[0]}`}
          className="relative isolate"
          style={{ height: s.h }}
        >
          {s.node}
          <p className="absolute top-3 left-4 text-meta text-ink-400">{s.name}</p>
        </section>
      ))}

      <section id="sec-card" className="relative isolate p-16">
        <div
          className="relative isolate overflow-hidden rounded-card bg-surface-card p-6 shadow-card"
          style={{ width: 360, height: 200 }}
        >
          <MomentsCardAurora />
          <p className="text-card-title text-ink-800">Moments card field</p>
        </div>
      </section>

      <section id="sec-wave" className="relative isolate p-16">
        <AuroraWaveform id="preview-wave" className="block h-[90px] w-[480px]" />
      </section>
    </main>
  );
}
