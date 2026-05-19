"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Block, Locker } from "@/lib/mock-data";

// ─── Status config ────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BloquesPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const [bloquesRes, taquillasRes] = await Promise.all([
        supabase.from("bloques").select("*").order("nombre"),
        supabase.from("taquillas").select("bloque_id, estado"),
      ]);

      setBlocks(
        (bloquesRes.data ?? []).map((b) => ({
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
        }))
      );

      setLockers(
        (taquillasRes.data ?? []).map((t) => ({
          id: "",
          blockId: t.bloque_id,
          number: 0,
          status: t.estado,
          hasLostObject: false,
        }))
      );

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
            <Link
              key={block.id}
              href={`/dashboard/bloques/${block.id}`}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
