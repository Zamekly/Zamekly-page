import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";
import type { Permisos } from "@/lib/permisos";

// ─── PATCH /api/usuarios/[id]/rol — Asignar rol a un usuario ─────────────────

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: targetUserId } = await params;

  // ── Verificar que el caller tiene gestionar_roles ──
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

  // ── Leer body ──
  const body = await request.json().catch(() => null);
  const rolId: string | null = body?.rol_id ?? null; // null = quitar rol

  const admin = createSupabaseAdmin();

  // ── Proteger al usuario Propietario ──
  const { data: targetPerfil } = await admin
    .from("perfiles")
    .select("rol_id, roles(es_propietario)")
    .eq("user_id", targetUserId)
    .single();

  const targetEsPropietario =
    (targetPerfil?.roles as { es_propietario: boolean } | null)?.es_propietario ?? false;

  if (targetEsPropietario) {
    return NextResponse.json(
      { error: "No se puede modificar el rol del Propietario" },
      { status: 403 }
    );
  }

  // ── Proteger el rol Propietario ── (no se puede asignar a nadie)
  if (rolId) {
    const { data: rolDestino } = await admin
      .from("roles")
      .select("es_propietario")
      .eq("id", rolId)
      .single();

    if (rolDestino?.es_propietario) {
      return NextResponse.json(
        { error: "El rol Propietario no puede asignarse desde la interfaz" },
        { status: 403 }
      );
    }
  }

  // ── Actualizar o crear perfil ──
  const { error: upsertError } = await admin
    .from("perfiles")
    .upsert(
      { user_id: targetUserId, rol_id: rolId },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
