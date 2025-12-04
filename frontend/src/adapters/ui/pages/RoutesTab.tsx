import { useState, useEffect } from "react";

interface Route {
  id: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export default function RoutesTab() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingBaseline, setSettingBaseline] = useState<string | null>(null);

  const [vesselTypeFilter, setVesselTypeFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/routes");
      if (!response.ok) throw new Error(`Failed to fetch routes: ${response.statusText}`);

      const raw = await response.json();
      const items = Array.isArray(raw) ? raw : raw.routes ?? [];

      const data: Route[] = items.map((r: any) => ({
        id: (r.route_id ?? r.id ?? "").toString(),
        vesselType: r.vesselType ?? r.vessel_type ?? "",
        fuelType: r.fuelType ?? r.fuel_type ?? "",
        year: Number(r.year ?? 0),
        ghgIntensity: Number(r.ghg_intensity ?? r.ghgIntensity ?? 0),
        fuelConsumption: Number(r.fuelConsumption ?? r.fuel_consumption ?? 0),
        distance: Number(r.distance ?? 0),
        totalEmissions: Number(r.totalEmissions ?? r.total_emissions ?? 0),
        isBaseline: Boolean(r.is_baseline ?? r.isBaseline ?? false),
      }));

      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      setSettingBaseline(routeId);
      const response = await fetch(`/routes/${routeId}/baseline`, { method: "POST" });

      if (!response.ok) throw new Error(`Failed to set baseline: ${response.statusText}`);

      setRoutes(
        routes.map((route) =>
          route.id === routeId ? { ...route, isBaseline: true } : route
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set baseline");
    } finally {
      setSettingBaseline(null);
    }
  };

  const vesselTypes = [...new Set(routes.map((r) => r.vesselType))].sort();
  const fuelTypes = [...new Set(routes.map((r) => r.fuelType))].sort();
  const years = [...new Set(routes.map((r) => r.year))].sort((a, b) => b - a);

  const filteredRoutes = routes.filter((route) => {
    const vesselMatch = !vesselTypeFilter || route.vesselType === vesselTypeFilter;
    const fuelMatch = !fuelTypeFilter || route.fuelType === fuelTypeFilter;
    const yearMatch = !yearFilter || route.year === parseInt(yearFilter);
    return vesselMatch && fuelMatch && yearMatch;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-8 bg-[#1E293B] rounded-full"></div>

                <h1
                  className="text-4xl font-bold text-[#1E293B]"
                  style={{
                    animation: "slideIn 0.5s ease-out forwards, breathe 2s ease-in-out infinite",
                  }}
                >
                  Routes Management
                </h1>
              </div>

              <p className="text-slate-500 text-lg ml-6">
                View and manage maritime routes with baseline settings
              </p>
            </div>

            <div className="text-right text-sm">
              <p className="text-slate-500">
                Total Routes:{" "}
                <span className="font-bold text-[#1E293B]">{routes.length}</span>
              </p>
              <p className="text-slate-500 mt-1">
                Baselines:{" "}
                <span className="font-bold text-green-600">
                  {routes.filter((r) => r.isBaseline).length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Error Box */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-600 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-900 font-semibold text-sm mb-1">⚠ Error Loading Routes</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>

              <button
                onClick={fetchRoutes}
                className="ml-4 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
              >
                Retry Now
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 bg-white rounded-lg border border-slate-200 p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-[#0EA5E9] rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-900">Advanced Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-slate-900 mb-3">🚢 Vessel Type</label>
              <select
                value={vesselTypeFilter}
                onChange={(e) => setVesselTypeFilter(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-700 
                           hover:border-[#0EA5E9] focus:ring-2 focus:ring-[#1E293B]"
              >
                <option value="">All Vessels</option>
                {vesselTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-slate-900 mb-3">⛽ Fuel Type</label>
              <select
                value={fuelTypeFilter}
                onChange={(e) => setFuelTypeFilter(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-700 
                           hover:border-[#0EA5E9] focus:ring-2 focus:ring-[#1E293B]"
              >
                <option value="">All Fuels</option>
                {fuelTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-slate-900 mb-3">📅 Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-700 
                           hover:border-[#0EA5E9] focus:ring-2 focus:ring-[#1E293B]"
              >
                <option value="">All Years</option>
                {years.map((year) => <option key={year}>{year}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#1E293B] mb-6"></div>
              <p className="text-slate-600 font-semibold text-lg">Loading routes…</p>
              <p className="text-slate-400 text-sm mt-2">Fetching data from maritime database</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E293B] border-b-2 border-[#1E293B]">
                    {[
                      "Route ID",
                      "Vessel Type",
                      "Fuel Type",
                      "Year",
                      "GHG Intensity",
                      "Consumption (t)",
                      "Distance (km)",
                      "Emissions (t)",
                      "Action",
                    ].map((item) => (
                      <th key={item} className="px-6 py-4 text-left text-sm font-bold text-white">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredRoutes.map((route, index) => (
                    <tr
                      key={route.id}
                      className={`border-b border-slate-200 transition ${
                        route.isBaseline
                          ? "bg-[#E6F9EF] border-l-4 border-l-[#16A34A]"
                          : index % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-[#1E293B]">{route.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{route.vesselType}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{route.fuelType}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{route.year}</td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] font-semibold">
                          {route.ghgIntensity.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {route.fuelConsumption.toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {route.distance.toFixed(0)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            route.totalEmissions > 100
                              ? "bg-red-50 text-red-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {route.totalEmissions.toFixed(2)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {route.isBaseline ? (
                          <span className="px-4 py-2 rounded-lg bg-[#16A34A] text-white font-bold shadow">
                            ✓ Baseline
                          </span>
                        ) : (
                          <button
                            onClick={() => setBaseline(route.id)}
                            disabled={settingBaseline === route.id}
                            className={`px-4 py-2 text-white font-bold rounded-lg shadow hover:opacity-90 ${
                              settingBaseline === route.id
                                ? "bg-slate-400 cursor-not-allowed"
                                : "bg-[#1E293B]"
                            }`}
                          >
                            {settingBaseline === route.id ? "Setting…" : "Set Baseline"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
