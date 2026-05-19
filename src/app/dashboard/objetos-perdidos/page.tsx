"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type ObjectStatus = "pending" | "collected";

type ObjetoRow = {
  id: string;
  bloque_id: string;
  taquilla_id: string;
  estado: ObjectStatus;
  notas: string | null;
  created_at: string;
  bloques?: { nombre: string } | null;
};

function lockerNumberFromId(id: string): number {
  const m = id.match(/-lk-(\d+)$/);
  return m ? parseInt(m[1]) : 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ObjetosPerdidosPage() {
  const [objects, setObjects] = useState<ObjetoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ObjectStatus | "all">("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("objetos_perdidos")
        .select("*, bloques(nombre)")
        .order("created_at", { ascending: false });

      setObjects(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = objects.filter(
    (o) => filter === "all" || o.estado === filter
  );

  const pending = objects.filter((o) => o.estado === "pending").length;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary banner */}
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
                {["Fecha y hora", "Bloque", "Taquilla", "Estado", "Notas"].map((h) => (
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No hay objetos en esta categoría.
                  </td>
                </tr>
              )}
              {filtered.map((obj) => {
                const blockName = (obj.bloques as { nombre: string } | null)?.nombre ?? obj.bloque_id;
                const lockerNum = lockerNumberFromId(obj.taquilla_id);
                return (
                  <tr
                    key={obj.id}
                    className="border-b border-slate-50 last:border-0 dark:border-slate-700/50"
                  >
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {new Date(obj.created_at).toLocaleString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-navy dark:text-white">
                      {blockName}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      #{lockerNum}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          obj.estado === "pending"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}
                      >
                        {obj.estado === "pending" ? "Pendiente" : "Recogido"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {obj.notas ?? "—"}
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
