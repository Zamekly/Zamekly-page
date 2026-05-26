"use client";

import { useState, useEffect, useCallback } from "react";
import { usePermisos } from "@/components/dashboard/PermisosProvider";
import { DEFAULT_PERMISOS, PERMISOS_META, type Permisos, type Rol } from "@/lib/permisos";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? "bg-brand-navy" : "bg-gray-200 dark:bg-slate-600"
      }`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RolesPage() {
  const { permisos, esPropietario } = usePermisos();

  // Guardia de acceso
  if (!permisos.gestionar_roles) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-gray-400 dark:text-slate-500">No tienes permiso para ver esta sección.</p>
      </div>
    );
  }

  return <RolesContent esPropietario={esPropietario} />;
}

// ─── Contenido (separado para que el guard no rompa hooks) ────────────────────

function RolesContent({ esPropietario }: { esPropietario: boolean }) {
  // ── Data ──
  const [roles, setRoles]   = useState<Rol[]>([]);
  const [userCount, setUserCount] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  // ── Crear rol ──
  const [showCreate, setShowCreate] = useState(false);
  const [newNombre, setNewNombre]   = useState("");
  const [newPermisos, setNewPermisos] = useState<Permisos>({ ...DEFAULT_PERMISOS });
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // ── Eliminar rol ──
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ─── Carga ──────────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [rolesRes, usersRes] = await Promise.all([
      fetch("/api/roles"),
      fetch("/api/usuarios"),
    ]);

    if (!rolesRes.ok) {
      const body = await rolesRes.json().catch(() => ({}));
      setError(body.error ?? "Error al cargar los roles.");
      setLoading(false);
      return;
    }

    const { roles: rolesData } = await rolesRes.json();
    setRoles((rolesData ?? []).filter((r: Rol) => !r.es_propietario));

    // Contar usuarios por rol para saber cuáles tienen asignaciones
    if (usersRes.ok) {
      const { users } = await usersRes.json();
      const counts: Record<string, number> = {};
      for (const u of users ?? []) {
        if (u.rol_id) counts[u.rol_id] = (counts[u.rol_id] ?? 0) + 1;
      }
      setUserCount(counts);
    }

    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ─── Crear rol ───────────────────────────────────────────────────────────

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);

    if (!newNombre.trim()) {
      setCreateError("El nombre del rol es obligatorio.");
      return;
    }

    setCreating(true);
    const res = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: newNombre.trim(), permisos: newPermisos }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setCreateError(body.error ?? "Error al crear el rol.");
      setCreating(false);
      return;
    }

    setNewNombre("");
    setNewPermisos({ ...DEFAULT_PERMISOS });
    setShowCreate(false);
    setCreating(false);
    await loadAll();
  }

  // ─── Eliminar rol ────────────────────────────────────────────────────────

  async function handleDelete(rol: Rol) {
    setDeleteError(null);
    if (!confirm(`¿Eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`)) return;

    setDeletingId(rol.id);
    const res = await fetch(`/api/roles/${rol.id}`, { method: "DELETE" });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteError(body.error ?? "Error al eliminar el rol.");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    await loadAll();
  }

  // ─── Render ──────────────────────────────────────────────────────────────

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
    <div className="max-w-3xl space-y-5">

      {/* ── Crear nuevo rol ──────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#1E293B] dark:border-slate-700">
        <button
          onClick={() => { setShowCreate((v) => !v); setCreateError(null); }}
          className="flex w-full items-center justify-between px-6 py-4"
        >
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-brand-navy dark:text-white" aria-hidden>
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-semibold text-brand-navy dark:text-white">Crear nuevo rol</span>
          </div>
          <svg viewBox="0 0 20 20" fill="none" className={`h-4 w-4 text-gray-400 transition-transform ${showCreate ? "rotate-180" : ""}`}>
            <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showCreate && (
          <div className="border-t border-gray-100 dark:border-slate-700 px-6 py-5">
            <form onSubmit={handleCreate} className="space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                  Nombre del rol
                </label>
                <input
                  type="text"
                  required
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  placeholder="Ej: Supervisor, Técnico…"
                  className="block w-full max-w-xs rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Permisos */}
              <div>
                <p className="mb-3 text-xs font-medium text-gray-600 dark:text-slate-400">Permisos</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {PERMISOS_META.map(({ key, label, descripcion, soloPropietario }) => {
                    const disabled = !!(soloPropietario && !esPropietario);
                    return (
                      <label
                        key={key}
                        className={`flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3 dark:border-slate-700 ${
                          disabled ? "opacity-50" : "cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/30"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-brand-navy dark:text-white">{label}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{descripcion}</p>
                          {soloPropietario && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Solo Propietario</p>
                          )}
                        </div>
                        <Toggle
                          checked={newPermisos[key]}
                          onChange={(v) => setNewPermisos((p) => ({ ...p, [key]: v }))}
                          disabled={disabled}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {createError && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {createError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-brand-navy px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                >
                  {creating ? "Creando…" : "Crear rol"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setCreateError(null); }}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Roles existentes ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm dark:bg-[#1E293B] dark:border-slate-700">
        <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4">
          <h2 className="text-sm font-semibold text-brand-navy dark:text-white">Roles existentes</h2>
        </div>

        {deleteError && (
          <div className="mx-6 mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {deleteError}
          </div>
        )}

        {roles.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-400 dark:text-slate-500">No hay roles creados todavía.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-slate-700/50 px-6 py-2">
            {roles.map((rol) => {
              const count = userCount[rol.id] ?? 0;
              const canDelete = count === 0;
              const activePerms = PERMISOS_META.filter(({ key }) => rol.permisos[key]);

              return (
                <li key={rol.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Nombre + usuarios */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-brand-navy dark:text-white">
                        {rol.nombre}
                      </span>
                      <span className={`text-xs font-medium ${
                        count > 0 ? "text-brand-navy dark:text-slate-300" : "text-gray-400 dark:text-slate-500"
                      }`}>
                        {count === 0 ? "Sin usuarios" : `${count} usuario${count !== 1 ? "s" : ""}`}
                      </span>
                    </div>

                    {/* Badges de permisos activos */}
                    {activePerms.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {activePerms.map(({ key, label }) => (
                          <span
                            key={key}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs italic text-gray-400 dark:text-slate-500">Sin permisos activados</p>
                    )}
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleDelete(rol)}
                    disabled={!canDelete || deletingId === rol.id}
                    title={
                      !canDelete
                        ? `No se puede eliminar: ${count} usuario${count !== 1 ? "s" : ""} tiene${count !== 1 ? "n" : ""} este rol asignado`
                        : "Eliminar rol"
                    }
                    className="shrink-0 inline-flex h-8 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                  >
                    {deletingId === rol.id ? (
                      "Eliminando…"
                    ) : (
                      <>
                        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
                          <path d="M2 4h12M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {!canDelete ? `${count} usuario${count !== 1 ? "s" : ""}` : "Eliminar"}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
