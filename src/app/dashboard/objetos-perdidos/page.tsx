"use client";

import { useState } from "react";
import { LOST_OBJECTS, BLOCKS } from "@/lib/mock-data";
import type { ObjectStatus } from "@/lib/mock-data";

export default function ObjetosPerdidosPage() {
  const [filter, setFilter] = useState<ObjectStatus | "all">("all");

  const filtered = LOST_OBJECTS.filter(
    (o) => filter === "all" || o.status === filter
  ).sort(
    (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
  );

  const pending = LOST_OBJECTS.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-5">
      {/* Summary */}
      {pending > 0 && (
        <div className="rounded-xl bg-orange-50 px-5 py-4 ring-1 ring-orange-200 dark:bg-orange-900/20 dark:ring-orange-700">
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
            {pending} objeto{pending !== 1 ? "s" : ""} pendiente{pending !== 1 ? "s" : ""} de recoger
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "pending", "collected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-brand-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-[#1E293B] dark:text-slate-300 dark:ring-slate-700"
            }`}
          >
            {f === "all" ? "Todos" : f === "pending" ? "Pendientes" : "Recogidos"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["Fecha y hora", "Bloque", "Taquilla", "Estado", "Notas"].map(
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
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No hay objetos en esta categoría.
                  </td>
                </tr>
              )}
              {filtered.map((obj) => {
                const block = BLOCKS.find((b) => b.id === obj.blockId);
                return (
                  <tr
                    key={obj.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-700/50"
                  >
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {new Date(obj.detectedAt).toLocaleString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-navy dark:text-white">
                      {block?.name ?? obj.blockId}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      #{obj.lockerNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          obj.status === "pending"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}
                      >
                        {obj.status === "pending" ? "Pendiente" : "Recogido"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {obj.notes}
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
