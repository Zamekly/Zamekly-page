import { USERS } from "@/lib/mock-data";

// In production this would come from the Supabase session.
// For mock purposes we treat the first user (admin) as the current user.
const CURRENT_USER_ROLE = "admin";

export default function UsuariosPage() {
  if (CURRENT_USER_ROLE !== "admin") {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Acceso restringido a administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Info note */}
      <div className="rounded-xl bg-slate-50 px-5 py-4 ring-1 ring-slate-200 dark:bg-slate-800/50 dark:ring-slate-700">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Los usuarios se crean y eliminan directamente desde el panel de{" "}
          <span className="font-medium text-brand-navy dark:text-white">Supabase</span>.
          Aquí solo se gestionan los roles asignados.
        </p>
      </div>

      {/* Users table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-[#1E293B] dark:ring-slate-700">
        <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-brand-navy dark:text-white">
            {USERS.length} usuario{USERS.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["Nombre", "Email", "Rol", "Último acceso", "Alta"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-50 last:border-0 dark:border-slate-700/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="font-medium text-brand-navy dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-brand-navy/10 text-brand-navy dark:bg-brand-blue/20 dark:text-brand-blue"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Operador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(user.lastLogin).toLocaleString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
