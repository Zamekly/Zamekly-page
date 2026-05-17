import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Términos y condiciones | Zamekly",
  description: "Condiciones generales de contratación y uso de los servicios de Zamekly.",
};

export default function Terminos() {
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
          Términos y condiciones
        </h1>
        <p className="mt-2 text-sm text-slate-500">Última actualización: enero de 2026</p>

        <div className="prose prose-slate mt-10 max-w-none text-slate-700 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-brand-navy [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:text-sm [&_p]:text-sm">

          <p>
            Los presentes Términos y Condiciones regulan la relación entre Zamekly (en adelante,
            "Zamekly" o "la empresa") y los clientes que contraten sus servicios de instalación
            y/u operación de sistemas de taquillas inteligentes (en adelante, "el Cliente").
            El uso del sitio web www.zamekly.com implica la aceptación de las presentes condiciones.
          </p>

          <h2>1. Objeto</h2>
          <p>
            Zamekly ofrece dos modalidades de servicio:
          </p>
          <ul>
            <li>
              <strong>Modelo Colaboración:</strong> Zamekly instala, opera y mantiene el bloque de
              taquillas en el espacio cedido por el Cliente. Los ingresos generados se reparten
              entre ambas partes según el acuerdo firmado.
            </li>
            <li>
              <strong>Modelo Compra propia:</strong> El Cliente adquiere el equipamiento y lo
              gestiona de forma autónoma a través del dashboard proporcionado por Zamekly, abonando
              una cuota mensual por el acceso a la plataforma y el soporte técnico. Zamekly
              interviene ante averías graves que requieran actuación in situ.
            </li>
          </ul>
          <p>
            Las condiciones económicas específicas, el alcance del servicio y la modalidad elegida
            se detallarán en el contrato particular firmado entre las partes.
          </p>

          <h2>2. Condiciones de uso del servicio para usuarios finales</h2>
          <p>
            El usuario final que utilice las taquillas Zamekly acepta las siguientes condiciones
            en el momento de iniciar una sesión de uso:
          </p>
          <ul>
            <li>El usuario es mayor de 18 años o cuenta con autorización de su representante legal.</li>
            <li>El pago se realiza íntegramente en el momento de la reserva a través de los métodos habilitados en la pantalla táctil del bloque.</li>
            <li>El usuario es responsable del contenido que introduce en la taquilla. Zamekly no se responsabiliza de objetos olvidados más allá del aviso automatizado por IA al liberar la taquilla.</li>
            <li>Queda prohibido introducir objetos peligrosos, sustancias ilegales, líquidos corrosivos o cualquier material que pueda dañar el equipo o a terceros.</li>
            <li>El tiempo contratado es el único período garantizado. Pasado dicho tiempo, Zamekly puede proceder a liberar la taquilla previo aviso.</li>
          </ul>

          <h2>3. Obligaciones del Cliente (B2B)</h2>
          <ul>
            <li>Facilitar un espacio adecuado para la instalación del bloque, conforme a las especificaciones técnicas proporcionadas por Zamekly.</li>
            <li>No interferir en el funcionamiento del equipo ni modificar el hardware sin autorización expresa de Zamekly.</li>
            <li>Comunicar a Zamekly de forma inmediata cualquier incidencia, daño o anomalía detectada en el equipo.</li>
            <li>En el Modelo Compra, abonar puntualmente la cuota mensual de plataforma y soporte.</li>
          </ul>

          <h2>4. Obligaciones de Zamekly</h2>
          <ul>
            <li>Instalar el equipo conforme a los plazos y especificaciones acordados.</li>
            <li>Mantener el software actualizado y el sistema operativo en correcto funcionamiento.</li>
            <li>Ofrecer soporte técnico 24/7 para incidencias graves.</li>
            <li>Respetar la confidencialidad de la información del Cliente y de los usuarios finales conforme a la normativa de protección de datos.</li>
          </ul>

          <h2>5. Precios y facturación</h2>
          <p>
            Los precios aplicables son los acordados en el contrato particular. Zamekly se reserva
            el derecho a actualizar las tarifas de la cuota mensual con un preaviso mínimo de
            30 días. Las facturas se emitirán en los plazos acordados y serán abonadas mediante
            los medios de pago establecidos en el contrato.
          </p>

          <h2>6. Responsabilidad y limitación</h2>
          <p>
            Zamekly no será responsable de daños indirectos, pérdida de beneficios ni daños
            consecuenciales derivados del uso o imposibilidad de uso del servicio, salvo en
            casos de dolo o negligencia grave. La responsabilidad máxima de Zamekly frente
            al Cliente quedará limitada al importe abonado por este en los 12 meses anteriores
            al evento causante del daño.
          </p>

          <h2>7. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del sitio web (textos, diseños, logotipos, software) son
            propiedad de Zamekly o de sus licenciantes. Queda prohibida su reproducción,
            distribución o modificación sin autorización expresa y por escrito.
          </p>

          <h2>8. Duración y resolución del contrato</h2>
          <p>
            El contrato de servicio tendrá la duración pactada por las partes. Cualquiera de
            las partes podrá resolverlo por incumplimiento grave de la otra, previa notificación
            por escrito con el preaviso indicado en el contrato particular. En el Modelo Compra,
            la resolución no da derecho a reembolso de la cuota mensual en curso.
          </p>

          <h2>9. Legislación aplicable y jurisdicción</h2>
          <p>
            Los presentes Términos se rigen por la legislación española. Para cualquier
            controversia que pudiera surgir, las partes se someten, con renuncia a cualquier
            otro fuero, a los Juzgados y Tribunales de España.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Para cualquier consulta relativa a estos Términos, puede contactarnos en{" "}
            <a href="mailto:info@zamekly.com" className="text-brand-navy underline underline-offset-2">
              info@zamekly.com
            </a>.
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
