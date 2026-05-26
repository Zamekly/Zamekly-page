"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { usePermisos } from "./PermisosProvider";

// ─── Types ────────────────────────────────────────────────────────────────────

type Prioridad = "critical" | "high" | "medium" | "low";

type PopupAlerta = {
  uid: string; // clave única para la cola (id de alerta + timestamp)
  descripcion: string;
  prioridad: Prioridad;
  bloque_nombre: string;
};

// ─── Configuración visual por prioridad ──────────────────────────────────────

const PRIORIDAD_CONFIG: Record<
  Prioridad,
  { bar: string; icon: string; label: string }
> = {
  critical: {
    bar: "bg-red-500",
    icon: "text-red-500",
    label: "Crítica",
  },
  high: {
    bar: "bg-orange-500",
    icon: "text-orange-500",
    label: "Alta",
  },
  medium: {
    bar: "bg-amber-400",
    icon: "text-amber-400",
    label: "Media",
  },
  low: {
    bar: "bg-slate-400",
    icon: "text-slate-400",
    label: "Baja",
  },
};

// ─── Icono de prioridad ───────────────────────────────────────────────────────

function PrioridadIcon({ prioridad }: { prioridad: Prioridad }) {
  const { icon } = PRIORIDAD_CONFIG[prioridad];
  return (
    <svg viewBox="0 0 20 20" fill="none" className={`h-5 w-5 shrink-0 ${icon}`} aria-hidden>
      <path
        d="M10 3L18 17H2L10 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 8v4M10 14.5v.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Tarjeta individual de popup ─────────────────────────────────────────────

function AlertaCard({
  alerta,
  onClose,
}: {
  alerta: PopupAlerta;
  onClose: () => void;
}) {
  const { bar, label } = PRIORIDAD_CONFIG[alerta.prioridad];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-[#1E293B] dark:ring-white/10 w-80 animate-in slide-in-from-right-4 fade-in duration-300">
      {/* Barra de color por prioridad */}
      <div className={`absolute left-0 top-0 h-full w-1 ${bar}`} />

      <div className="pl-4 pr-4 py-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <PrioridadIcon prioridad={alerta.prioridad} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Alerta {label}
              </p>
              <p className="text-sm font-semibold text-brand-navy dark:text-white truncate">
                {alerta.bloque_nombre}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Descripción */}
        <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed pl-7">
          {alerta.descripcion}
        </p>
      </div>
    </div>
  );
}

// ─── AlertaPopup (orquestador) ────────────────────────────────────────────────

export default function AlertaPopup() {
  const { permisos } = usePermisos();
  const [alerts, setAlerts] = useState<PopupAlerta[]>([]);

  const dismiss = useCallback((uid: string) => {
    setAlerts((prev) => prev.filter((a) => a.uid !== uid));
  }, []);

  useEffect(() => {
    if (!permisos.ver_alertas) return;

    const channel = supabase
      .channel("alertas-popup-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alertas" },
        async (payload) => {
          const row = payload.new as {
            id: string;
            descripcion: string;
            prioridad: Prioridad;
            bloque_id: string;
          };

          // Obtener nombre del bloque
          const { data: bloque } = await supabase
            .from("bloques")
            .select("nombre")
            .eq("id", row.bloque_id)
            .single();

          const uid = `${row.id}-${Date.now()}`;
          const alerta: PopupAlerta = {
            uid,
            descripcion: row.descripcion ?? "",
            prioridad: row.prioridad ?? "low",
            bloque_nombre: bloque?.nombre ?? "Bloque desconocido",
          };

          setAlerts((prev) => [...prev, alerta]);

          // Auto-dismiss a los 8 segundos
          setTimeout(() => dismiss(uid), 8_000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [permisos.ver_alertas, dismiss]);

  if (!permisos.ver_alertas || alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {alerts.map((alerta) => (
        <AlertaCard
          key={alerta.uid}
          alerta={alerta}
          onClose={() => dismiss(alerta.uid)}
        />
      ))}
    </div>
  );
}
