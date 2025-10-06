const steps = [
  {
    title: 'Apply in minutes',
    description: 'Tell us about your business goals in a streamlined, mobile-first application.',
  },
  {
    title: 'Review personalized offers',
    description: 'We pair you with lending partners who match your needs and timeline.',
  },
  {
    title: 'Fund with confidence',
    description: 'Sign electronically and access capital in as little as 24 hours.',
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-[#f9fafc] py-20">
    <div className="mx-auto w-full max-w-6xl px-6">
      <h2 className="text-center text-3xl font-bold text-ink sm:text-4xl">How it works</h2>
      <p className="mt-4 text-center text-muted">
        A guided experience keeps everything clear. We call it the two-minute application.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="tile h-full">
            <span className="text-sm font-semibold uppercase text-brand">Step {index + 1}</span>
            <h3 className="mt-4 text-2xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-3 text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
