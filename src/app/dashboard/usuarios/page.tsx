"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type PerfilRow = {
  id: string;
  email: string;
  nombre: string;
  rol: "admin" | "operator";
  created_at: string;
  ultimo_acceso: string | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
  const [users, setUsers] = useState<PerfilRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmails, setShowEmails] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("perfiles")
        .select("*")
        .order("created_at");
      setUsers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#1E293B] dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-brand-navy dark:text-white">
            {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
          {users.length > 0 && (
            <button
              onClick={() => setShowEmails((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                {showEmails ? (
                  <path
                    d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z M10 10m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M3 3l14 14M10 4c2.5 0 4.7 1.2 6.3 2.8M2 10s.8-1.5 2-2.8M17.3 7.5C18 8.5 18 10 18 10s-3 6-8 6c-1.2 0-2.3-.3-3.3-.7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>
              {showEmails ? "Ocultar emails" : "Mostrar emails"}
            </button>
          )}
        </div>

        {/* Empty state */}
        {users.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-slate-500">
              No hay usuarios configurados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Nombre", "Email", "Rol", "Último acceso", "Alta"].map((h) => (
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 dark:border-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                          {user.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                        <span className="font-medium text-brand-navy dark:text-white">
                          {user.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {showEmails ? user.email : "••••••••••"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.rol === "admin"
                            ? "bg-brand-navy/10 text-brand-navy dark:bg-brand-blue/20 dark:text-brand-blue"
                            : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {user.rol === "admin" ? "Admin" : "Operador"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {user.ultimo_acceso
                        ? new Date(user.ultimo_acceso).toLocaleString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
