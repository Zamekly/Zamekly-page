"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import type { Permisos } from "@/lib/permisos";

// ─── Definición de nav con clave de permiso ───────────────────────────────────

type NavItem = {
  href: string;
  label: string;
  permiso?: keyof Permisos; // opcional → siempre visible si está ausente
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Vista general",
    permiso: "ver_vista_general",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/bloques",
    label: "Bloques",
    permiso: "ver_bloques",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <rect x="2" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 6V4a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="12" r="1.5" fill="currentColor" opacity=".6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/alertas",
    label: "Alertas",
    permiso: "ver_alertas",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M10 2a6 6 0 0 1 6 6c0 3.5 1.5 5 1.5 5H2.5S4 11.5 4 8a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 15a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/objetos-perdidos",
    label: "Objetos perdidos",
    permiso: "ver_objetos_perdidos",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13.5 13.5 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/ingresos",
    label: "Ingresos",
    permiso: "ver_ingresos",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M3 14l4-4 3 3 4-5 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    href: "/dashboard/logs",
    label: "Logs",
    permiso: "ver_bloques",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M4 5h12M4 9h8M4 13h10M4 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/usuarios",
    label: "Usuarios",
    permiso: "ver_usuarios",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 17c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 8a3 3 0 0 1 0 6M16 17a5 5 0 0 0-2-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/roles",
    label: "Roles",
    permiso: "gestionar_roles",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <path d="M10 2l2 4.5h4.5l-3.6 2.8 1.4 4.7L10 11.3l-4.3 2.7 1.4-4.7L3.5 6.5H8L10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/configuracion",
    label: "Configuración",
    // sin permiso → siempre visible para cualquier usuario con rol
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  permisos: Permisos;
  esPropietario: boolean;
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ permisos, esPropietario }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

  const visibleNav = NAV.filter((item) => !item.permiso || permisos[item.permiso]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured — just redirect
    }
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#1E293B]">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-5 dark:border-slate-700">
        <Link href="/" tabIndex={-1}>
          <Logo />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleNav.length === 0 ? (
          <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
            Sin secciones disponibles
          </p>
        ) : (
          <ul className="space-y-0.5">
            {visibleNav.map((item) => {
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-navy text-white dark:bg-brand-navy-soft"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Badge de rol Propietario */}
        {esPropietario && (
          <div className="mt-4 mx-3 flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 dark:bg-slate-700/60">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 text-brand-navy dark:text-slate-300" aria-hidden>
              <path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.4l-3.7 2.1.7-4.1L2 5.5l4.2-.9L8 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            <span className="text-xs font-medium text-brand-navy dark:text-slate-300">Propietario</span>
          </div>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-200 px-3 py-4 dark:border-slate-700 space-y-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white"
        >
          {theme === "dark" ? (
            <>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Modo claro
            </>
          ) : (
            <>
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                <path d="M17 11A7 7 0 0 1 9 3a7 7 0 1 0 8 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              Modo oscuro
            </>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
            <path d="M13 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2M8 14l-4-4 4-4M4 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
