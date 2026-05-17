import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Política de cookies | Zamekly",
  description: "Información sobre el uso de cookies en el sitio web de Zamekly.",
};

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 lg:px-8">
        <Link href="/" aria-label="Volver al inicio">
          <Logo />
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Legal</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy">
          Política de cookies
        </h1>
        <p className="mt-2 text-sm text-slate-500">Última actualización: enero de 2026</p>

        <div className="prose prose-slate mt-10 max-w-none text-slate-700 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-brand-navy [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:text-sm [&_p]:text-sm">

          <p>
            Este sitio web utiliza cookies y tecnologías similares para garantizar su correcto
            funcionamiento y mejorar la experiencia del usuario. A continuación explicamos qué
            son las cookies, cuáles utilizamos y cómo puede gestionarlas.
          </p>

          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que un sitio web almacena en su
            dispositivo cuando lo visita. Permiten que el sitio recuerde información sobre
            su visita (como el idioma o las preferencias) para facilitar su próxima visita
            y hacer el sitio más útil.
          </p>

          <h2>2. Tipos de cookies que utilizamos</h2>

          <p><strong>Cookies técnicas o estrictamente necesarias</strong></p>
          <p>
            Son imprescindibles para el funcionamiento básico del sitio web. Sin ellas, el
            sitio no puede funcionar correctamente. No requieren consentimiento del usuario.
          </p>
          <ul>
            <li><strong>Sesión de navegación:</strong> mantiene el estado de la sesión durante la visita.</li>
            <li><strong>Preferencias de cookies:</strong> almacena si el usuario ha aceptado o rechazado las cookies no esenciales.</li>
          </ul>

          <p><strong>Cookies analíticas (previa aceptación)</strong></p>
          <p>
            Nos permiten contar las visitas y conocer las fuentes de tráfico para medir y
            mejorar el rendimiento del sitio. Toda la información es agregada y anónima.
          </p>
          <ul>
            <li><strong>Proveedor:</strong> Google Analytics (o herramienta equivalente con anonimización de IP activada).</li>
            <li><strong>Finalidad:</strong> estadísticas de uso del sitio web (páginas visitadas, tiempo de sesión, origen del tráfico).</li>
            <li><strong>Duración:</strong> hasta 2 años.</li>
          </ul>

          <h2>3. Cookies de terceros</h2>
          <p>
            Actualmente este sitio web no incorpora cookies de terceros con finalidades
            publicitarias ni de seguimiento entre sitios. Si en el futuro se incorporasen,
            esta política se actualizará y se solicitará el consentimiento correspondiente.
          </p>

          <h2>4. ¿Cómo gestionar las cookies?</h2>
          <p>
            Puede aceptar, rechazar o configurar las cookies no esenciales a través del
            banner que aparece en su primera visita al sitio. También puede gestionar
            o eliminar las cookies directamente desde la configuración de su navegador:
          </p>
          <ul>
            <li><strong>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies.</li>
            <li><strong>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies.</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web.</li>
            <li><strong>Microsoft Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies.</li>
          </ul>
          <p>
            Tenga en cuenta que deshabilitar cookies puede afectar al funcionamiento de algunas
            partes del sitio.
          </p>

          <h2>5. Actualizaciones de esta política</h2>
          <p>
            Podemos actualizar esta política cuando cambie el uso de cookies en el sitio.
            La versión actualizada estará siempre disponible en esta página con la fecha
            de última modificación.
          </p>

          <h2>6. Más información</h2>
          <p>
            Si tiene preguntas sobre nuestra política de cookies, puede contactarnos en{" "}
            <a href="mailto:info@zamekly.com" className="text-brand-navy underline underline-offset-2">
              info@zamekly.com
            </a>. Para más información sobre sus derechos en materia de datos personales,
            consulte nuestra{" "}
            <Link href="/privacidad" className="text-brand-navy underline underline-offset-2">
              Política de privacidad
            </Link>.
          </p>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8">
          <Link href="/" className="text-sm font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy-soft">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
}
