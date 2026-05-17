import LockerBlock from "./LockerBlock";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white min-h-[92vh] flex flex-col justify-center">
      {/* Subtle ambient gradient (no neons, just a faint warm light from top-right) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[60rem] bg-gradient-to-tr from-slate-100 via-blue-100 to-white opacity-50"
          style={{
            clipPath:
              "polygon(74% 44%, 100% 17%, 90% 78%, 51% 100%, 0 65%, 32% 0)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 pt-16 pb-10 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-24 lg:pb-12">
        {/* Text column */}
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Taquillas inteligentes modulares
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-brand-navy sm:text-5xl lg:text-[3.5rem]">
            Espacios públicos más cómodos.{" "}
            Gestión más sencilla.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Bloques modulares de taquillas inteligentes para playas, gimnasios,
            discotecas, estaciones y eventos. Instalación rápida,
            monitorización remota 24/7 y mantenimiento mínimo — sin que el
            usuario tenga que instalar nada en su móvil.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contacto"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-navy px-7 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy-soft"
            >
              Solicitar información
            </a>
            <a
              href="#como-funciona"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 px-7 text-sm font-semibold text-brand-navy transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Ver cómo funciona
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              >
                <path
                  d="M4 10h12m0 0-4-4m4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-slate-200 pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-slate-500">Instalación</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">&lt;1 día</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Monitorización</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">24 / 7</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Energía</dt>
              <dd className="mt-1 text-2xl font-semibold text-brand-navy">Solar</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Tamaño</dt>
              <dd className="mt-1 text-lg font-semibold leading-tight text-brand-navy">Adaptable a tu espacio</dd>
            </div>
          </dl>
        </div>

        {/* Illustration column — wider to give the locker block more presence */}
        <div className="lg:col-span-7">
          <div className="relative mx-auto w-full max-w-none">
            <LockerBlock className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
