const differentiators = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sun rays */}
        <path d="M12 3V1m0 22v-2M3 12H1m22 0h-2m-2.636-7.364L16.95 6.05M7.05 16.95l-1.414 1.414M18.364 18.364l-1.414-1.414M6.05 7.05 4.636 5.636" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Energía autónoma o de red",
    description:
      "Cada bloque incorpora paneles solares de serie. En espacios cerrados o con poca luz, también puede conectarse a la red eléctrica. La solución se adapta a tu instalación.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 6h4M10 9.5h4M10 13h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M15 6.5 17 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="18" cy="4" r="1.5" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.2" />
        <line x1="17" y1="3" x2="19" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    title: "El usuario no necesita app",
    description:
      "Pago directo en la pantalla táctil del bloque: tarjeta, contactless o QR. Sin descargas, sin registro, sin fricción para el usuario final.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Instalación a medida",
    description:
      "Estudiamos tu espacio, diseñamos el bloque ideal y lo instalamos con todo incluido. Sin sorpresas.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="7" cy="10" r="1.5" fill="currentColor" opacity="0.35" />
        <circle cx="12" cy="10" r="1.5" fill="currentColor" opacity="0.65" />
        <circle cx="17" cy="10" r="1.5" fill="currentColor" opacity="0.35" />
      </svg>
    ),
    title: "Gestión completamente delegada",
    description:
      "Nos encargamos de todo. Tú solo pones el espacio y recibes los ingresos. Sin personal ni preocupaciones.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="14" y="14" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M17 14v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Tamaño adaptable a tu espacio",
    description:
      "Los bloques son modulares: desde 6 taquillas para un vestuario hasta cientos de unidades para una playa o un festival. La configuración se diseña a medida.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
        <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7Z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 20.5C5.5 21.5 3 22 3 22s.5-2.5 2-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
    title: "Detección de objetos olvidados",
    description:
      "La cámara interior con IA avisa al operador si una taquilla liberada tiene objetos dentro, evitando pérdidas y quejas de usuarios.",
  },
];

export default function WhyZamekly() {
  return (
    <section
      id="por-que-zamekly"
      className="bg-slate-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Diferenciadores
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Por qué elegir Zamekly
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            No es solo una taquilla. Es infraestructura que funciona sola,
            se gestiona a distancia y no da problemas.
          </p>
        </div>

        {/* Grid of differentiators */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-navy text-white">
                {item.icon}
              </div>

              <h3 className="text-base font-semibold text-brand-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
