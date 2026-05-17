"use client";

import { useState } from "react";
import { ALERTS, BLOCKS } from "@/lib/mock-data";
import type { AlertStatus } from "@/lib/mock-data";

const PRIORITY_CONFIG = {
  critical: { label: "Crítica", color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  high: { label: "Alta", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
  medium: { label: "Media", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  low: { label: "Baja", color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
};

const TYPE_LABEL: Record<string, string> = {
  battery_low: "Batería baja",
  water_low: "Agua baja",
  air_low: "Aire bajo",
  locker_broken: "Taquilla averiada",
  lost_object: "Objeto olvidado",
};

export default function AlertasPage() {
  const [filter, setFilter] = useState<AlertStatus | "all">("all");

  const filtered = ALERTS.filter(
    (a) => filter === "all" || a.status === filter
  ).sort((a, b) => {
    const p = { critical: 0, high: 1, medium: 2, low: 3 };
    return p[a.priority] - p[b.priority];
  });

  return (
    <div className="space-y-5">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "active", "resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-brand-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-[#1E293B] dark:text-slate-300 dark:ring-slate-700"
            }`}
          >
            {f === "all" ? "Todas" : f === "active" ? "Activas" : "Resueltas"}
          </button>
        ))}
        <span className="ml-auto flex items-center text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} alerta{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Alerts list */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">
            No hay alertas en esta categoría.
          </div>
        )}
        {filtered.map((alert) => {
          const block = BLOCKS.find((b) => b.id === alert.blockId);
          const pc = PRIORITY_CONFIG[alert.priority];
          return (
            <div key={alert.id} className="flex items-start gap-4 px-6 py-5">
              {/* Priority badge */}
              <span
                className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${pc.color}`}
              >
                {pc.label}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-brand-navy dark:text-white">
                    {TYPE_LABEL[alert.type]}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {block?.name ?? alert.blockId}
                    {alert.lockerNumber ? ` · Taquilla #${alert.lockerNumber}` : ""}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {alert.message}
                </p>
                <p className="mt-1.5 text-xs text-slate-400">
                  {new Date(alert.timestamp).toLocaleString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Status */}
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  alert.status === "active"
                    ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                }`}
              >
                {alert.status === "active" ? "Activa" : "Resuelta"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
