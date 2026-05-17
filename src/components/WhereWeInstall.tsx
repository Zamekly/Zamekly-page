const locations = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Waves + sun */}
        <path d="M2 17c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2 21c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M18 2v1M18 9.5v1M14.5 6h-1M22 6h-1M15.7 3.7l.7.7M20.6 8.6l.7.7M15.7 8.3l.7-.7M20.6 3.4l.7-.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Playas y zonas costeras",
    description:
      "Guarda bañadores, toallas, móviles y llaves mientras disfrutas del agua. Bloque resistente a la sal y la arena, alimentado por solar.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Dumbbell */}
        <rect x="7" y="11" width="10" height="2" rx="1" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="17" y="9" width="4" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1" y="10.5" width="2" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="21" y="10.5" width="2" height="3" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    title: "Gimnasios y centros deportivos",
    description:
      "Taquillas de uso diario para socios sin asignación fija. El usuario elige, paga y libera — sin llaves ni gestión manual.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Music note + star burst */}
        <path d="M9 18V6l10-2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17" cy="16" r="2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    title: "Festivales y eventos",
    description:
      "Desplegables en horas, recogibles al terminar. Ideales para eventos de uno o varios días donde el aforo cambia constantemente.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Train */}
        <rect x="4" y="4" width="16" height="13" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 11h16" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 17l-2 3M15 17l2 3M9 20h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8.5" cy="14.5" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="15.5" cy="14.5" r="1" fill="currentColor" opacity="0.7" />
        <path d="M9 4V2M15 4V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Estaciones de metro y tren",
    description:
      "Para viajeros que necesitan guardar equipaje unas horas. Rotación alta, gestión remota y sin personal de atención permanente.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Stadium / trophy */}
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M5 3h14v8a7 7 0 0 1-14 0V3Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 7H2a3 3 0 0 0 3 3M19 7h3a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 17h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Recintos deportivos",
    description:
      "Estadios, pabellones y polideportivos. El afluente de público en poco tiempo requiere bloques de alta capacidad y apertura rápida.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
        {/* Ferris wheel */}
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
        <line x1="12" y1="4" x2="12" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="12" y1="14" x2="12" y2="20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="4" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="14" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="6.34" y1="6.34" x2="10.59" y2="10.59" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="13.41" y1="13.41" x2="17.66" y2="17.66" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="17.66" y1="6.34" x2="13.41" y2="10.59" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="10.59" y1="13.41" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Parques de atracciones y ocio",
    description:
      "Guarda objetos durante la visita sin necesidad de volver a la entrada. Módulos distribuidos por zonas del recinto.",
  },
];

export default function WhereWeInstall() {
  return (
    <section id="donde-instalamos" className="bg-white py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Ubicaciones
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Dónde instalamos
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Zamekly encaja en cualquier espacio con paso de personas.
            Si tienes afluencia, tienes una oportunidad.
          </p>
        </div>

        {/* Location grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <div
              key={loc.title}
              className="group flex gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              {/* SVG icon */}
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white shadow-sm">
                {loc.icon}
              </span>

              <div>
                <h3 className="text-sm font-semibold text-brand-navy">
                  {loc.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {loc.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-slate-500">
          ¿Tu espacio no aparece aquí?{" "}
          <a
            href="#contacto"
            className="font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy-soft"
          >
            Cuéntanos tu caso y lo estudiamos.
          </a>
        </p>
      </div>
    </section>
  );
}
