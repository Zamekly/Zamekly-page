import { BLOCKS, LOCKERS } from "@/lib/mock-data";

function GaugeBar({
  value,
  warn = 30,
}: {
  value: number;
  warn?: number;
}) {
  const color =
    value < warn
      ? "bg-red-500"
      : value < warn * 1.5
      ? "bg-amber-400"
      : "bg-emerald-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span
        className={`text-xs font-medium ${
          value < warn ? "text-red-500" : "text-slate-600 dark:text-slate-400"
        }`}
      >
        {value}%
      </span>
    </div>
  );
}

export default function BloquesPage() {
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
    <div className="space-y-4">
      {BLOCKS.map((block) => {
        const lockers = LOCKERS.filter((l) => l.blockId === block.id);
        const occupied = lockers.filter((l) => l.status === "occupied").length;
        const broken = lockers.filter((l) => l.status === "broken").length;

        return (
          <div
            key={block.id}
            className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700"
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-700">
              <div>
                <h2 className="text-base font-semibold text-brand-navy dark:text-white">
                  {block.name}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {block.location}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[block.status]}`}
              >
                {statusLabel[block.status]}
              </span>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 px-6 py-5 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Taquillas</p>
                <p className="mt-1 text-lg font-bold text-brand-navy dark:text-white">
                  {block.lockerCount}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ocupadas</p>
                <p className="mt-1 text-lg font-bold text-brand-navy dark:text-white">
                  {occupied}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Averiadas</p>
                <p className={`mt-1 text-lg font-bold ${broken > 0 ? "text-red-500" : "text-brand-navy dark:text-white"}`}>
                  {broken}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Batería solar</p>
                <GaugeBar value={block.batteryLevel} warn={30} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Agua</p>
                <GaugeBar value={block.waterLevel} warn={25} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Presión aire</p>
                <GaugeBar value={block.airPressure} warn={20} />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-3 dark:border-slate-700">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Última revisión:{" "}
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {new Date(block.lastRevision).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {" · "}Instalado:{" "}
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {new Date(block.installedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
