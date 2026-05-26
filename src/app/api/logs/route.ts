import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase-server";

// ─── POST /api/logs — Insertar entrada de log ─────────────────────────────────

export async function POST(request: Request) {
  // ── Verificar que hay sesión activa ──
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // ── Leer body ──
  const body = await request.json().catch(() => null);
  const { bloque_id, taquilla_id, tipo, descripcion } = body ?? {};

  if (!bloque_id || !tipo || !descripcion) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios: bloque_id, tipo, descripcion" },
      { status: 400 }
    );
  }

  // ── Insertar con service role (RLS solo permite leer a autenticados) ──
  const admin = createSupabaseAdmin();
  const { error } = await admin.from("logs").insert({
    bloque_id,
    taquilla_id: taquilla_id ?? null,
    tipo,
    descripcion,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
