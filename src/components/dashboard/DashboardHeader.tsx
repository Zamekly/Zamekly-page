"use client";

import { usePathname } from "next/navigation";

const SECTION_NAMES: Record<string, string> = {
  "/dashboard": "Vista general",
  "/dashboard/bloques": "Bloques",
  "/dashboard/taquillas": "Taquillas",
  "/dashboard/alertas": "Alertas",
  "/dashboard/objetos-perdidos": "Objetos perdidos",
  "/dashboard/ingresos": "Ingresos",
  "/dashboard/usuarios": "Usuarios",
  "/dashboard/configuracion": "Configuración",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const title = SECTION_NAMES[pathname] ?? "Dashboard";

  return (
    <header className="flex h-16 items-center border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-[#0F172A]">
      <h1 className="text-lg font-semibold text-brand-navy dark:text-white">
        {title}
      </h1>
    </header>
  );
}
