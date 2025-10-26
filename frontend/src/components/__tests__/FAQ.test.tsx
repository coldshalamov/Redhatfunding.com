import { cleanup, render, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, describe, expect, it } from 'vitest';
import FAQ from '../FAQ';

afterEach(() => {
  cleanup();
  document
    .head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((node) => node.parentElement?.removeChild(node));
});

describe('FAQ', () => {
  it('injects FAQPage structured data with all questions and answers', async () => {
    render(
      <HelmetProvider>
        <FAQ />
      </HelmetProvider>
    );

    const script = await waitFor(() => {
      const jsonLd = document.head.querySelector('script[type="application/ld+json"]');
      expect(jsonLd).not.toBeNull();
      return jsonLd as HTMLScriptElement;
    });

    const parsed = JSON.parse(script.textContent ?? '{}');

    expect(parsed['@context']).toBe('https://schema.org');
    expect(parsed['@type']).toBe('FAQPage');
    expect(Array.isArray(parsed.mainEntity)).toBe(true);
    expect(parsed.mainEntity).toHaveLength(3);
    expect(parsed.mainEntity[0]).toMatchObject({
      '@type': 'Question',
      name: 'How fast can I get funding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most applicants receive offers within 24 hours of submitting a complete application.',
      },
    });
  });
});
