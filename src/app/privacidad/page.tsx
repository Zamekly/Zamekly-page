import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Política de privacidad | Zamekly",
  description: "Información sobre el tratamiento de datos personales por parte de Zamekly.",
};

export default function Privacidad() {
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
          Política de privacidad
        </h1>
        <p className="mt-2 text-sm text-slate-500">Última actualización: enero de 2026</p>

        <div className="prose prose-slate mt-10 max-w-none text-slate-700 [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-brand-navy [&_p]:leading-relaxed [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:text-sm [&_p]:text-sm">

          <p>
            En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo
            (RGPD) y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos
            Personales y garantía de los derechos digitales (LOPDGDD), Zamekly le informa sobre
            el tratamiento de sus datos personales.
          </p>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            <strong>Razón social:</strong> Zamekly<br />
            <strong>Correo electrónico:</strong> info@zamekly.com<br />
            <strong>Actividad:</strong> Fabricación, instalación y operación de sistemas de taquillas inteligentes modulares.
          </p>

          <h2>2. Datos que recogemos y con qué finalidad</h2>
          <p>Zamekly trata datos personales en dos contextos distintos:</p>

          <p><strong>a) Usuarios finales de las taquillas</strong></p>
          <ul>
            <li>Datos de pago (procesados de forma segura a través de pasarelas certificadas PCI-DSS; Zamekly no almacena datos de tarjeta).</li>
            <li>Datos de uso: número de taquilla, hora de inicio y fin del alquiler, importe.</li>
            <li>Imágenes del interior de la taquilla captadas por la cámara interna, utilizadas exclusivamente para detectar objetos olvidados mediante inteligencia artificial. Las imágenes se eliminan automáticamente al finalizar cada sesión de uso.</li>
          </ul>
          <p>Base jurídica: ejecución de un contrato (uso del servicio) y obligación legal (conservación de registros de transacciones).</p>

          <p><strong>b) Clientes y contactos comerciales (B2B)</strong></p>
          <ul>
            <li>Nombre, correo electrónico, teléfono y datos de la empresa, recogidos a través del formulario de contacto del sitio web o por correo electrónico.</li>
            <li>Datos necesarios para la formalización y gestión del contrato de instalación o colaboración.</li>
          </ul>
          <p>Base jurídica: interés legítimo (atención de consultas comerciales) y ejecución del contrato.</p>

          <h2>3. Conservación de los datos</h2>
          <ul>
            <li>Datos de transacciones de las taquillas: 5 años, conforme a la normativa fiscal y mercantil.</li>
            <li>Imágenes del interior de la taquilla: eliminación inmediata al liberar la taquilla.</li>
            <li>Datos de contacto comercial: mientras dure la relación y hasta 3 años después de la última comunicación.</li>
          </ul>

          <h2>4. Cesión de datos a terceros</h2>
          <p>
            Zamekly no cede datos personales a terceros salvo obligación legal. Los datos de pago
            son procesados por pasarelas de pago externas que actúan como encargados del
            tratamiento bajo acuerdo de confidencialidad. Podemos utilizar proveedores de
            servicios en la nube para alojar datos, siempre con garantías adecuadas conforme
            al RGPD.
          </p>

          <h2>5. Derechos del interesado</h2>
          <p>Puede ejercer en cualquier momento los siguientes derechos:</p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos tratamos sobre usted.</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de sus datos cuando no sean necesarios.</li>
            <li><strong>Oposición y limitación:</strong> oponerse al tratamiento o solicitar su limitación.</li>
            <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado.</li>
          </ul>
          <p>
            Para ejercer estos derechos, envíe un correo a{" "}
            <a href="mailto:info@zamekly.com" className="text-brand-navy underline underline-offset-2">
              info@zamekly.com
            </a>{" "}
            indicando el derecho que desea ejercer y adjuntando una copia de su documento de identidad.
            También puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
          </p>

          <h2>6. Seguridad</h2>
          <p>
            Zamekly aplica medidas técnicas y organizativas apropiadas para garantizar un nivel
            de seguridad adecuado al riesgo, incluyendo cifrado de comunicaciones (HTTPS),
            control de acceso a sistemas y revisiones periódicas de seguridad.
          </p>

          <h2>7. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política para reflejar cambios en nuestras prácticas o en
            la normativa aplicable. La versión vigente estará siempre disponible en esta página
            con la fecha de última actualización.
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
