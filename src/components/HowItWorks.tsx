const steps = [
  {
    number: "01",
    title: "Nos explicas tu espacio",
    description:
      "Cuéntanos dónde quieres instalar las taquillas — playa, gimnasio, estación, festival — y cuántas unidades necesitas. Diseñamos un bloque adaptado a tu superficie y al volumen de usuarios que esperas.",
    detail: "Sin compromiso. Propuesta en 48 h.",
  },
  {
    number: "02",
    title: "Instalamos en menos de un día",
    description:
      "Nuestro equipo estudia tu espacio y gestiona todo — desde el anclaje hasta la conexión energética, sea solar o de red.",
    detail: "Instalación limpia. Cero cortes de suministro.",
  },
  {
    number: "03",
    title: "Cobras sin gestionar nada",
    description:
      "Nosotros gestionamos el día a día. Tú recibes tu parte de los ingresos sin preocuparte de nada.",
    detail: "Control total. Sin desplazamientos.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative bg-white pt-12 pb-24 sm:pt-16 sm:pb-32 scroll-mt-20"
    >
      {/* Section header */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Proceso
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            En marcha en tres pasos
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            De la llamada inicial a la primera reserva en menos de 48 horas.
            Sin complicaciones técnicas para tu equipo.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-16 max-w-5xl">
          {/* Connector line visible only on desktop */}
          <div
            aria-hidden="true"
            className="relative mb-[-1px] hidden lg:block"
          >
            <div className="absolute left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] top-8 h-px bg-slate-200" />
          </div>

          <ol className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step) => (
              <li key={step.number} className="relative flex flex-col">
                {/* Step number badge */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <span className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-brand-navy shadow-sm">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold text-brand-navy lg:mt-6">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="mt-4 text-base leading-relaxed text-slate-600 lg:mt-4">
                  {step.description}
                </p>

                {/* Detail pill */}
                <p className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 text-brand-navy"
                  >
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M8 5v3.5l2 2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 flex justify-center">
          <a
            href="#contacto"
            className="inline-flex h-12 items-center justify-center rounded-full bg-brand-navy px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy-soft"
          >
            Solicitar propuesta gratuita
          </a>
        </div>
      </div>
    </section>
  );
}
