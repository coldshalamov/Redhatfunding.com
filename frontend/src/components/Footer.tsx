import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p className="font-semibold text-ink">© {new Date().getFullYear()} RedHat Funding. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-ink">
            Terms
          </Link>
          <a href="mailto:info@redhatfunding.com" className="hover:text-ink">
            info@redhatfunding.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
