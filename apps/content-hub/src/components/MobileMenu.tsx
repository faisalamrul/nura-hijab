import { useState, useEffect } from "react";

type NavLink = { label: string; href: string; sale?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: "Hijab", href: "#" },
  { label: "Pakaian", href: "#" },
  { label: "Aksesoris", href: "#" },
  { label: "Sale", href: "#", sale: true },
  { label: "Lookbook", href: "#" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Buka menu"
        aria-expanded={open}
        className="md:hidden flex items-center justify-center w-9 h-9 text-ink"
      >
        <svg
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
      </button>

      {/* Full-screen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        className={`fixed inset-0 z-[100] bg-jet flex flex-col items-center justify-center transition-opacity duration-300 ease-out ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Brand in overlay */}
        <span className="font-heading text-white text-[1.35rem] tracking-[0.4em] font-light absolute top-5 left-6">
          NURA
        </span>

        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
          className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation links */}
        <nav className="flex flex-col items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`font-heading font-light transition-colors duration-200 ${
                link.sale
                  ? "text-red-400 hover:text-red-300"
                  : "text-white hover:text-silver"
              }`}
              style={{ fontSize: "clamp(2rem, 8vw, 3rem)", letterSpacing: "0.15em" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social links at bottom */}
        <div className="absolute bottom-10 flex gap-10">
          {["Instagram", "TikTok", "Pinterest"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-white/35 text-[10px] tracking-[0.25em] uppercase hover:text-white/70 transition-colors duration-200"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
