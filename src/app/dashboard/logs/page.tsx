"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { usePermisos } from "@/components/dashboard/PermisosProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoLog =
  | "apertura"
  | "cierre"
  | "pago"
  | "objeto_detectado"
  | "estado_cambiado"
  | "alerta_generada"
  | "alerta_resuelta"
  | "mantenimiento";

type LogRow = {
  id: string;
  bloque_id: string;
  taquilla_id: string | null;
  tipo: TipoLog;
  descripcion: string;
  created_at: string;
  bloques?: { nombre: string } | null;
  taquillas?: { numero: number } | null;
};

type BloqueOption = { id: string; nombre: string };

// ─── Config visual por tipo ───────────────────────────────────────────────────

const TIPO_CONFIG: Record<TipoLog, { label: string; color: string }> = {
  apertura:        { label: "Apertura",         color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  cierre:          { label: "Cierre",            color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  pago:            { label: "Pago",              color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  objeto_detectado:{ label: "Objeto detectado",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  estado_cambiado: { label: "Estado cambiado",   color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
  alerta_generada: { label: "Alerta generada",   color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
  alerta_resuelta: { label: "Alerta resuelta",   color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" },
  mantenimiento:   { label: "Mantenimiento",     color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300" },
};

const TIPOS_TODOS: TipoLog[] = Object.keys(TIPO_CONFIG) as TipoLog[];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LogsPage() {
  const { permisos } = usePermisos();

  // Guardia de acceso
  if (!permisos.ver_bloques) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">
          No tienes permiso para ver esta sección.
        </p>
      </div>
    );
  }

  return <LogsContent />;
}

// ─── Contenido ────────────────────────────────────────────────────────────────

function LogsContent() {
  const [logs, setLogs]       = useState<LogRow[]>([]);
  const [bloques, setBloques] = useState<BloqueOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Filtros
  const [filtroBloqueId, setFiltroBloqueId] = useState("");
  const [filtroTipo, setFiltroTipo]         = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("logs")
      .select("*, bloques(nombre), taquillas(numero)")
      .order("created_at", { ascending: false })
      .limit(300);

    if (filtroBloqueId) query = query.eq("bloque_id", filtroBloqueId);
    if (filtroTipo)     query = query.eq("tipo", filtroTipo);

    const { data, error: err } = await query;

    if (err) {
      setError(err.message);
    } else {
      setLogs((data ?? []) as LogRow[]);
    }
    setLoading(false);
  }, [filtroBloqueId, filtroTipo]);

  // Cargar bloques para el selector
  useEffect(() => {
    supabase
      .from("bloques")
      .select("id, nombre")
      .order("nombre")
      .then(({ data }) => setBloques((data ?? []) as BloqueOption[]));
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  return (
    <div className="max-w-5xl space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filtroBloqueId}
          onChange={(e) => setFiltroBloqueId(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-[#1E293B] dark:text-white"
        >
          <option value="">Todos los bloques</option>
          {bloques.map((b) => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-[#1E293B] dark:text-white"
        >
          <option value="">Todos los tipos</option>
          {TIPOS_TODOS.map((t) => (
            <option key={t} value={t}>{TIPO_CONFIG[t].label}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#1E293B] dark:border-slate-700">
        <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4">
          <h2 className="text-sm font-semibold text-brand-navy dark:text-white">
            {loading ? "Cargando…" : `${logs.length} entradas`}
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && logs.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-slate-500">
              No hay logs registrados todavía.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Fecha", "Bloque", "Taquilla", "Tipo", "Descripción"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const cfg = TIPO_CONFIG[log.tipo] ?? {
                    label: log.tipo,
                    color: "bg-slate-100 text-slate-600",
                  };
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-50 last:border-0 dark:border-slate-700/50"
                    >
                      {/* Fecha */}
                      <td className="px-6 py-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("es-ES", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      {/* Bloque */}
                      <td className="px-6 py-3 font-medium text-brand-navy dark:text-white whitespace-nowrap">
                        {log.bloques?.nombre ?? "—"}
                      </td>

                      {/* Taquilla */}
                      <td className="px-6 py-3 text-gray-500 dark:text-slate-400">
                        {log.taquillas?.numero != null
                          ? `#${String(log.taquillas.numero).padStart(2, "0")}`
                          : "—"}
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-3">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Descripción */}
                      <td className="px-6 py-3 text-gray-600 dark:text-slate-400 max-w-xs">
                        {log.descripcion}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
