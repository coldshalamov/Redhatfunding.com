import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#benefits', label: 'Benefits' },
  { to: '/#faq', label: 'FAQs' },
  { to: '/apply', label: 'Apply' },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
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
      </div>
    </header>
  );
};

export default Navbar;
