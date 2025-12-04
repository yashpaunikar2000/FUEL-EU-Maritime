import { useEffect, useState } from "react";

interface CompareResult {
  year: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  baselineGHG: number;
  comparisonGHG: number;
  percentDiff: number;
  compliant: boolean;
}

export default function CompareTab() {
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "chart">("chart");

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await fetch("/routes/comparison");
      if (!res.ok) throw new Error("Failed to load comparison data");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-slate-600 font-semibold">
        Loading comparison…
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Animated Title */}
      <h1
        className="text-3xl font-bold text-[#1E293B] mb-6"
        style={{
          animation: "slideIn 0.7s ease-out forwards, breathe 4s ease-in-out infinite",
        }}
      >
        Compare Routes :- GHG Intensity
      </h1>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setView("chart")}
          className={`px-4 py-2 rounded font-semibold ${
            view === "chart"
              ? "bg-[#1E293B] text-white"
              : "bg-slate-100 text-[#1E293B]"
          }`}
        >
          Chart View
        </button>

        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded font-semibold ${
            view === "table"
              ? "bg-[#1E293B] text-white"
              : "bg-slate-100 text-[#1E293B]"
          }`}
        >
          Table View
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow p-6">
        {view === "chart" ? (
          <Chart results={results} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b">
                <th className="text-left p-3 text-sm font-semibold">Route ID</th>
                <th className="text-left p-3 text-sm font-semibold">Year</th>
                <th className="p-3 text-sm font-semibold">Baseline GHG</th>
                <th className="p-3 text-sm font-semibold">Comparison GHG</th>
                <th className="p-3 text-sm font-semibold">Diff (%)</th>
                <th className="p-3 text-sm font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r) => (
                <tr key={r.routeId} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-semibold text-[#1E293B]">{r.routeId}</td>
                  <td className="p-3">{r.year}</td>
                  <td className="p-3">{r.baselineGHG.toFixed(2)}</td>
                  <td className="p-3">{r.comparisonGHG.toFixed(2)}</td>

                  <td
                    className={`p-3 font-bold ${
                      r.percentDiff > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {r.percentDiff}%
                  </td>

                  <td className="p-3">
                    {r.compliant ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                        ✓ Compliant
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                        ✗ Non-Compliant
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


function Chart({ results }: { results: CompareResult[] }) {
  if (!results.length)
    return <div className="text-slate-500">No data to chart</div>;

  const maxVal = Math.max(
    ...results.map((r) => Math.max(r.baselineGHG, r.comparisonGHG)),
    1
  );

  const rowHeight = 36;
  const gap = 12;
  const width = 720;

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const show = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    text: string
  ) => {
    const svg = e.currentTarget.ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left + 8, y: e.clientY - rect.top + 8, text });
  };

  return (
    <div className="relative overflow-x-auto">
      <svg width={width} height={(rowHeight + gap) * results.length}>
        {results.map((r, i) => {
          const y = i * (rowHeight + gap);
          const baselineW = (r.baselineGHG / maxVal) * (width * 0.6);
          const compW = (r.comparisonGHG / maxVal) * (width * 0.6);

          return (
            <g key={r.routeId} transform={`translate(0, ${y})`}>
              <text x={10} y={20} className="text-sm" fill="#1E293B">
                {r.routeId}
              </text>

              {/* Baseline Bar */}
              <rect
                x={140}
                y={6}
                width={baselineW}
                height={12}
                fill="#CBD5E1" 
                rx={3}
                onMouseMove={(e) =>
                  show(e, `Baseline: ${r.baselineGHG.toFixed(2)}`)
                }
                onMouseLeave={() => setTooltip(null)}
              />

              {/* Comparison Bar */}
              <rect
                x={140}
                y={22}
                width={compW}
                height={12}
                fill={r.comparisonGHG > r.baselineGHG ? "#DC2626" : "#16A34A"}
                rx={3}
                onMouseMove={(e) =>
                  show(
                    e,
                    `Comparison: ${r.comparisonGHG.toFixed(2)} (${r.percentDiff}%)`
                  )
                }
                onMouseLeave={() => setTooltip(null)}
              />

              <text x={150 + Math.max(baselineW, compW)} y={18} fill="#1E293B">
                {r.baselineGHG.toFixed(1)} / {r.comparisonGHG.toFixed(1)}
              </text>

              <text
                x={150 + Math.max(baselineW, compW)}
                y={34}
                fill={r.percentDiff > 0 ? "#DC2626" : "#16A34A"}
              >
                {r.percentDiff}%
              </text>
            </g>
          );
        })}
      </svg>

      {tooltip && (
        <div
          style={{ left: tooltip.x, top: tooltip.y }}
          className="absolute bg-[#1E293B] text-white px-2 py-1 rounded text-xs pointer-events-none"
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
