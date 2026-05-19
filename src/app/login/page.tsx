"use client";

import { useState } from "react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

// ─── Helpers: remember device ──────────────────────────────────────────────────

const DEVICE_KEY = "zamekly_remembered_devices";

function getRememberedDevices(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(DEVICE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function checkDeviceRemembered(userId: string): boolean {
  const devices = getRememberedDevices();
  return !!devices[userId] && Date.now() < devices[userId];
}

function persistDeviceRemember(userId: string) {
  const devices = getRememberedDevices();
  devices[userId] = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 días
  localStorage.setItem(DEVICE_KEY, JSON.stringify(devices));
}

// ─── Shared input style ───────────────────────────────────────────────────────

const INPUT =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10";

const BTN_PRIMARY =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60";

// ─── Page ─────────────────────────────────────────────────────────────────────

type View = "login" | "mfa" | "forgot";

export default function LoginPage() {
  const [view, setView] = useState<View>("login");

  // ── Login state ──
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // ── MFA state ──
  const [mfaCode, setMfaCode]         = useState("");
  const [factorId, setFactorId]       = useState<string | null>(null);
  const [userId, setUserId]           = useState<string | null>(null);
  const [shouldRemember, setShouldRemember] = useState(false);
  const [mfaError, setMfaError]       = useState<string | null>(null);
  const [mfaLoading, setMfaLoading]   = useState(false);

  // ── Forgot state ──
  const [forgotEmail, setForgotEmail]   = useState("");
  const [forgotSent, setForgotSent]     = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError]   = useState<string | null>(null);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setLoginError("Credenciales incorrectas. Inténtalo de nuevo.");
      setLoginLoading(false);
      return;
    }

    // Comprobar si tiene 2FA activo
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const totp = factors?.totp?.find((f) => f.status === "verified");

    if (totp) {
      const uid = data.user.id;
      setUserId(uid);
      setFactorId(totp.id);

      if (checkDeviceRemembered(uid)) {
        // Dispositivo recordado → saltar 2FA
        window.location.href = "/dashboard";
        return;
      }

      setView("mfa");
      setLoginLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleMfa(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setMfaError(null);
    setMfaLoading(true);

    const { data: challenge, error: challengeErr } =
      await supabase.auth.mfa.challenge({ factorId });

    if (challengeErr || !challenge) {
      setMfaError("Error al generar el desafío. Inténtalo de nuevo.");
      setMfaLoading(false);
      return;
    }

    const { error: verifyErr } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: mfaCode.trim(),
    });

    if (verifyErr) {
      setMfaError("Código incorrecto. Comprueba tu aplicación de autenticación.");
      setMfaLoading(false);
      return;
    }

    if (shouldRemember && userId) {
      persistDeviceRemember(userId);
    }

    window.location.href = "/dashboard";
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setForgotError("No se pudo enviar el email. Inténtalo más tarde.");
      setForgotLoading(false);
      return;
    }

    setForgotSent(true);
    setForgotLoading(false);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <a href="/">
            <Logo />
          </a>
        </div>

        {/* ── Vista: Login ── */}
        {view === "login" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-1 text-xl font-bold text-brand-navy">Acceso al panel</h2>
            <p className="mb-8 text-sm text-slate-500">
              Solo para empleados y socios de Zamekly.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-navy">
                  Email
                </label>
                <input
                  id="email" type="email" required autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@zamekly.com" className={INPUT}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-navy">
                  Contraseña
                </label>
                <input
                  id="password" type="password" required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className={INPUT}
                />
              </div>

              {loginError && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {loginError}
                </p>
              )}

              <button type="submit" disabled={loginLoading} className={BTN_PRIMARY}>
                {loginLoading ? "Entrando..." : "Entrar"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setForgotEmail(email); setView("forgot"); }}
                  className="text-sm text-slate-500 underline-offset-2 hover:text-brand-navy hover:underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Vista: 2FA ── */}
        {view === "mfa" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy/10 mx-auto">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-navy">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            </div>

            <h2 className="mb-1 text-center text-xl font-bold text-brand-navy">
              Verificación en dos pasos
            </h2>
            <p className="mb-8 text-center text-sm text-slate-500">
              Introduce el código de 6 dígitos de tu aplicación de autenticación.
            </p>

            <form onSubmit={handleMfa} className="space-y-5">
              <div>
                <label htmlFor="mfa-code" className="block text-sm font-medium text-brand-navy">
                  Código de verificación
                </label>
                <input
                  id="mfa-code" type="text" inputMode="numeric" pattern="\d{6}"
                  maxLength={6} required autoComplete="one-time-code"
                  value={mfaCode} onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className={`${INPUT} text-center text-xl tracking-[0.4em] font-mono`}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={shouldRemember}
                  onChange={(e) => setShouldRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 accent-brand-navy"
                />
                <span className="text-sm text-slate-600">
                  Recordar este dispositivo durante 30 días
                </span>
              </label>

              {mfaError && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {mfaError}
                </p>
              )}

              <button type="submit" disabled={mfaLoading || mfaCode.length < 6} className={BTN_PRIMARY}>
                {mfaLoading ? "Verificando..." : "Verificar"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setView("login"); setMfaCode(""); setMfaError(null); }}
                  className="text-sm text-slate-500 underline-offset-2 hover:text-brand-navy hover:underline transition-colors"
                >
                  ← Volver al login
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Vista: Recuperar contraseña ── */}
        {view === "forgot" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="mb-1 text-xl font-bold text-brand-navy">Recuperar contraseña</h2>
            <p className="mb-8 text-sm text-slate-500">
              Te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {forgotSent ? (
              <div className="space-y-5">
                <div className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700 ring-1 ring-emerald-200">
                  ✓ Email enviado a <strong>{forgotEmail}</strong>. Revisa tu bandeja de entrada.
                </div>
                <button
                  type="button"
                  onClick={() => { setView("login"); setForgotSent(false); }}
                  className={BTN_PRIMARY}
                >
                  Volver al login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-brand-navy">
                    Email
                  </label>
                  <input
                    id="forgot-email" type="email" required
                    value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="tu@zamekly.com" className={INPUT}
                  />
                </div>

                {forgotError && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {forgotError}
                  </p>
                )}

                <button type="submit" disabled={forgotLoading} className={BTN_PRIMARY}>
                  {forgotLoading ? "Enviando..." : "Enviar enlace"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-sm text-slate-500 underline-offset-2 hover:text-brand-navy hover:underline transition-colors"
                  >
                    ← Volver al login
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-400">
          Los accesos los gestiona el administrador de Zamekly.
        </p>
      </div>
    </div>
  );
}
