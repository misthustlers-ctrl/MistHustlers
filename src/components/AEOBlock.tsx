import { CheckCircle2, AlertCircle, TrendingUp, Scale, Layers, ChevronRight } from "lucide-react";

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface ComparisonRow {
  feature: string;
  misthustlers: string | boolean;
  freelancer: string | boolean;
  bigAgency: string | boolean;
}

export interface ProCon {
  type: "pro" | "con";
  text: string;
}

export interface AEOBlockProps {
  /** Short 2-3 sentence answer for AI overview extraction */
  executiveSummary: string;
  /** 3-5 bullet takeaways for AI parsability */
  keyTakeaways?: string[];
  /** Numbered steps for process clarity */
  processSteps?: ProcessStep[];
  /** Comparison table rows */
  comparisonRows?: ComparisonRow[];
  /** Pros and cons list */
  prosAndCons?: ProCon[];
  /** Common misconceptions to bust */
  misconceptions?: { myth: string; reality: string }[];
  /** Defines the service/concept for AI extraction */
  definition?: { term: string; definition: string };
}

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="flex items-center justify-center text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
      </span>
    ) : (
      <span className="flex items-center justify-center text-red-400">
        <AlertCircle className="h-4 w-4" />
      </span>
    );
  }
  return <span className="text-abyssal-ink/75 text-xs font-medium">{value}</span>;
}

export default function AEOBlock({
  executiveSummary,
  keyTakeaways,
  processSteps,
  comparisonRows,
  prosAndCons,
  misconceptions,
  definition,
}: AEOBlockProps) {
  const pros = prosAndCons?.filter((p) => p.type === "pro") ?? [];
  const cons = prosAndCons?.filter((p) => p.type === "con") ?? [];

  return (
    <div className="space-y-8 font-body">
      {/* ─── Definition (AI entity extraction) ─── */}
      {definition && (
        <section
          aria-label={`Definition: ${definition.term}`}
          className="rounded-2xl bg-digital-orange/5 border border-digital-orange/20 px-6 py-5"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-digital-orange mb-2 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" /> Definition
          </h3>
          <p className="text-sm text-abyssal-ink/80 leading-relaxed">
            <strong className="text-abyssal-ink">{definition.term}:</strong>{" "}
            {definition.definition}
          </p>
        </section>
      )}

      {/* ─── Executive Summary (AI overview target) ─── */}
      <section
        aria-label="Executive Summary"
        className="rounded-2xl bg-ash-white border border-abyssal-ink/8 px-6 py-5"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/60 mb-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-digital-orange" /> Executive Summary
        </h3>
        <p className="text-sm text-abyssal-ink/80 leading-relaxed">{executiveSummary}</p>
      </section>

      {/* ─── Key Takeaways ─── */}
      {keyTakeaways && keyTakeaways.length > 0 && (
        <section aria-label="Key Takeaways" className="rounded-2xl bg-white border border-abyssal-ink/8 px-6 py-5 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-abyssal-ink/60 mb-4 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Key Takeaways
          </h3>
          <ul className="space-y-2.5">
            {keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-abyssal-ink/80 leading-relaxed">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-digital-orange/10 text-digital-orange font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Step-by-Step Process ─── */}
      {processSteps && processSteps.length > 0 && (
        <section aria-label="Our Process">
          <h3 className="font-display text-xl font-bold text-abyssal-ink mb-5 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-digital-orange" /> Our Process
          </h3>
          <ol className="relative border-l border-abyssal-ink/10 space-y-6 pl-8">
            {processSteps.map((s) => (
              <li key={s.step} className="relative">
                <span className="absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full bg-digital-orange text-white text-xs font-bold shadow-md">
                  {s.step}
                </span>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-abyssal-ink text-sm">{s.title}</h4>
                    {s.duration && (
                      <span className="rounded-full bg-ash-white border border-abyssal-ink/10 px-2.5 py-0.5 text-[10px] font-semibold text-abyssal-ink/55">
                        {s.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-abyssal-ink/65 leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ─── Comparison Table ─── */}
      {comparisonRows && comparisonRows.length > 0 && (
        <section aria-label="Comparison">
          <h3 className="font-display text-xl font-bold text-abyssal-ink mb-5 flex items-center gap-2">
            <Scale className="h-5 w-5 text-digital-orange" /> MistHustlers vs. Alternatives
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-abyssal-ink/10 shadow-sm">
            <table className="w-full text-xs text-center">
              <thead>
                <tr className="bg-abyssal-ink text-white">
                  <th className="py-3 px-4 text-left font-semibold rounded-tl-2xl">Feature</th>
                  <th className="py-3 px-4 font-bold text-digital-orange">MistHustlers</th>
                  <th className="py-3 px-4 font-semibold">Freelancer</th>
                  <th className="py-3 px-4 font-semibold rounded-tr-2xl">Big Agency</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-t border-abyssal-ink/8 ${i % 2 === 0 ? "bg-white" : "bg-ash-white"}`}
                  >
                    <td className="py-2.5 px-4 text-left font-medium text-abyssal-ink/80">{row.feature}</td>
                    <td className="py-2.5 px-4 font-semibold text-digital-orange">
                      <Cell value={row.misthustlers} />
                    </td>
                    <td className="py-2.5 px-4 text-abyssal-ink/60">
                      <Cell value={row.freelancer} />
                    </td>
                    <td className="py-2.5 px-4 text-abyssal-ink/60">
                      <Cell value={row.bigAgency} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ─── Pros & Cons ─── */}
      {prosAndCons && prosAndCons.length > 0 && (
        <section aria-label="Pros and Cons">
          <h3 className="font-display text-xl font-bold text-abyssal-ink mb-5">Pros & Cons</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {pros.length > 0 && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">✅ Pros</h4>
                <ul className="space-y-2">
                  {pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-emerald-900/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      {p.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {cons.length > 0 && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-red-600 mb-3">⚠️ Considerations</h4>
                <ul className="space-y-2">
                  {cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-red-900/80">
                      <AlertCircle className="h-3.5 w-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                      {c.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── Common Misconceptions ─── */}
      {misconceptions && misconceptions.length > 0 && (
        <section aria-label="Common Misconceptions" className="rounded-2xl bg-white border border-abyssal-ink/8 p-6 shadow-sm">
          <h3 className="font-display text-xl font-bold text-abyssal-ink mb-5 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-digital-orange" /> Common Misconceptions
          </h3>
          <div className="space-y-4">
            {misconceptions.map((m, i) => (
              <div key={i} className="grid sm:grid-cols-2 gap-2 text-xs border-b border-abyssal-ink/6 pb-4 last:border-0 last:pb-0">
                <div className="bg-red-50 rounded-xl p-3">
                  <span className="font-bold text-red-600 block mb-1">❌ Myth</span>
                  <p className="text-red-900/80">{m.myth}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <span className="font-bold text-emerald-700 block mb-1">✅ Reality</span>
                  <p className="text-emerald-900/80">{m.reality}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
