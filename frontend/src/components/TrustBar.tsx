const logos = ['Forbes', 'CNBC', 'Inc.', 'Fast Company', 'Entrepreneur'];

const TrustBar = () => (
  <section className="border-y border-line bg-[#f9fafc]">
    <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-8 text-sm font-semibold uppercase tracking-wide text-muted">
      {logos.map((logo) => (
        <span key={logo} className="opacity-80">
          {logo}
        </span>
      ))}
    </div>
  </section>
);

export default TrustBar;
