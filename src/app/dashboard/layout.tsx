import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MfaBanner from "@/components/dashboard/MfaBanner";
import PendienteScreen from "@/components/dashboard/PendienteScreen";
import { PermisosProvider } from "@/components/dashboard/PermisosProvider";
import { createSupabaseServer } from "@/lib/supabase-server";
import { DEFAULT_PERMISOS, type Permisos } from "@/lib/permisos";

export const metadata = {
  title: "Dashboard | Zamekly",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // ── Leer permisos del usuario desde el servidor ──────────────────────────
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  let permisos: Permisos = DEFAULT_PERMISOS;
  let esPropietario = false;
  let hasRole = false;

  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol_id, roles(permisos, es_propietario)")
      .eq("user_id", user.id)
      .single();

    hasRole = !!perfil?.rol_id;

    if (hasRole && perfil?.roles) {
      const rol = perfil.roles as { permisos: Permisos; es_propietario: boolean };
      permisos = { ...DEFAULT_PERMISOS, ...rol.permisos };
      esPropietario = rol.es_propietario ?? false;
    }
  }

  // ── Sin rol → pantalla de activación pendiente ───────────────────────────
  if (!hasRole) {
    return <PendienteScreen />;
  }

  // ── Layout normal con permisos ────────────────────────────────────────────
  return (
    <ThemeProvider>
      <PermisosProvider permisos={permisos} esPropietario={esPropietario}>
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0F172A]">
          <Sidebar permisos={permisos} esPropietario={esPropietario} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <div className="flex-1 overflow-y-auto">
              <MfaBanner />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </div>
      </PermisosProvider>
    </ThemeProvider>
  );
}
