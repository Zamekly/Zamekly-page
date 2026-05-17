import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#por-que-zamekly", label: "Por qué Zamekly" },
  { href: "#modelos", label: "Modelos" },
  { href: "#donde-instalamos", label: "Dónde instalamos" },
  { href: "#contacto", label: "Contacto" },
];

const LEGAL_LINKS = [
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Política de cookies" },
  { href: "/terminos", label: "Términos y condiciones" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Logo />
            <p className="mt-1 text-xs text-slate-500">
              Taquillas inteligentes modulares
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-8 gap-y-2 sm:justify-end">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 transition-colors hover:text-brand-navy"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-slate-400">
              © 2026 Zamekly. Todos los derechos reservados.
            </p>
            <a
              href="mailto:info@zamekly.com"
              className="text-xs text-slate-400 transition-colors hover:text-brand-navy"
            >
              info@zamekly.com
            </a>
          </div>
          {/* Legal links */}
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 sm:justify-start">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-400 transition-colors hover:text-brand-navy"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
