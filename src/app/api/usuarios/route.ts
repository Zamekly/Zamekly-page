import { createSupabaseAdmin } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "your-service-role-key-here") {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY no configurada" },
      { status: 500 }
    );
  }

  const admin = createSupabaseAdmin();

  // Obtener usuarios de Auth + perfiles con roles en paralelo
  const [authRes, perfilesRes] = await Promise.all([
    admin.auth.admin.listUsers(),
    admin.from("perfiles").select("user_id, rol_id, roles(id, nombre, es_propietario)"),
  ]);

  if (authRes.error) {
    return NextResponse.json({ error: authRes.error.message }, { status: 500 });
  }

  // Mapa user_id → perfil
  type PerfilRow = {
    user_id: string;
    rol_id: string | null;
    roles: { id: string; nombre: string; es_propietario: boolean } | null;
  };
  const perfilMap = new Map<string, PerfilRow>(
    (perfilesRes.data ?? []).map((p) => [p.user_id, p as PerfilRow])
  );

  const users = authRes.data.users.map((u) => {
    const perfil = perfilMap.get(u.id);
    const rol = perfil?.roles ?? null;

    return {
      id: u.id,
      email: u.email ?? "",
      nombre:
        (u.user_metadata?.nombre as string | undefined) ||
        (u.user_metadata?.full_name as string | undefined) ||
        (u.email?.split("@")[0] ?? "—"),
      rol_id: perfil?.rol_id ?? null,
      rol_nombre: rol?.nombre ?? null,
      rol_es_propietario: rol?.es_propietario ?? false,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    };
  });

  return NextResponse.json({ users });
}
