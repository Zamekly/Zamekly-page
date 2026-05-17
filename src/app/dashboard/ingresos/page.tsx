"use client";

import { useState } from "react";
import { BLOCKS, getRevenueForPeriod } from "@/lib/mock-data";

type Period = "today" | "week" | "month" | "year";

const PERIOD_LABELS: Record<Period, string> = {
  today: "Hoy",
  week: "Esta semana",
  month: "Este mes",
  year: "Este año",
};

const BLOCK_COLORS = [
  "bg-brand-navy dark:bg-brand-blue",
  "bg-slate-500 dark:bg-slate-400",
  "bg-emerald-500",
  "bg-amber-400",
];

export default function IngresosPage() {
  const [period, setPeriod] = useState<Period>("month");

  const rows = getRevenueForPeriod(period);

  // Total per block
  const byBlock = BLOCKS.map((block) => {
    const total = rows
      .filter((r) => r.blockId === block.id)
      .reduce((s, r) => s + r.amount, 0);
    return { block, total };
  }).sort((a, b) => b.total - a.total);

  const grandTotal = byBlock.reduce((s, b) => s + b.total, 0);
  const maxAmount = Math.max(...byBlock.map((b) => b.total), 1);

  // Daily totals for bar chart (last 30 days for month, last 7 for week, etc.)
  const chartDays = period === "today" ? 1 : period === "week" ? 7 : period === "month" ? 30 : 12;
  const chartLabel = period === "year" ? "mes" : "día";

  const dailyTotals: { label: string; amount: number }[] = (() => {
    if (period === "year") {
      // Group by month
      const months: Record<string, number> = {};
      rows.forEach((r) => {
        const m = r.date.substring(0, 7);
        months[m] = (months[m] ?? 0) + r.amount;
      });
      return Object.entries(months)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([m, amount]) => ({
          label: new Date(m + "-01").toLocaleDateString("es-ES", { month: "short" }),
          amount,
        }));
    }
    const days: Record<string, number> = {};
    rows.forEach((r) => {
      days[r.date] = (days[r.date] ?? 0) + r.amount;
    });
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-chartDays)
      .map(([d, amount]) => ({
        label: new Date(d).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        }),
        amount,
      }));
  })();

  const chartMax = Math.max(...dailyTotals.map((d) => d.amount), 1);

  return (
    <div className="space-y-6">
      {/* Total card */}
      <div className="rounded-2xl bg-brand-navy p-6 text-white shadow-sm">
        <p className="text-sm font-medium opacity-75">Total · {PERIOD_LABELS[period]}</p>
        <p className="mt-2 text-4xl font-bold">
          {grandTotal.toLocaleString("es-ES", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          })}
        </p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              period === p
                ? "bg-brand-navy text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-[#1E293B] dark:text-slate-300 dark:ring-slate-700"
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
          <p className="mb-5 text-sm font-semibold text-brand-navy dark:text-white">
            Ingresos por {chartLabel}
          </p>
          <div className="flex items-end gap-1" style={{ height: 160 }}>
            {dailyTotals.map((d, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${d.label}: ${d.amount.toFixed(0)} €`}
              >
                <div
                  className="w-full rounded-t bg-brand-navy dark:bg-brand-blue transition-all"
                  style={{ height: `${(d.amount / chartMax) * 140}px`, minHeight: 2 }}
                />
                {dailyTotals.length <= 12 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 rotate-0">
                    {d.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* By block */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
          <p className="mb-5 text-sm font-semibold text-brand-navy dark:text-white">
            Por bloque
          </p>
          <div className="space-y-4">
            {byBlock.map(({ block, total }, i) => (
              <div key={block.id}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {block.name}
                  </span>
                  <span className="font-semibold text-brand-navy dark:text-white">
                    {total.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full transition-all ${BLOCK_COLORS[i % BLOCK_COLORS.length]}`}
                    style={{ width: `${(total / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
