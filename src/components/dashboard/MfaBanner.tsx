"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function MfaBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.mfa.listFactors();
      const hasVerified = data?.totp?.some((f) => f.status === "verified");
      setShow(!hasVerified);
    }
    check();
  }, [pathname]);

  if (!show) return null;

  return (
    <div className="mx-6 mt-4 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700/40 dark:bg-amber-900/20">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 text-amber-500" aria-hidden>
          <path d="M10 3L2 16h16L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="14" r="0.75" fill="currentColor" />
        </svg>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Por seguridad</strong>, activa la verificación en dos pasos en tu cuenta.
        </p>
      </div>
      <Link
        href="/dashboard/configuracion"
        className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
      >
        Activar ahora
      </Link>
    </div>
  );
}
