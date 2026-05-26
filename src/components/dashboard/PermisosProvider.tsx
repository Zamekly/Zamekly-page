"use client";

import { createContext, useContext } from "react";
import { DEFAULT_PERMISOS, type Permisos } from "@/lib/permisos";

// ─── Contexto ─────────────────────────────────────────────────────────────────

type PermisosContextValue = {
  permisos: Permisos;
  esPropietario: boolean;
};

const PermisosContext = createContext<PermisosContextValue>({
  permisos: DEFAULT_PERMISOS,
  esPropietario: false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PermisosProvider({
  permisos,
  esPropietario,
  children,
}: {
  permisos: Permisos;
  esPropietario: boolean;
  children: React.ReactNode;
}) {
  return (
    <PermisosContext.Provider value={{ permisos, esPropietario }}>
      {children}
    </PermisosContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePermisos() {
  return useContext(PermisosContext);
}
