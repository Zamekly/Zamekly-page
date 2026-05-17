"use client";

import { useState } from "react";
import { BLOCKS, LOCKERS } from "@/lib/mock-data";
import type { LockerStatus } from "@/lib/mock-data";

const STATUS_CONFIG: Record<
  LockerStatus,
  { label: string; bg: string; dot: string }
> = {
  available: {
    label: "Disponible",
    bg: "bg-emerald-50 ring-emerald-200 dark:bg-emerald-900/20 dark:ring-emerald-700",
    dot: "bg-emerald-500",
  },
  occupied: {
    label: "Ocupada",
    bg: "bg-blue-50 ring-blue-200 dark:bg-blue-900/20 dark:ring-blue-700",
    dot: "bg-blue-500",
  },
  broken: {
    label: "Averiada",
    bg: "bg-red-50 ring-red-200 dark:bg-red-900/20 dark:ring-red-700",
    dot: "bg-red-500",
  },
  maintenance: {
    label: "Mantenimiento",
    bg: "bg-amber-50 ring-amber-200 dark:bg-amber-900/20 dark:ring-amber-700",
    dot: "bg-amber-400",
  },
};

function timeLeft(until: string): string {
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return "Expirada";
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m} min`;
}

export default function TaquillasPage() {
  const [selectedBlock, setSelectedBlock] = useState(BLOCKS[0].id);
  const block = BLOCKS.find((b) => b.id === selectedBlock)!;
  const lockers = LOCKERS.filter((l) => l.blockId === selectedBlock).sort(
    (a, b) => a.number - b.number
  );

  const counts = {
    available: lockers.filter((l) => l.status === "available").length,
    occupied: lockers.filter((l) => l.status === "occupied").length,
    broken: lockers.filter((l) => l.status === "broken").length,
    maintenance: lockers.filter((l) => l.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      {/* Block selector */}
      <div className="flex flex-wrap items-center gap-4">
        <label
          htmlFor="block-select"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Bloque:
        </label>
        <select
          id="block-select"
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-brand-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/10 dark:border-slate-700 dark:bg-[#1E293B] dark:text-white"
        >
          {BLOCKS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.location.split(",")[0]}
            </option>
          ))}
        </select>
      </div>

      {/* Legend + counts */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(STATUS_CONFIG) as LockerStatus[]).map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700 dark:text-slate-300"
          >
            <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
            {STATUS_CONFIG[s].label}
            <span className="ml-1 font-bold text-slate-700 dark:text-slate-200">
              {counts[s]}
            </span>
          </span>
        ))}
      </div>

      {/* Locker grid */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        <p className="mb-5 text-sm font-semibold text-brand-navy dark:text-white">
          {block.name} · {lockers.length} taquillas
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {lockers.map((locker) => {
            const cfg = STATUS_CONFIG[locker.status];
            return (
              <div
                key={locker.id}
                className={`relative flex flex-col items-center rounded-xl p-3 ring-1 ${cfg.bg}`}
              >
                {/* Number */}
                <span className="text-lg font-bold text-brand-navy dark:text-white">
                  {String(locker.number).padStart(2, "0")}
                </span>
                {/* Status dot */}
                <span className={`mt-1.5 h-2 w-2 rounded-full ${cfg.dot}`} />
                {/* Time remaining */}
                {locker.status === "occupied" && locker.occupiedUntil && (
                  <span className="mt-1 text-[10px] font-medium text-blue-600 dark:text-blue-300">
                    {timeLeft(locker.occupiedUntil)}
                  </span>
                )}
                {/* Lost object indicator */}
                {locker.hasLostObject && (
                  <span
                    title="Objeto detectado"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-400 text-[9px] text-white"
                  >
                    !
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
