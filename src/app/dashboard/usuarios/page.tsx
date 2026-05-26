"use client";

import { useState, useEffect, useCallback } from "react";
import { usePermisos } from "@/components/dashboard/PermisosProvider";
import type { Rol } from "@/lib/permisos";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthUser = {
  id: string;
  email: string;
  nombre: string;
  rol_id: string | null;
  rol_nombre: string | null;
  rol_es_propietario: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsuariosPage() {
  const { permisos } = usePermisos();
  const puedeGestionar = permisos.gestionar_roles;

  // ── Data ──
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── UI ──
  const [showEmails, setShowEmails] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  // ─── Carga ────────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const fetches: Promise<Response>[] = [fetch("/api/usuarios")];
    if (puedeGestionar) fetches.push(fetch("/api/roles"));

    const [usersRes, rolesRes] = await Promise.all(fetches);

    if (!usersRes.ok) {
      const body = await usersRes.json().catch(() => ({}));
      setError(body.error ?? "Error al cargar los usuarios.");
      setLoading(false);
      return;
    }

    const { users: usersData } = await usersRes.json();
    setUsers(usersData ?? []);

    if (rolesRes) {
      const { roles: rolesData } = await rolesRes.json();
      setRoles((rolesData ?? []).filter((r: Rol) => !r.es_propietario));
    }

    setLoading(false);
  }, [puedeGestionar]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ─── Asignar rol ──────────────────────────────────────────────────────────

  async function assignRole(userId: string, rolId: string | null) {
    setAssigningId(userId);
    setAssignError(null);

    const res = await fetch(`/api/usuarios/${userId}/rol`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rol_id: rolId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setAssignError(body.error ?? "Error al asignar el rol.");
      setAssigningId(null);
      return;
    }

    await loadAll();
    setAssigningId(null);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-4">

      {/* Error de asignación */}
      {assignError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
          {assignError}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#1E293B] dark:border-slate-700">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-brand-navy dark:text-white">
            {users.length} usuario{users.length !== 1 ? "s" : ""}
          </p>
          {users.length > 0 && permisos.ver_emails_usuarios && (
            <button
              onClick={() => setShowEmails((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-navy dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
                {showEmails ? (
                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z M10 10m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M3 3l14 14M10 4c2.5 0 4.7 1.2 6.3 2.8M2 10s.8-1.5 2-2.8M17.3 7.5C18 8.5 18 10 18 10s-3 6-8 6c-1.2 0-2.3-.3-3.3-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
              {showEmails ? "Ocultar emails" : "Mostrar emails"}
            </button>
          )}
        </div>

        {/* Empty */}
        {users.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-slate-500">No hay usuarios configurados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Nombre", "Email", "Rol", "Último acceso", "Alta"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 last:border-0 dark:border-slate-700/50">

                    {/* Nombre */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                          {user.nombre.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                        <span className="font-medium text-brand-navy dark:text-white">{user.nombre}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {permisos.ver_emails_usuarios
                        ? showEmails ? user.email : "••••••••••"
                        : "—"}
                    </td>

                    {/* Rol */}
                    <td className="px-6 py-4">
                      {puedeGestionar && !user.rol_es_propietario ? (
                        <select
                          value={user.rol_id ?? ""}
                          disabled={assigningId === user.id}
                          onChange={(e) => assignRole(user.id, e.target.value || null)}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-brand-navy focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white disabled:opacity-50"
                        >
                          <option value="">Sin rol</option>
                          {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.nombre}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.rol_es_propietario
                            ? "bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/30 dark:text-blue-300"
                            : user.rol_nombre
                            ? "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                        }`}>
                          {user.rol_es_propietario ? "Propietario" : user.rol_nombre ?? "Sin rol"}
                        </span>
                      )}
                    </td>

                    {/* Último acceso */}
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
                        : "—"}
                    </td>

                    {/* Alta */}
                    <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
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
