const benefits = [
  {
    title: 'Tailored capital',
    description: 'Access lines of credit, MCA, equipment financing, and more through one application.',
  },
  {
    title: 'Transparent terms',
    description: 'No hidden fees. Understand your rates and repayment before you sign.',
  },
  {
    title: 'Dedicated specialist',
    description: 'Work with a funding expert who advocates for your business.',
  },
];

const Benefits = () => (
  <section id="benefits" className="bg-white py-20">
    <div className="mx-auto w-full max-w-6xl px-6">
      <h2 className="text-center text-3xl font-bold text-ink sm:text-4xl">Built for growing businesses</h2>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {benefits.map((benefit) => (
          <article key={benefit.title} className="tile h-full">
            <h3 className="text-2xl font-semibold text-ink">{benefit.title}</h3>
            <p className="mt-3 text-muted">{benefit.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
