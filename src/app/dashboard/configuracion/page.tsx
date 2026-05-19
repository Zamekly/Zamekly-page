"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type TotpFactor = {
  id: string;
  status: "unverified" | "verified";
  friendly_name?: string;
};

type EnrollStep = "idle" | "scanning" | "verifying";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 dark:bg-[#1E293B] dark:border-slate-700 shadow-sm">
      <div className="border-b border-gray-100 dark:border-slate-700 px-6 py-4">
        <h2 className="text-sm font-semibold text-brand-navy dark:text-white">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfiguracionPage() {
  const router = useRouter();

  // User info
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // 2FA
  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [enrollStep, setEnrollStep] = useState<EnrollStep>("idle");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [enrollFactorId, setEnrollFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSaving, setEnrollSaving] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);

  // Change password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Sign out all devices
  const [signingOutAll, setSigningOutAll] = useState(false);

  // Delete account
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoadingFactors(true);
    const [{ data: factorsData }, { data: { user } }] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.getUser(),
    ]);
    setFactors((factorsData?.totp ?? []) as TotpFactor[]);
    setUserEmail(user?.email ?? null);
    setUserId(user?.id ?? null);
    setLoadingFactors(false);
  }

  // ── 2FA Enroll ────────────────────────────────────────────────────────────

  async function startEnroll() {
    setEnrollError(null);
    setEnrollStep("scanning");
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    if (error || !data) {
      setEnrollError("No se pudo generar el código QR. Inténtalo de nuevo.");
      setEnrollStep("idle");
      return;
    }
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setEnrollFactorId(data.id);
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollFactorId) return;
    setEnrollError(null);
    setEnrollSaving(true);

    const { data: challenge, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId: enrollFactorId });
    if (challengeErr || !challenge) {
      setEnrollError("Error al generar el desafío. Inténtalo de nuevo.");
      setEnrollSaving(false);
      return;
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId: enrollFactorId,
      challengeId: challenge.id,
      code: verifyCode.trim(),
    });

    if (verifyErr) {
      setEnrollError("Código incorrecto. Comprueba tu aplicación e inténtalo de nuevo.");
      setEnrollSaving(false);
      return;
    }

    setEnrollStep("idle");
    setQrCode(null);
    setSecret(null);
    setEnrollFactorId(null);
    setVerifyCode("");
    setEnrollSaving(false);
    loadAll();
  }

  function cancelEnroll() {
    setEnrollStep("idle");
    setQrCode(null);
    setSecret(null);
    setEnrollFactorId(null);
    setVerifyCode("");
    setEnrollError(null);
  }

  async function handleUnenroll(factorId: string) {
    if (!confirm("¿Desactivar la verificación en dos pasos? Perderás la protección adicional.")) return;
    setUnenrolling(true);
    await supabase.auth.mfa.unenroll({ factorId });
    setUnenrolling(false);
    loadAll();
  }

  // ── Change password ───────────────────────────────────────────────────────

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setPasswordSaving(true);

    // Re-authenticate with current password first
    if (userEmail && currentPassword) {
      const { error: reAuthErr } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });
      if (reAuthErr) {
        setPasswordError("La contraseña actual es incorrecta.");
        setPasswordSaving(false);
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError("No se pudo actualizar la contraseña. Inténtalo de nuevo.");
      setPasswordSaving(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
    setPasswordSaving(false);
    setTimeout(() => setPasswordSuccess(false), 4000);
  }

  // ── Sign out all devices ──────────────────────────────────────────────────

  async function handleSignOutAll() {
    if (!confirm("¿Cerrar sesión en todos los dispositivos? Tendrás que volver a iniciar sesión.")) return;
    setSigningOutAll(true);
    await supabase.auth.signOut({ scope: "global" });
    window.location.href = "/login";
  }

  // ── Delete account ────────────────────────────────────────────────────────

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "⚠️ Esta acción es irreversible.\n\n¿Estás seguro de que quieres eliminar tu cuenta? Perderás el acceso al panel permanentemente."
    );
    if (!confirmed) return;

    const doubleConfirmed = confirm("Última confirmación: ¿eliminar la cuenta definitivamente?");
    if (!doubleConfirmed) return;

    setDeletingAccount(true);
    // Sign out globally — actual account deletion requires an admin/edge function
    // For now, sign out all sessions and show a message to contact admin
    await supabase.auth.signOut({ scope: "global" });
    alert("Se ha cerrado tu sesión. Para eliminar tu cuenta definitivamente, contacta con el administrador de Zamekly.");
    window.location.href = "/login";
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const verifiedFactor = factors.find((f) => f.status === "verified");
  const has2FA = !!verifiedFactor;

  const INPUT =
    "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500";

  return (
    <div className="space-y-6 max-w-xl">

      {/* ── Mi cuenta ─────────────────────────────────────────────────────── */}
      <Section title="Mi cuenta">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-navy text-white text-lg font-bold">
            {userEmail?.[0]?.toUpperCase() ?? "?"}
          </span>
          <div>
            <p className="text-sm font-medium text-brand-navy dark:text-white">
              {userEmail ?? "—"}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Cuenta de acceso al panel</p>
          </div>
        </div>
      </Section>

      {/* ── Seguridad ─────────────────────────────────────────────────────── */}
      <Section title="Seguridad">
        <div className="space-y-8">

          {/* ── Verificación en dos pasos ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-brand-navy dark:text-white">
                  Verificación en dos pasos (2FA)
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Compatible con Google Authenticator, Authy y similares.
                </p>
              </div>
              {!loadingFactors && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    has2FA
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {has2FA ? "Activado" : "Desactivado"}
                </span>
              )}
            </div>

            {loadingFactors ? (
              <p className="text-sm text-gray-400 dark:text-slate-500">Cargando…</p>
            ) : (
              <>
                {/* Sin 2FA → botón activar */}
                {!has2FA && enrollStep === "idle" && (
                  <button
                    onClick={startEnroll}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Activar 2FA
                  </button>
                )}

                {/* Paso 1: QR */}
                {enrollStep === "scanning" && qrCode && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      <strong>1.</strong> Escanea este QR con tu aplicación de autenticación.
                    </p>
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCode}
                        alt="QR code 2FA"
                        className="rounded-xl border border-gray-200 dark:border-slate-600 p-2 bg-white"
                        style={{ width: 180, height: 180 }}
                      />
                    </div>
                    {secret && (
                      <div className="rounded-xl bg-gray-50 dark:bg-slate-800 px-4 py-3">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                          ¿No puedes escanear el QR? Introduce este código manualmente:
                        </p>
                        <p className="font-mono text-sm text-brand-navy dark:text-white break-all select-all">
                          {secret}
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      <strong>2.</strong> Introduce el código de 6 dígitos que aparece en tu app para confirmar.
                    </p>
                    <form onSubmit={verifyEnroll} className="space-y-4">
                      <input
                        type="text" inputMode="numeric" pattern="\d{6}" maxLength={6}
                        required placeholder="000000"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                        className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-xl font-mono tracking-[0.4em] text-brand-navy focus:border-brand-navy focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                      />
                      {enrollError && (
                        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                          {enrollError}
                        </p>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={enrollSaving || verifyCode.length < 6}
                          className="flex-1 inline-flex h-10 items-center justify-center rounded-xl bg-brand-navy text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
                        >
                          {enrollSaving ? "Verificando..." : "Confirmar y activar"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEnroll}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 2FA activo */}
                {has2FA && enrollStep === "idle" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-700/40 dark:bg-emerald-900/20">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      Tu cuenta está protegida con verificación en dos pasos.
                    </p>
                  </div>
                )}

                {has2FA && verifiedFactor && (
                  <button
                    onClick={() => handleUnenroll(verifiedFactor.id)}
                    disabled={unenrolling}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                      <path d="M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {unenrolling ? "Desactivando..." : "Desactivar 2FA"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700" />

          {/* ── Cambiar contraseña ── */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-brand-navy dark:text-white">
                Cambiar contraseña
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Elige una contraseña segura de al menos 8 caracteres.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">
                  Contraseña actual
                </label>
                <input
                  type="password" required autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">
                  Nueva contraseña
                </label>
                <input
                  type="password" required minLength={8} autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className={INPUT}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-slate-400">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password" required minLength={8} autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className={INPUT}
                />
              </div>

              {passwordError && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {passwordError}
                </p>
              )}
              {passwordSuccess && (
                <p className="rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                  ✓ Contraseña actualizada correctamente.
                </p>
              )}

              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-navy px-5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {passwordSaving ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700" />

          {/* ── Cerrar sesión en todos los dispositivos ── */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-navy dark:text-white">
                Cerrar sesión en todos los dispositivos
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Invalida todas las sesiones activas, incluida esta.
              </p>
            </div>
            <button
              onClick={handleSignOutAll}
              disabled={signingOutAll}
              className="shrink-0 inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {signingOutAll ? "Cerrando..." : "Cerrar sesiones"}
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 dark:border-slate-700" />

          {/* ── Zona de peligro ── */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Zona de peligro
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Acciones irreversibles. Procede con cuidado.
              </p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-700/40 dark:bg-red-900/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Eliminar mi cuenta
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
                    Perderás el acceso al panel permanentemente.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount}
                  className="shrink-0 inline-flex h-9 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deletingAccount ? "Eliminando..." : "Eliminar cuenta"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </Section>

      <p className="text-xs text-gray-400 dark:text-slate-500 px-1">
        Los cambios aquí solo afectan al acceso al panel de gestión.
      </p>
    </div>
  );
}
