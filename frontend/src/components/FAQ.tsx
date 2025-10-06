import { useState } from 'react';

const faqs = [
  {
    question: 'How fast can I get funding?',
    answer: 'Most applicants receive offers within 24 hours of submitting a complete application.',
  },
  {
    question: 'What credit score do I need?',
    answer: 'We partner with lenders who can work with a range of credit profiles. Our team will help position your application for success.',
  },
  {
    question: 'Is there any obligation to accept an offer?',
    answer: 'Never. Reviewing offers is free, and you only proceed when you are ready.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto w-full max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold text-ink sm:text-4xl">Frequently asked questions</h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left text-lg font-semibold text-ink"
                  aria-expanded={isOpen}
                >
                  {faq.question}
                  <span aria-hidden>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="mt-4 text-muted">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
