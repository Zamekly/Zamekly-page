"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Block, Locker } from "@/lib/mock-data";

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

function LockerModal({ locker, onClose }: { locker: Locker; onClose: () => void }) {
  const effectiveStatus = locker.hasLostObject ? "lost_object" : locker.status;
  const color = LOCKER_COLOR[effectiveStatus];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-80 rounded-2xl bg-white shadow-2xl dark:bg-[#1E293B] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-brand-navy dark:text-white">
              Taquilla #{String(locker.number).padStart(2, "0")}
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

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-slate-400">
            <span>ID taquilla</span>
            <span className="font-mono text-xs text-gray-500 dark:text-slate-500">{locker.id}</span>
          </div>
          {locker.status === "occupied" && locker.occupiedUntil && (
            <div className="flex justify-between text-gray-600 dark:text-slate-400">
              <span>Libre a las</span>
              <span className="font-semibold text-brand-navy dark:text-white">
                {new Date(locker.occupiedUntil).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          {locker.hasLostObject && (
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
              ⚠️ Objeto olvidado detectado en esta taquilla
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Block detail view ────────────────────────────────────────────────────────

function BlockDetail({
  block,
  lockers,
  onBack,
}: {
  block: Block;
  lockers: Locker[];
  onBack: () => void;
}) {
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  const COLS = 4;
  const ROWS = Math.ceil(lockers.length / COLS);
  const CW = 82;
  const CH = 104;
  const GAP = 12;
  const PAD = 20;
  const SVG_W = PAD + COLS * CW + (COLS - 1) * GAP + PAD;
  const SVG_H = PAD + ROWS * CH + (ROWS - 1) * GAP + PAD;

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
          <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Volver a bloques
      </button>

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
                    x={x + CW / 2}
                    y={y + 45}
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="700"
                    fill={color}
                    fontFamily="system-ui, -apple-system, sans-serif"
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
        <LockerModal locker={selectedLocker} onClose={() => setSelectedLocker(null)} />
      )}
    </div>
  );
}

// ─── Block list ───────────────────────────────────────────────────────────────

export default function BloquesPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    async function load() {
      const [bloquesRes, taquillasRes] = await Promise.all([
        supabase.from("bloques").select("*").order("nombre"),
        supabase.from("taquillas").select("*").order("numero"),
      ]);

      const mappedBlocks: Block[] = (bloquesRes.data ?? []).map((b) => ({
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
      }));

      const mappedLockers: Locker[] = (taquillasRes.data ?? []).map((t) => ({
        id: t.id,
        blockId: t.bloque_id,
        number: t.numero,
        status: t.estado,
        occupiedUntil: t.libre_a_las ?? undefined,
        hasLostObject: t.tiene_objeto_olvidado ?? false,
      }));

      setBlocks(mappedBlocks);
      setLockers(mappedLockers);
      setLoading(false);
    }
    load();
  }, []);

  const cities = Array.from(
    new Set(blocks.map((b) => b.location.split(",").pop()?.trim() ?? ""))
  );

  const filtered =
    cityFilter === "all"
      ? blocks
      : blocks.filter((b) => b.location.includes(cityFilter));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (selectedBlock) {
    const blockLockers = lockers.filter((l) => l.blockId === selectedBlock.id);
    return (
      <BlockDetail
        block={selectedBlock}
        lockers={blockLockers}
        onBack={() => setSelectedBlock(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* City filter */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setCityFilter("all")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            cityFilter === "all"
              ? "bg-brand-navy text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          }`}
        >
          Todas
        </button>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setCityFilter(city)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cityFilter === city
                ? "bg-brand-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Block cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((block) => {
          const blockLockers = lockers.filter((l) => l.blockId === block.id);
          const occupied = blockLockers.filter((l) => l.status === "occupied").length;

          return (
            <button
              key={block.id}
              onClick={() => setSelectedBlock(block)}
              className="group text-left rounded-2xl bg-white border border-gray-200 dark:bg-[#1E293B] dark:border-slate-700 p-5 shadow-sm hover:border-brand-navy dark:hover:border-brand-blue transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-brand-navy dark:text-white group-hover:underline underline-offset-2">
                    {block.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{block.location}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ml-3 ${BLOCK_STATUS_STYLE[block.status]}`}>
                  {BLOCK_STATUS_LABEL[block.status]}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
                <span className="font-semibold text-brand-navy dark:text-white">{occupied}</span>
                {" "}/ {block.lockerCount} taquillas ocupadas
              </p>

              <div className="space-y-2.5">
                {[
                  { label: "Batería", value: block.batteryLevel, warn: 30 },
                  { label: "Agua", value: block.waterLevel, warn: 25 },
                  { label: "Presión aire", value: block.airPressure, warn: 20 },
                ].map(({ label, value, warn }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                    <span className="w-20 shrink-0">{label}</span>
                    <div className="flex-1"><GaugeBar value={value} warn={warn} /></div>
                    <span className={`w-9 text-right font-medium shrink-0 ${value < warn ? "text-red-500" : "text-gray-700 dark:text-slate-300"}`}>
                      {value}%
                    </span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
