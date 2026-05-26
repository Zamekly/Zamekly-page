import Logo from "@/components/Logo";

export default function PendienteScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-4 dark:bg-[#0F172A]">
      <Logo className="text-brand-navy" />

      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        {/* Icono */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-amber-600 dark:text-amber-400">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-xl font-bold text-brand-navy dark:text-white">
          Cuenta pendiente de activación
        </h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          Tu cuenta está registrada pero aún no tienes un rol asignado. Contacta con el administrador de Zamekly para que te asigne acceso.
        </p>
      </div>

      <form action="/api/auth/signout" method="post">
        <a
          href="/login"
          className="text-xs text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline dark:hover:text-slate-300 transition-colors"
        >
          Cerrar sesión
        </a>
      </form>
    </div>
  );
}
