"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/mock-data";

export default function ConfiguracionPage() {
  const [company, setCompany] = useState(CONFIG.companyName);
  const [email, setEmail] = useState(CONFIG.contactEmail);
  const [battery, setBattery] = useState(CONFIG.batteryAlertThreshold);
  const [water, setWater] = useState(CONFIG.waterAlertThreshold);
  const [air, setAir] = useState(CONFIG.airAlertThreshold);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In production: save to Supabase
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function ThresholdSlider({
    label,
    value,
    onChange,
    description,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    description: string;
  }) {
    const color = value < 20 ? "text-red-500" : value < 40 ? "text-amber-500" : "text-emerald-600";
    return (
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-brand-navy dark:text-white">
            {label}
          </label>
          <span className={`text-sm font-bold ${color}`}>{value}%</span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 h-1.5 w-full cursor-pointer accent-brand-navy"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        {/* General settings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
          <h2 className="mb-5 text-sm font-semibold text-brand-navy dark:text-white">
            Datos generales
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium text-brand-navy dark:text-white"
              >
                Nombre de la empresa
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-navy dark:text-white"
              >
                Email de contacto
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Alert thresholds */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
          <h2 className="mb-5 text-sm font-semibold text-brand-navy dark:text-white">
            Umbrales de alerta
          </h2>
          <p className="mb-6 text-xs text-slate-500 dark:text-slate-400">
            Se dispara una alerta cuando el nivel cae por debajo del umbral configurado.
          </p>
          <div className="space-y-7">
            <ThresholdSlider
              label="Batería solar"
              value={battery}
              onChange={setBattery}
              description={`Alerta cuando la batería baja del ${battery}%`}
            />
            <ThresholdSlider
              label="Nivel de agua"
              value={water}
              onChange={setWater}
              description={`Alerta cuando el depósito baja del ${water}%`}
            />
            <ThresholdSlider
              label="Presión de aire"
              value={air}
              onChange={setAir}
              description={`Alerta cuando la presión baja del ${air}%`}
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-brand-navy px-8 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-soft"
          >
            Guardar cambios
          </button>
          {saved && (
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Guardado correctamente
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
