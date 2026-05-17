export default function Models() {
  return (
    <section id="modelos" className="bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Modelos de colaboración
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Elige cómo quieres trabajar con nosotros
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Dos modelos pensados para distintos perfiles. El equipamiento y el
            soporte técnico siempre los ponemos nosotros.
          </p>
        </div>

        {/* Model cards */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Model A — Colaboración */}
          <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5">
                  <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Z" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6.5 10.5 9 13l4.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">Modelo A</p>
                <h3 className="text-lg font-bold text-brand-navy">Colaboración</h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              Tú pones el espacio, nosotros ponemos todo lo demás. Zamekly instala,
              opera y mantiene el bloque. Tú recibes un porcentaje de los ingresos
              generados, sin necesidad de personal ni gestión de tu parte.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                "Sin inversión inicial",
                "Instalación y mantenimiento incluidos",
                "Gestión operativa 100% a cargo de Zamekly",
                "Ingresos proporcionales al uso",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M5.5 8.5 7 10l3.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <a
                href="#contacto"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white transition-colors hover:bg-brand-navy-soft"
              >
                Solicitar información
              </a>
            </div>
          </div>

          {/* Model B — Compra */}
          <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5">
                  <rect x="3" y="5" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M7 5V4a3 3 0 1 1 6 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="10" cy="11" r="1.5" fill="currentColor" opacity="0.6" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-blue">Modelo B</p>
                <h3 className="text-lg font-bold text-brand-navy">Compra propia</h3>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              Adquieres el bloque de taquillas y lo gestionas tú directamente desde
              tu propio dashboard. Tú controlas precios, horarios e ingresos al 100%.
              Zamekly se encarga únicamente de las averías graves y te da soporte técnico continuo.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {[
                "Compra única del equipamiento",
                "Dashboard propio para gestión completa",
                "Ingresos íntegros para ti",
                "Mensualidad por dashboard y soporte técnico",
                "Intervención de Zamekly ante averías graves",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M5.5 8.5 7 10l3.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <a
                href="#contacto"
                className="inline-flex h-11 w-full items-center justify-center rounded-full border border-brand-navy text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
              >
                Solicitar información
              </a>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-sm text-slate-500">
          ¿No tienes claro cuál encaja mejor con tu caso?{" "}
          <a
            href="#contacto"
            className="font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy-soft"
          >
            Cuéntanos tu situación y te asesoramos sin compromiso.
          </a>
        </p>
      </div>
    </section>
  );
}
