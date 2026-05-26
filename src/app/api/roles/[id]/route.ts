import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import type { Permisos } from "@/lib/permisos";

// ─── DELETE /api/roles/[id] — Eliminar un rol ─────────────────────────────────

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rolId } = await params;

  // ── Verificar autorización ──
  const supabase = await createSupabaseServer();
  const { data: { user: caller } } = await supabase.auth.getUser();

  if (!caller) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: callerPerfil } = await supabase
    .from("perfiles")
    .select("roles(permisos, es_propietario)")
    .eq("user_id", caller.id)
    .single();

  const callerRol = callerPerfil?.roles as { permisos: Permisos; es_propietario: boolean } | null;

  if (!callerRol?.permisos?.gestionar_roles) {
    return NextResponse.json({ error: "Sin permiso para gestionar roles" }, { status: 403 });
  }

  const admin = createSupabaseAdmin();

  // ── Verificar que el rol no es el de Propietario ──
  const { data: rol } = await admin
    .from("roles")
    .select("es_propietario, nombre")
    .eq("id", rolId)
    .single();

  if (!rol) {
    return NextResponse.json({ error: "Rol no encontrado" }, { status: 404 });
  }

  if (rol.es_propietario) {
    return NextResponse.json(
      { error: "El rol Propietario no puede eliminarse" },
      { status: 403 }
    );
  }

  // ── Verificar que no hay usuarios con este rol asignado ──
  const { count } = await admin
    .from("perfiles")
    .select("*", { count: "exact", head: true })
    .eq("rol_id", rolId);

  if (count && count > 0) {
    return NextResponse.json(
      {
        error: `No se puede eliminar: ${count} usuario${count !== 1 ? "s" : ""} tiene${count !== 1 ? "n" : ""} este rol asignado`,
      },
      { status: 409 }
    );
  }

  // ── Eliminar ──
  const { error: deleteError } = await admin
    .from("roles")
    .delete()
    .eq("id", rolId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
