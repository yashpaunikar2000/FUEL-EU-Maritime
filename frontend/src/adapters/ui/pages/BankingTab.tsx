import { useEffect, useState } from "react";

type BankEntry = {
  id?: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  applied: boolean;
  created_at?: string;
};

export default function BankingTab() {
  const [routeId, setRouteId] = useState("R001");
  const [year, setYear] = useState<number>(2024);
  const [loading, setLoading] = useState(false);
  const [cbBefore, setCbBefore] = useState<number | null>(null);
  const [available, setAvailable] = useState<number>(0);
  const [entries, setEntries] = useState<BankEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [applyAmount, setApplyAmount] = useState<number>(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/banking/records?routeId=${routeId}&year=${year}`);
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setCbBefore(json.cb_before ?? 0);
      setAvailable(json.available ?? 0);
      setEntries(json.entries ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch("/banking/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, year }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchRecords();
      alert("Banking successful");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApply = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch("/banking/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId, year, amount: applyAmount }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchRecords();
      alert(`Applied successfully`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const canBank = cbBefore !== null && cbBefore > 0;
  const canApply = available > 0 && applyAmount > 0 && applyAmount <= available;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Animated Title */}
      <h1
        className="text-3xl font-bold text-[#1E293B] mb-6"
        style={{
          animation: "slideIn 0.7s ease-out forwards, breathe 4s ease-in-out infinite",
        }}
      >
        Banking
      </h1>

      {/* Inputs */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-4">
          <input
            className="p-2 border rounded"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
          />

          <input
            type="number"
            className="p-2 border rounded w-24"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <button
            onClick={fetchRecords}
            className="px-4 py-2 bg-[#1E293B] text-white rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-slate-500">CB Before</p>
          <p className="text-xl font-bold text-[#1E293B]">
            {cbBefore?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-slate-500">Available Banked</p>
          <p className="text-xl font-bold text-[#1E293B]">
            {available.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-slate-500">Applied</p>
          <p className="text-xl font-bold text-[#1E293B]">0</p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-semibold mb-3 text-[#1E293B]">Actions</h3>

        <div className="flex items-center gap-4">
          {/* Bank Button */}
          <button
            onClick={handleBank}
            disabled={!canBank || actionLoading}
            className={`px-4 py-2 rounded text-white font-semibold ${
              canBank
                ? "bg-[#0EA5E9]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Bank Surplus
          </button>

          {/* Apply Bank */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={applyAmount}
              onChange={(e) => setApplyAmount(Number(e.target.value))}
              className="p-2 border rounded w-32"
            />

            <button
              onClick={handleApply}
              disabled={!canApply || actionLoading}
              className={`px-4 py-2 rounded text-white font-semibold ${
                canApply
                  ? "bg-green-600"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3 text-[#1E293B]">Bank Entries</h3>

        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Applied</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="py-3">{e.id}</td>
                <td className="py-3">{e.amount_gco2eq.toLocaleString()}</td>
                <td className="py-3">{e.applied ? "Yes" : "No"}</td>
                <td className="py-3">
                  {e.created_at
                    ? new Date(e.created_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}

            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-slate-400">
                  No bank entries
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
