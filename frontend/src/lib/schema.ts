import { z } from 'zod';

export const applicationSchema = z.object({
  businessType: z.enum(['sole_prop', 'partnership', 'llc', 's_corp', 'c_corp'], {
    required_error: 'Select your business type',
  }),
  amountRequested: z.number().min(1000, 'Amount must be at least $1,000'),
  useOfFunds: z.enum(['working_capital', 'inventory', 'marketing', 'hiring', 'equipment', 'other'], {
    required_error: 'Select how you plan to use funds',
  }),
  startMonth: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Enter month as MM'),
  startYear: z.string().regex(/^\d{4}$/, 'Enter year as YYYY'),
  hasBusinessAccount: z.boolean(),
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  monthlyRevenue: z.number().min(0, 'Revenue must be positive'),
  zipcode: z.string().regex(/^\d{5}$/, 'Enter a valid 5-digit ZIP code'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid phone number'),
  honeypot: z.string().optional(),
  submissionStartedAt: z.number().optional(),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
