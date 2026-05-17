import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#por-que", label: "Por qué Zamekly" },
  { href: "#donde", label: "Dónde instalamos" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Principal"
      >
        <Link href="/" aria-label="Zamekly · Inicio" className="shrink-0">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-navy"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/empleados"
          className="inline-flex items-center rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-navy-soft"
        >
          Acceso socios
        </a>
      </nav>
    </header>
  );
}
