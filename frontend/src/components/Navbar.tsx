import type { MouseEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (!item.hash) {
      return;
    }
    event.preventDefault();
    const isOnTargetPage = location.pathname === item.path;
    if (!isOnTargetPage) {
      navigate(item.path);
      setTimeout(() => scrollToHash(item.hash), 150);
    } else {
      scrollToHash(item.hash);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-ink">
          <img
            src="/img/chatgpt-image-oct-15-2025.png"
            srcSet="/img/chatgpt-image-oct-15-2025.png 1x, /img/chatgpt-image-oct-15-2025.png 2x"
            alt="RedHat Funding Logo"
            width={256}
            height={256}
            decoding="async"
            fetchPriority="high"
            className="h-16 w-auto align-middle"
          />
          <span>
            <span className="text-red-600">RedHat</span> Funding
          </span>
        </Link>
        <nav aria-label="Primary" className="hidden gap-6 text-sm font-medium text-muted md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.hash ? `${item.path}#${item.hash}` : item.path}
              onClick={(event) => handleNavClick(event, item)}
              className={({ isActive }) => `transition hover:text-ink ${isActive ? "text-ink" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/apply" className="btn-primary hidden md:inline-flex" aria-label="Apply in 2 minutes">
          Apply Now
        </Link>
      </div>
    </header>
  );
};

export default Navbar;



