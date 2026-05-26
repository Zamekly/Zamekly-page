"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Block, Locker, LockerStatus } from "@/lib/mock-data";

// ─── Status config ────────────────────────────────────────────────────────────

const LOCKER_COLOR: Record<string, string> = {
  available:   "#22c55e",
  occupied:    "#3b82f6",
  maintenance: "#f97316",
  broken:      "#ef4444",
  lost_object: "#eab308",
};

const LOCKER_LABEL: Record<string, string> = {
  available:   "Disponible",
  occupied:    "Ocupada",
  maintenance: "Mantenimiento",
  broken:      "Averiada",
  lost_object: "Objeto olvidado",
};

const BLOCK_STATUS_STYLE: Record<string, string> = {
  operational: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  offline:     "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const BLOCK_STATUS_LABEL: Record<string, string> = {
  operational: "Operativo",
  maintenance: "Mantenimiento",
  offline:     "Offline",
};

const MANUAL_STATUSES: { value: LockerStatus; label: string }[] = [
  { value: "available",   label: "Disponible" },
  { value: "maintenance", label: "En mantenimiento" },
  { value: "broken",      label: "Averiada" },
];

// ─── GaugeBar ─────────────────────────────────────────────────────────────────

function GaugeBar({ value, warn = 30 }: { value: number; warn?: number }) {
  const color =
    value < warn ? "bg-red-500" : value < 50 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-600">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Locker modal ─────────────────────────────────────────────────────────────

function LockerModal({
  locker,
  onClose,
  onUpdate,
}: {
  locker: Locker;
  onClose: () => void;
  onUpdate: (updated: Locker) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [localLocker, setLocalLocker] = useState<Locker>(locker);

  const effectiveStatus = localLocker.hasLostObject ? "lost_object" : localLocker.status;
  const color = LOCKER_COLOR[effectiveStatus];

  async function changeStatus(newStatus: LockerStatus) {
    if (newStatus === localLocker.status) return;
    setSaving(true);

    const prevLabel = LOCKER_LABEL[localLocker.status];
    const newLabel  = LOCKER_LABEL[newStatus];

    await Promise.all([
      supabase
        .from("taquillas")
        .update({ estado: newStatus })
        .eq("id", localLocker.id),
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bloque_id:   localLocker.blockId,
          taquilla_id: localLocker.id,
          tipo:        "estado_cambiado",
          descripcion: `Taquilla #${String(localLocker.number).padStart(2, "0")}: ${prevLabel} → ${newLabel}`,
        }),
      }),
    ]);

    const updated = { ...localLocker, status: newStatus };
    setLocalLocker(updated);
    onUpdate(updated);
    setSaving(false);
  }

  async function markObjectCollected() {
    setSaving(true);
    await Promise.all([
      supabase
        .from("taquillas")
        .update({ tiene_objeto_olvidado: false })
        .eq("id", localLocker.id),
      supabase
        .from("objetos_perdidos")
        .update({ estado: "collected" })
        .eq("taquilla_id", localLocker.id)
        .eq("estado", "pending"),
      supabase
        .from("alertas")
        .update({ estado: "resolved" })
        .eq("taquilla_id", localLocker.id)
        .eq("tipo", "lost_object")
        .eq("estado", "active"),
    ]);
    const updated = { ...localLocker, hasLostObject: false };
    setLocalLocker(updated);
    onUpdate(updated);
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-2xl bg-white shadow-2xl dark:bg-[#1E293B] p-6"
        style={{ width: 340 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-brand-navy dark:text-white">
              Taquilla #{String(localLocker.number).padStart(2, "0")}
            </h3>
            <span
              className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {LOCKER_LABEL[effectiveStatus]}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <span>ID taquilla</span>
            <span className="font-mono text-xs text-gray-500 dark:text-slate-500">{localLocker.id}</span>
          </div>
          {localLocker.status === "occupied" && localLocker.occupiedUntil && (
            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <span>Libre a las</span>
              <span className="font-semibold text-brand-navy dark:text-white">
                {new Date(localLocker.occupiedUntil).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {localLocker.hasLostObject && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
              ⚠️ Objeto olvidado detectado en esta taquilla
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-100 dark:border-slate-700" />

        {/* Actions */}
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Cambiar estado
            </label>
            <select
              value={localLocker.status === "occupied" ? "" : localLocker.status}
              onChange={(e) => changeStatus(e.target.value as LockerStatus)}
              disabled={saving || localLocker.status === "occupied"}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white disabled:opacity-50"
            >
              {localLocker.status === "occupied" && (
                <option value="" disabled>Ocupada (solo desde taquilla física)</option>
              )}
              {MANUAL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => changeStatus("maintenance")}
            disabled={saving || localLocker.status === "maintenance"}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100 disabled:opacity-40 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
              <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Bloquear taquilla
          </button>

          {localLocker.hasLostObject && (
            <button
              onClick={markObjectCollected}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-40 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0">
                <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Marcar objeto recogido
            </button>
          )}

          {saving && (
            <p className="text-center text-xs text-gray-400 dark:text-slate-500">Guardando…</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BloqueDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [block, setBlock] = useState<Block | null>(null);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  useEffect(() => {
    async function load() {
      const [bloqueRes, taquillasRes] = await Promise.all([
        supabase.from("bloques").select("*").eq("id", id).single(),
        supabase.from("taquillas").select("*").eq("bloque_id", id).order("numero"),
      ]);

      if (!bloqueRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const b = bloqueRes.data;
      setBlock({
        id: b.id,
        name: b.nombre,
        location: b.ubicacion,
        lockerCount: b.num_taquillas,
        status: b.estado,
        batteryLevel: b.bateria_solar,
        waterLevel: b.nivel_agua,
        airPressure: b.presion_aire,
        installedAt: b.fecha_instalacion ?? "",
        lastRevision: b.ultima_revision ?? "",
      });

      setLockers(
        (taquillasRes.data ?? []).map((t) => ({
          id: t.id,
          blockId: t.bloque_id,
          number: t.numero,
          status: t.estado,
          occupiedUntil: t.libre_a_las ?? undefined,
          hasLostObject: t.tiene_objeto_olvidado ?? false,
        }))
      );

      setLoading(false);
    }
    load();
  }, [id]);

  function handleLockerUpdate(updated: Locker) {
    setLockers((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setSelectedLocker(updated);
  }

  // SVG layout
  const COLS = 4;
  const ROWS = Math.ceil(lockers.length / COLS);
  const CW = 82, CH = 104, GAP = 12, PAD = 20;
  const SVG_W = PAD + COLS * CW + (COLS - 1) * GAP + PAD;
  const SVG_H = PAD + ROWS * CH + (ROWS - 1) * GAP + PAD;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (notFound || !block) {
    return (
      <div className="space-y-5">
        <Link
          href="/dashboard/bloques"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
            <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver a bloques
        </Link>
        <p className="text-sm text-gray-500 dark:text-slate-400">Bloque no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        href="/dashboard/bloques"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a bloques
      </Link>

      {/* Block stats */}
      <div className="rounded-2xl bg-white border border-gray-200 dark:bg-[#1E293B] dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-brand-navy dark:text-white">{block.name}</h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{block.location}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 ${BLOCK_STATUS_STYLE[block.status]}`}>
            {BLOCK_STATUS_LABEL[block.status]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          {[
            { label: "Batería solar", value: block.batteryLevel, warn: 30 },
            { label: "Nivel de agua", value: block.waterLevel, warn: 25 },
            { label: "Presión de aire", value: block.airPressure, warn: 20 },
          ].map(({ label, value, warn }) => (
            <div key={label}>
              <p className="mb-1 text-gray-500 dark:text-slate-400">{label}</p>
              <p className={`mb-1.5 text-lg font-bold ${value < warn ? "text-red-500" : "text-brand-navy dark:text-white"}`}>
                {value}%
              </p>
              <GaugeBar value={value} warn={warn} />
            </div>
          ))}
        </div>
      </div>

      {/* SVG locker map */}
      <div className="rounded-2xl bg-white border border-gray-200 dark:bg-[#1E293B] dark:border-slate-700 p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-brand-navy dark:text-white">
            {lockers.length} taquillas · haz clic para ver detalles
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {Object.entries(LOCKER_LABEL).map(([key, label]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                <span className="h-2.5 w-2.5 rounded-sm inline-block shrink-0" style={{ backgroundColor: LOCKER_COLOR[key] }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width={SVG_W}
            height={SVG_H}
            className="block mx-auto"
            style={{ maxWidth: "100%" }}
          >
            {lockers.map((locker, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              const x = PAD + col * (CW + GAP);
              const y = PAD + row * (CH + GAP);
              const effectiveStatus = locker.hasLostObject ? "lost_object" : locker.status;
              const color = LOCKER_COLOR[effectiveStatus];

              return (
                <g key={locker.id} onClick={() => setSelectedLocker(locker)} style={{ cursor: "pointer" }}>
                  <rect x={x} y={y} width={CW} height={CH} rx="8" fill={color + "20"} stroke={color} strokeWidth="2" />
                  <rect x={x + 2} y={y + 2} width={CW - 4} height={7} rx="4" fill={color} opacity="0.65" />
                  <text
                    x={x + CW / 2} y={y + 45}
                    textAnchor="middle" fontSize="22" fontWeight="700"
                    fill={color} fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {String(locker.number).padStart(2, "0")}
                  </text>
                  <rect x={x + CW / 2 - 5} y={y + 62} width={10} height={22} rx="5" fill={color} opacity="0.4" />
                  {locker.hasLostObject && (
                    <circle cx={x + CW - 11} cy={y + 11} r="7" fill="#eab308" stroke="white" strokeWidth="2" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {selectedLocker && (
        <LockerModal
          locker={selectedLocker}
          onClose={() => setSelectedLocker(null)}
          onUpdate={handleLockerUpdate}
        />
      )}
    </div>
  );
}
