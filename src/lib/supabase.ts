import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton Supabase client para componentes de cliente.
 * Usa createBrowserClient de @supabase/ssr para que la sesión se persista
 * en cookies (no en localStorage), de modo que el middleware SSR pueda leerla.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
