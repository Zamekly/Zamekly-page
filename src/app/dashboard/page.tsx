"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  alert = false,
}: {
  label: string;
  value: string;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm border border-gray-200 dark:bg-[#1E293B] dark:border-slate-700 ${
        alert ? "border-l-4 border-l-red-500" : ""
      }`}
    >
      <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand-navy dark:text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BloqueRow = {
  id: string;
  nombre: string;
  ubicacion: string;
  num_taquillas: number;
  bateria_solar: number;
  nivel_agua: number;
  presion_aire: number;
  estado: string;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [bloques, setBloques] = useState<BloqueRow[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    todayRevenue: 0,
    activeAlerts: 0,
  });
  const [lockersByBlock, setLockersByBlock] = useState<
    Record<string, { total: number; occupied: number }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [bloquesRes, taquillasRes, alertasRes, ingresosRes] =
        await Promise.all([
          supabase.from("bloques").select("*"),
          supabase.from("taquillas").select("bloque_id, estado"),
          supabase
            .from("alertas")
            .select("id", { count: "exact", head: true })
            .eq("estado", "active"),
          supabase
            .from("ingresos")
            .select("importe")
            .gte("created_at", todayStart.toISOString()),
        ]);

      const blocks: BloqueRow[] = bloquesRes.data ?? [];
      const taquillas = taquillasRes.data ?? [];
      const ingresos = ingresosRes.data ?? [];

      const total = taquillas.length;
      const occupied = taquillas.filter((t) => t.estado === "occupied").length;
      const todayRevenue = ingresos.reduce(
        (s: number, r: { importe: number }) => s + r.importe,
        0
      );

      const byBlock: Record<string, { total: number; occupied: number }> = {};
      for (const t of taquillas) {
        if (!byBlock[t.bloque_id]) byBlock[t.bloque_id] = { total: 0, occupied: 0 };
        byBlock[t.bloque_id].total++;
        if (t.estado === "occupied") byBlock[t.bloque_id].occupied++;
      }

      setBloques(blocks);
      setStats({
        total,
        occupied,
        todayRevenue,
        activeAlerts: alertasRes.count ?? 0,
      });
      setLockersByBlock(byBlock);
      setLoading(false);
    }
    load();
  }, []);

  const occupancyPct =
    stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;
  const operationalBlocks = bloques.filter(
    (b) => b.estado === "operational"
  ).length;

  const statusLabel: Record<string, string> = {
    operational: "Operativo",
    maintenance: "Mantenimiento",
    offline: "Offline",
  };
  const statusColor: Record<string, string> = {
    operational:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    maintenance:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    offline: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Ocupación total"
          value={`${occupancyPct}%`}
          sub={`${stats.occupied} de ${stats.total} taquillas`}
        />
        <StatCard
          label="Ingresos hoy"
          value={`${stats.todayRevenue.toFixed(0)} €`}
          sub="Todos los bloques"
        />
        <StatCard
          label="Alertas activas"
          value={String(stats.activeAlerts)}
          sub="Requieren atención"
          alert={true}
        />
        <StatCard
          label="Bloques operativos"
          value={`${operationalBlocks} / ${bloques.length}`}
          sub="En funcionamiento"
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
                {[
                  "Bloque",
                  "Ubicación",
                  "Taquillas",
                  "Ocupación",
                  "Batería",
                  "Estado",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloques.map((block) => {
                const lb = lockersByBlock[block.id] ?? {
                  total: block.num_taquillas,
                  occupied: 0,
                };
                const occPct =
                  lb.total > 0
                    ? Math.round((lb.occupied / lb.total) * 100)
                    : 0;
                return (
                  <tr
                    key={block.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-700/50"
                  >
                    <td className="px-6 py-4 font-medium text-brand-navy dark:text-white">
                      {block.nombre}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {block.ubicacion.split(",")[0]}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {block.num_taquillas}
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
                        className={`text-xs font-medium ${
                          block.bateria_solar < 30
                            ? "text-red-500"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {block.bateria_solar}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[block.estado]}`}
                      >
                        {statusLabel[block.estado]}
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
