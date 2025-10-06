import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center">
      <div className="flex-1">
        <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
          2-minute application
        </span>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
          Flexible funding to keep your business moving.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted">
          Join thousands of owners who secure capital through RedHat Funding. One simple application,
          transparent offers, and a specialist by your side the entire way.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link to="/apply" className="btn-primary" aria-label="Start application">
            Apply in 2 Minutes
          </Link>
          <a href="#how-it-works" className="inline-flex items-center justify-center rounded-3xl border border-line bg-white px-6 py-3 font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift">
            How it works
          </a>
        </div>
      </div>
      <div className="flex-1">
        <div className="rounded-3xl border border-line bg-[#fef3f2] p-8 shadow-lift">
          <h2 className="text-xl font-semibold text-ink">Why businesses choose us</h2>
          <ul className="mt-6 space-y-4 text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
              <span>Same-day offers from a national partner network.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
              <span>Dedicated specialists who understand your industry.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brand" aria-hidden />
              <span>Transparent terms, no obligation to accept.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
