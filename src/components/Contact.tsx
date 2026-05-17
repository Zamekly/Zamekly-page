const SPACE_TYPES = [
  "Playa / zona costera",
  "Gimnasio / centro deportivo",
  "Festival / evento",
  "Estación de metro o tren",
  "Recinto deportivo",
  "Parque de atracciones",
  "Otro",
];

export default function Contact() {
  return (
    <section id="contacto" className="bg-slate-50 py-24 sm:py-32 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">
            Contacto
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            Hablemos de tu espacio
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Cuéntanos dónde estás y qué necesitas. Te respondemos en menos de 48 horas
            con una propuesta sin compromiso.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-xl">
          <form
            action={`mailto:info@zamekly.com`}
            method="POST"
            className="space-y-6"
          >
            {/* Name + Email */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-brand-navy"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-brand-navy"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-brand-navy"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                autoComplete="tel"
                placeholder="+34 600 000 000"
                className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
              />
            </div>

            {/* Space type */}
            <div>
              <label
                htmlFor="espacio"
                className="block text-sm font-medium text-brand-navy"
              >
                Tipo de espacio
              </label>
              <div className="relative mt-2">
                <select
                  id="espacio"
                  name="espacio"
                  required
                  defaultValue=""
                  className="block w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {SPACE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {/* Chevron */}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm font-medium text-brand-navy"
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={5}
                placeholder="Cuéntanos qué espacio tienes, cuántas taquillas necesitas aproximadamente y cualquier detalle que nos ayude a preparar tu propuesta."
                className="mt-2 block w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-brand-navy text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy-soft"
            >
              Enviar mensaje
            </button>
          </form>

          {/* Direct email */}
          <p className="mt-8 text-center text-sm text-slate-500">
            O escríbenos directamente a{" "}
            <a
              href="mailto:info@zamekly.com"
              className="font-medium text-brand-navy underline underline-offset-2 hover:text-brand-navy-soft"
            >
              info@zamekly.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
