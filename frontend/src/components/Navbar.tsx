import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#benefits', label: 'Benefits' },
  { to: '/#faq', label: 'FAQs' },
  { to: '/apply', label: 'Apply' },
];

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
      'a, button'
    );

    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key === 'Tab' && focusableElements && focusableElements.length) {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand">
          <span aria-hidden className="h-8 w-8 rounded-full bg-brand/10" />
          RedHat Funding
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm font-medium text-muted md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-ink ${isActive ? 'text-ink' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/apply" className="btn-primary hidden md:inline-flex" aria-label="Apply in 2 minutes">
          Apply Now
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md border border-line bg-white p-2 text-ink shadow-sm transition hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            )}
          </svg>
        </button>
        <div
          ref={menuRef}
          id="mobile-navigation"
          className={`absolute inset-x-0 top-full mt-2 origin-top rounded-lg border border-line bg-white p-4 shadow-lg transition-all duration-200 md:hidden ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <nav aria-label="Mobile" className="flex flex-col gap-3 text-sm font-medium text-ink">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded px-2 py-1 transition hover:bg-surface hover:text-ink ${
                    isActive ? 'bg-surface text-ink' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/apply"
            className="btn-primary mt-4 w-full justify-center"
            aria-label="Apply in 2 minutes"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
