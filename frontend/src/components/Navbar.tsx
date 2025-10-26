// frontend/src/components/Navbar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

type NavItem = {
  label: string;
  path: string;
  hash?: string;
};

const navItems: NavItem[] = [
  { path: "/", hash: "how-it-works", label: "How it works" },
  { path: "/", hash: "benefits", label: "Benefits" },
  { path: "/", hash: "faq", label: "FAQs" },
  { path: "/apply", label: "Apply" },
];

const scrollToHash = (hash?: string) => {
  if (!hash) return;
  requestAnimationFrame(() => {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const Navbar = () => {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return true;
    return !window.matchMedia("(min-width: 768px)").matches;
  });

  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const mobileMenuId = "mobile-menu";

  const mql = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return null;
    return window.matchMedia("(min-width: 768px)");
  }, []);

  // Keep isMobile in sync and close menu on switch to desktop
  useEffect(() => {
    if (!mql) return;
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const nowMobile = !("matches" in e ? e.matches : (e as MediaQueryList).matches);
      setIsMobile(nowMobile);
      if (!nowMobile) {
        // We are at/above md — ensure menu is closed and any traps removed
        setIsMenuOpen(false);
      }
    };

    // Initial sync (for older browsers, MediaQueryList doesn't emit immediately)
    handleChange(mql);

    // Modern and legacy listeners
    const mqList: any = mql as any;
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handleChange as (ev: MediaQueryListEvent) => void);
      return () => mql.removeEventListener("change", handleChange as (ev: MediaQueryListEvent) => void);
    } else if (typeof mqList.addListener === "function") {
      mqList.addListener(handleChange);
      return () => mqList.removeListener(handleChange);
    }
  }, [mql]);

  // Close the mobile menu on route changes
  useEffect(() => {
    setIsMenuOpen(false);
    // If the current route corresponds to a hash scroll section, honor it
    // (Your routes use `hash` stored in navItems, so we primarily scroll on click handler below.)
  }, [location.pathname, location.search, location.hash]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (!isMobile) return; // only lock on mobile layouts
    const original = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = original || "";
    }
    return () => {
      document.body.style.overflow = original || "";
    };
  }, [isMenuOpen, isMobile]);

  // Focus trap only when the mobile menu is open AND we are on mobile layout
  useEffect(() => {
    if (!isMenuOpen || !isMobile) return;

    const container = menuRef.current;
    const toggleBtn = toggleRef.current;

    const focusables = () => {
      if (!container) return [] as HTMLElement[];
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );
    };

    // Move initial focus to first focusable within the menu
    const els = focusables();
    if (els.length) {
      els[0].focus();
    } else {
      // Fallback to the toggle so keyboard users aren't stranded
      toggleBtn?.focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isMenuOpen) return;
      if (!isMobile) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsMenuOpen(false);
        toggleBtn?.focus();
        return;
      }

      if (e.key === "Tab") {
        const list = focusables();
        if (list.length === 0) return;

        const first = list[0];
        const last = list[list.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container?.contains(document.activeElement)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last || !container?.contains(document.activeElement)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen, isMobile]);

  // Click outside to close (mobile only)
  useEffect(() => {
    if (!isMenuOpen || !isMobile) return;

    const onClick = (e: MouseEvent | globalThis.MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !toggleRef.current?.contains(target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick as any);
    return () => {
      document.removeEventListener("mousedown", onClick as any);
    };
  }, [isMenuOpen, isMobile]);

  const handleToggle = () => setIsMenuOpen((v) => !v);

  const handleNavClick = (e: MouseEvent, item: NavItem) => {
    // If we're already on the route and the item has a hash, prevent navigation and smooth scroll
    if (item.hash && location.pathname === item.path) {
      e.preventDefault();
      scrollToHash(item.hash);
    }
    // Close menu after any navigation action (mobile)
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between" aria-label="Main">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded-lg bg-black text-white grid place-items-center font-bold">
              RH
            </span>
            <span className="font-semibold">RedHat Funding</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems
              .filter((n) => n.label !== "Apply")
              .map((item) => {
                const to = item.hash ? item.path : item.path;
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    onClick={(e) => handleNavClick(e as unknown as MouseEvent, item)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition hover:text-black ${
                        isActive && !item.hash ? "text-black" : "text-gray-600"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}

            {/* Desktop Apply CTA */}
            <Link
              to="/apply"
              className="inline-flex items-center rounded-xl border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Apply
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            aria-controls={mobileMenuId}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            onClick={handleToggle}
          >
            {/* Simple hamburger / close */}
            <span className="sr-only">Open main menu</span>
            <svg
              className={`h-5 w-5 ${isMenuOpen ? "hidden" : "block"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`h-5 w-5 ${isMenuOpen ? "block" : "hidden"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile dropdown (animated) */}
      <div
        id={mobileMenuId}
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out
          ${isMenuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-2">
            {navItems
              .filter((n) => n.label !== "Apply")
              .map((item) => {
                const to = item.path;
                return (
                  <NavLink
                    key={item.label}
                    to={to}
                    onClick={(e) => handleNavClick(e as unknown as MouseEvent, item)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            <Link
              to="/apply"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Apply
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
