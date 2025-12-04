import { useEffect, useState } from "react";

export default function PoolingTab() {
  const [year, setYear] = useState(2024);
  const [ships, setShips] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [poolResult, setPoolResult] = useState<any>(null);

  const fetchAdjustedCB = async (y = year) => {
    setError("");
    try {
      const res = await fetch(`/compliance/adjusted-cb?year=${y}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setShips(json);
    } catch (err: any) {
      setError("Failed to load adjusted CB");
    }
  };

  useEffect(() => {
    fetchAdjustedCB(year);
  }, [year]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const createPool = async () => {
    setError("");
    try {
      const res = await fetch("/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipIds: selected, year }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPoolResult(json);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const simulatePool = (shipIds: string[]) => {
    const members = shipIds
      .map((id) => {
        const s = ships.find((x: any) => (x.shipId || x.ship_id) === id) as any;
        if (!s) return null;
        return {
          ship_id: id,
          cb_before: s.adjustedCB,
          cb_after: s.adjustedCB,
        };
      })
      .filter(Boolean) as any[];

    const total = members.reduce((acc, m) => acc + m.cb_before, 0);

    if (total < 0)
      return { valid: false, reason: "Total CB must be >= 0", members, total };

    const surplus = members.filter((m) => m.cb_before > 0);
    const deficit = members.filter((m) => m.cb_before < 0);

    surplus.sort((a, b) => b.cb_before - a.cb_before);
    deficit.sort((a, b) => a.cb_before - b.cb_before);

    for (const d of deficit) {
      let needed = -d.cb_after;
      for (const s of surplus) {
        if (s.cb_after <= 0) continue;
        if (needed <= 0) break;
        const give = Math.min(s.cb_after, needed);
        s.cb_after -= give;
        d.cb_after += give;
        needed -= give;
      }
    }

    return { valid: true, members, total };
  };

  const simulation = simulatePool(selected);

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Animated Title */}
      <h1
        className="text-3xl font-bold text-[#1E293B] mb-6"
        style={{
          animation: "slideIn 0.7s ease-out forwards, breathe 4s ease-in-out infinite",
        }}
      >
        Pooling
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="number"
          className="p-2 border rounded w-32"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />

        <button
          onClick={() => fetchAdjustedCB()}
          className="px-4 py-2 bg-[#1E293B] text-white rounded"
        >
          Load CB
        </button>

        <button
          onClick={() =>
            setSelected(ships.map((s: any) => s.shipId || s.ship_id))
          }
          className="px-4 py-2 bg-slate-200 rounded"
        >
          Select All
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
      )}

      {/* Adjusted CB Table */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-[#1E293B]">
          Adjusted CB by Ship
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th></th>
              <th>Ship ID</th>
              <th>CB Before</th>
            </tr>
          </thead>

          <tbody>
            {ships.map((s: any) => (
              <tr key={s.shipId} className="border-b">
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(s.shipId)}
                    onChange={() => toggle(s.shipId)}
                  />
                </td>
                <td>{s.shipId}</td>
                <td className={s.adjustedCB < 0 ? "text-red-600" : "text-green-700"}>
                  {s.adjustedCB.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simulation Preview */}
      {selected.length > 0 && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="font-semibold mb-3 text-[#1E293B]">
            Simulated Pool Preview
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th>Ship</th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {simulation.members.map((m: any) => (
                  <tr key={m.ship_id} className="border-b">
                    <td>{m.ship_id}</td>
                    <td>{m.cb_before}</td>
                    <td className={m.cb_after < 0 ? "text-red-600" : "text-green-700"}>
                      {m.cb_after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 font-semibold text-[#1E293B]">
            Total Pool CB:{" "}
            <span
              className={
                simulation.total < 0 ? "text-red-600" : "text-green-700"
              }
            >
              {simulation.total}
            </span>
          </p>
        </div>
      )}

      {/* Create Pool */}
      <button
        onClick={createPool}
        disabled={selected.length < 2 || !simulation.valid}
        className="px-6 py-3 bg-[#0EA5E9] text-white rounded font-bold hover:bg-[#0284C7] disabled:bg-slate-300"
      >
        Create Pool
      </button>

      {/* Output */}
      {poolResult && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-xl mb-4 text-[#1E293B]">
            Pool Created
          </h3>

          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th>Ship</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>

            <tbody>
              {poolResult.members.map((m: any) => (
                <tr key={m.ship_id} className="border-b">
                  <td>{m.ship_id}</td>
                  <td>{m.cb_before}</td>
                  <td className={m.cb_after < 0 ? "text-red-600" : "text-green-700"}>
                    {m.cb_after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 font-semibold text-[#1E293B]">
            Total Pool CB:{" "}
            <span
              className={
                poolResult.totalCB < 0 ? "text-red-600" : "text-green-700"
              }
            >
              {poolResult.totalCB}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
