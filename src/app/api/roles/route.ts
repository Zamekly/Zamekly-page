import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import type { Permisos } from "@/lib/permisos";

// ─── Helpers de autorización ──────────────────────────────────────────────────

async function getCallerPermisos(): Promise<{ permisos: Permisos | null; error: string | null }> {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { permisos: null, error: "No autenticado" };

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("roles(permisos, es_propietario)")
    .eq("user_id", user.id)
    .single();

  const rol = perfil?.roles as { permisos: Permisos; es_propietario: boolean } | null;
  if (!rol) return { permisos: null, error: "Sin rol asignado" };

  return { permisos: rol.permisos, error: null };
}

// ─── GET /api/roles — Listar todos los roles ──────────────────────────────────

export async function GET() {
  const { permisos, error } = await getCallerPermisos();
  if (error) return NextResponse.json({ error }, { status: 401 });
  if (!permisos?.ver_usuarios && !permisos?.gestionar_roles) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const admin = createSupabaseAdmin();
  const { data, error: dbError } = await admin
    .from("roles")
    .select("id, nombre, permisos, es_propietario, created_at")
    .order("created_at");

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ roles: data });
}

// ─── POST /api/roles — Crear un nuevo rol ─────────────────────────────────────

export async function POST(request: Request) {
  const { permisos, error } = await getCallerPermisos();
  if (error) return NextResponse.json({ error }, { status: 401 });
  if (!permisos?.gestionar_roles) {
    return NextResponse.json({ error: "Sin permiso para gestionar roles" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.nombre || typeof body.nombre !== "string") {
    return NextResponse.json({ error: "El campo 'nombre' es obligatorio" }, { status: 400 });
  }
  if (!body?.permisos || typeof body.permisos !== "object") {
    return NextResponse.json({ error: "El campo 'permisos' es obligatorio" }, { status: 400 });
  }

  const nombre = body.nombre.trim();
  if (!nombre) return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 });

  // Solo el Propietario puede activar gestionar_roles en un rol
  const nuevoPermisos: Permisos = { ...body.permisos };
  if (!permisos.gestionar_roles) {
    nuevoPermisos.gestionar_roles = false;
  }

  const admin = createSupabaseAdmin();
  const { data, error: dbError } = await admin
    .from("roles")
    .insert({ nombre, permisos: nuevoPermisos, es_propietario: false })
    .select()
    .single();

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "Ya existe un rol con ese nombre" }, { status: 409 });
    }
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ rol: data }, { status: 201 });
}
