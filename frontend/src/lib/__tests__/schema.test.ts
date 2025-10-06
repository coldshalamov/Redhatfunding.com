import { describe, expect, it } from 'vitest';
import { applicationSchema } from '../schema';

describe('applicationSchema', () => {
  it('validates a complete payload', () => {
    const payload = {
      businessType: 'llc',
      amountRequested: 20000,
      useOfFunds: 'working_capital',
      startMonth: '01',
      startYear: '2020',
      hasBusinessAccount: true,
      companyName: 'RedHat Funding',
      industry: 'Finance',
      monthlyRevenue: 50000,
      zipcode: '33101',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '3055551234',
    };

    expect(() => applicationSchema.parse(payload)).not.toThrow();
  });

  it('throws when amount is below minimum', () => {
    expect(() =>
      applicationSchema.parse({
        businessType: 'llc',
        amountRequested: 500,
        useOfFunds: 'working_capital',
        startMonth: '01',
        startYear: '2020',
        hasBusinessAccount: true,
        companyName: 'RedHat Funding',
        industry: 'Finance',
        monthlyRevenue: 50000,
        zipcode: '33101',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '3055551234',
      })
    ).toThrow();
  });
});
