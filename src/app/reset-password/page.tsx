"use client";

import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

const INPUT =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10";

const BTN_PRIMARY =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Supabase envía el token en el hash de la URL.
  // createBrowserClient lo detecta y dispara PASSWORD_RECOVERY.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // Si ya hay sesión activa (recarga de página), también mostramos el form
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("No se pudo actualizar la contraseña. El enlace puede haber expirado.");
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);

    // Redirigir al dashboard tras 2 segundos
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <a href="/">
            <Logo className="text-brand-navy" />
          </a>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          {done ? (
            <div className="space-y-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mx-auto">
                <svg viewBox="0 0 20 20" fill="none" className="h-6 w-6 text-emerald-600">
                  <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-brand-navy">Contraseña actualizada</h2>
              <p className="text-sm text-slate-500">
                Tu contraseña se ha cambiado correctamente. Redirigiendo al panel…
              </p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-brand-navy">Restablece tu contraseña</h2>
              <p className="text-sm text-slate-500">
                Validando el enlace de recuperación…
              </p>
              <p className="text-xs text-slate-400 pt-2">
                Si llevas más de unos segundos aquí, es posible que el enlace haya expirado.{" "}
                <a href="/login" className="underline hover:text-brand-navy">
                  Solicita uno nuevo
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-1 text-xl font-bold text-brand-navy">Nueva contraseña</h2>
              <p className="mb-8 text-sm text-slate-500">
                Elige una contraseña segura de al menos 8 caracteres.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-brand-navy">
                    Nueva contraseña
                  </label>
                  <input
                    id="new-password" type="password" required minLength={8}
                    autoComplete="new-password"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres" className={INPUT}
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-brand-navy">
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirm-password" type="password" required minLength={8}
                    autoComplete="new-password"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repite la contraseña" className={INPUT}
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className={BTN_PRIMARY}>
                  {loading ? "Guardando..." : "Guardar nueva contraseña"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Los accesos los gestiona el administrador de Zamekly.
        </p>
      </div>
    </div>
  );
}
