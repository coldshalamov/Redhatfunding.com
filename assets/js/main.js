document.addEventListener('DOMContentLoaded', () => {
  const applyLinks = document.querySelectorAll('a[href*="#apply"]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  applyLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const targetId = href.slice(hashIndex + 1);
      const target = document.getElementById(targetId);
      if (!target) return;

      if (href.startsWith('#') || href.startsWith(window.location.pathname)) {
        event.preventDefault();
      }

      const topOffset = target.getBoundingClientRect().top + window.pageYOffset - 80;
      if (prefersReducedMotion) {
        window.scrollTo(0, topOffset);
      } else {
        window.scrollTo({
          top: topOffset,
          behavior: 'smooth',
        });
      }
    });
  });

  const fundingForm = document.querySelector('#fundingForm');
  const formBanner = document.querySelector('#formspreeBanner');

  if (fundingForm) {
    const action = fundingForm.getAttribute('action') || '';
    const isPlaceholder = action.includes('your-id-here') || action.trim() === '';

    if (isPlaceholder) {
      if (formBanner) {
        formBanner.classList.remove('d-none');
      }
      fundingForm.querySelectorAll('input, select, textarea, button').forEach((field) => {
        field.setAttribute('disabled', 'disabled');
      });
    }

    fundingForm.addEventListener('submit', (event) => {
      if (!fundingForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      fundingForm.classList.add('was-validated');
    });

    fundingForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        if (fundingForm.classList.contains('was-validated')) {
          field.classList.toggle('is-invalid', !field.checkValidity());
        }
      });
    });
  }
});
