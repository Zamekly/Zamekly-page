import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Construimos la respuesta base; la mutaremos si el cliente SSR necesita
  // refrescar tokens y escribir cookies actualizadas.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Primero actualizamos el objeto request para que la cadena de
          // middleware vea los nuevos valores.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Luego regeneramos la respuesta con los mismos cookies para que
          // el navegador los reciba.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() valida el JWT con Supabase y refresca el token si hace falta.
  // Nunca usar getSession() aquí — no es seguro en el servidor.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirigir a /login si el usuario no está autenticado e intenta entrar al dashboard
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Devolvemos supabaseResponse (no NextResponse.next()) para que las cookies
  // actualizadas lleguen al navegador.
  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
