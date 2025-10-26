import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Benefit = {
  key: string;
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
};

const benefits: Benefit[] = [
  {
    key: 'speed',
    eyebrow: 'Speed',
    title: (
      <>
        We move at <span className="text-brand">your speed</span>
      </>
    ),
    description: (
      <>
        <span className="font-semibold text-brand">Same-day approvals</span> and{' '}
        <span className="font-semibold text-brand">next-day funding</span> keep you ahead of every opportunity.
      </>
    ),
  },
  {
    key: 'capital',
    eyebrow: 'Capital Access',
    title: (
      <>
        Private funding, <span className="text-brand">no gatekeepers</span>
      </>
    ),
    description: (
      <>
        Skip the banks. We connect you directly to agile private capital built around small business reality.
      </>
    ),
  },
  {
    key: 'cashflow',
    eyebrow: 'Underwriting',
    title: (
      <>
        <span className="text-brand">Cashflow</span> &gt; credit score
      </>
    ),
    description: (
      <>
        Daily revenue tells the real story. If you&apos;re generating cash, we help you scale it responsibly.
      </>
    ),
  },
  {
    key: 'loyalty',
    eyebrow: 'Loyalty Pricing',
    title: (
      <>
        Earn <span className="text-brand">better rates</span> over time
      </>
    ),
    description: (
      <>
        Keep payments on track to unlock lower factors, longer terms, and expanded lines with every renewal.
      </>
    ),
  },
  {
    key: 'ownership',
    eyebrow: 'Ownership',
    title: (
      <>
        Growth without <span className="text-brand">dilution</span>
      </>
    ),
    description: (
      <>
        Think VC-level support, but you keep 100% ownership. No board seats, no equity strings attached.
      </>
    ),
  },
  {
    key: 'strategy',
    eyebrow: 'Advisory',
    title: (
      <>
        Strategic funding <span className="text-brand">management</span>
      </>
    ),
    description: (
      <>
        Specialists structure each round so today&apos;s capital sets up the next phase of growth on your terms.
      </>
    ),
  },
];

const Benefits = () => (
  <section id="benefits" className="bg-white py-20">
    <div className="mx-auto w-full max-w-6xl px-6">
      <span className="inline-flex items-center rounded-full bg-brand/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
        VC without the strings
      </span>
      <h2 className="mt-6 text-3xl font-bold text-ink sm:text-4xl lg:text-[2.85rem]">
        Why businesses choose <span className="text-brand">RedHat Funding</span>
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Aggressive by design: velocity, private capital, and strategic guidance engineered to double down on what&apos;s already
        working inside your business.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit) => (
          <article
            key={benefit.key}
            className="group relative overflow-hidden rounded-3xl border border-line/80 bg-white/95 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/0 via-brand/5 to-brand/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden
            />
            <div className="relative flex h-full flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-brand/70">
                {benefit.eyebrow}
              </span>
              <h3 className="text-2xl font-semibold leading-snug text-ink">{benefit.title}</h3>
              <p className="text-muted">{benefit.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          to="/apply"
          className="inline-flex items-center justify-center rounded-3xl bg-brand px-8 py-3 text-base font-semibold text-white shadow-lift transition hover:-translate-y-1 hover:shadow-2xl"
        >
          Launch your funding request
        </Link>
      </div>
    </div>
  </section>
);

export default Benefits;




