import { BLOCKS, LOCKERS, ALERTS, REVENUE } from "@/lib/mock-data";

function StatCard({
  label,
  value,
  sub,
  color = "navy",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "navy" | "green" | "amber" | "red";
}) {
  const colors = {
    navy: "bg-brand-navy text-white",
    green: "bg-emerald-500 text-white",
    amber: "bg-amber-400 text-white",
    red: "bg-red-500 text-white",
  };
  return (
    <div className={`rounded-2xl p-6 shadow-sm ${colors[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs opacity-70">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const today = "2026-05-17";
  const totalLockers = LOCKERS.length;
  const occupiedLockers = LOCKERS.filter((l) => l.status === "occupied").length;
  const occupancyPct = Math.round((occupiedLockers / totalLockers) * 100);

  const todayRevenue = REVENUE.filter((r) => r.date === today).reduce(
    (s, r) => s + r.amount,
    0
  );

  const activeAlerts = ALERTS.filter((a) => a.status === "active").length;
  const operationalBlocks = BLOCKS.filter(
    (b) => b.status === "operational"
  ).length;

  const statusLabel: Record<string, string> = {
    operational: "Operativo",
    maintenance: "Mantenimiento",
    offline: "Offline",
  };
  const statusColor: Record<string, string> = {
    operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    offline: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ocupación total"
          value={`${occupancyPct}%`}
          sub={`${occupiedLockers} de ${totalLockers} taquillas`}
          color="navy"
        />
        <StatCard
          label="Ingresos hoy"
          value={`${todayRevenue.toFixed(0)} €`}
          sub="Todos los bloques"
          color="green"
        />
        <StatCard
          label="Alertas activas"
          value={String(activeAlerts)}
          sub="Requieren atención"
          color={activeAlerts > 2 ? "red" : "amber"}
        />
        <StatCard
          label="Bloques operativos"
          value={`${operationalBlocks} / ${BLOCKS.length}`}
          sub="En funcionamiento"
          color="navy"
        />
      </div>

      {/* Blocks table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-brand-navy dark:text-white">
            Resumen de bloques
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["Bloque", "Ubicación", "Taquillas", "Ocupación", "Batería", "Estado"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {BLOCKS.map((block) => {
                const blockLockers = LOCKERS.filter(
                  (l) => l.blockId === block.id
                );
                const occ = blockLockers.filter(
                  (l) => l.status === "occupied"
                ).length;
                const occPct = Math.round((occ / blockLockers.length) * 100);
                const rev = REVENUE.filter(
                  (r) => r.date === today && r.blockId === block.id
                ).reduce((s, r) => s + r.amount, 0);
                void rev;
                return (
                  <tr
                    key={block.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-brand-navy dark:text-white">
                      {block.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {block.location.split(",")[0]}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {block.lockerCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                          <div
                            className="h-full rounded-full bg-brand-navy dark:bg-brand-blue"
                            style={{ width: `${occPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {occPct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium ${block.batteryLevel < 30 ? "text-red-500" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {block.batteryLevel}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[block.status]}`}
                      >
                        {statusLabel[block.status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
