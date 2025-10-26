import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import StepWizard, { StepDefinition } from '@/components/StepWizard';
import ChoiceTile from '@/components/ChoiceTile';
import FormField from '@/components/FormField';
import { applicationSchema, ApplicationSchema } from '@/lib/schema';
import { formatPhone, normalizePhone } from '@/lib/format';
import { loadApplication, saveApplication, clearApplication } from '@/lib/storage';
import api from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { logAnalyticsEvent } from '@/lib/analytics';
import { buildPageMetadata } from '@/lib/seo';

const steps: StepDefinition[] & { fields: Array<keyof ApplicationSchema> }[] = [
  { id: 'business-type', title: 'Business type', fields: ['businessType'] },
  { id: 'amount', title: 'Amount & use', fields: ['amountRequested', 'useOfFunds'] },
  { id: 'time', title: 'Time in business', fields: ['startMonth', 'startYear', 'hasBusinessAccount'] },
  { id: 'details', title: 'Business details', fields: ['companyName', 'industry', 'monthlyRevenue', 'zipcode'] },
  { id: 'contact', title: 'Contact', fields: ['firstName', 'lastName', 'email', 'phone'] },
];

const defaultValues: ApplicationSchema = {
  businessType: 'llc',
  amountRequested: 10000,
  useOfFunds: 'working_capital',
  startMonth: '01',
  startYear: String(new Date().getFullYear()),
  hasBusinessAccount: true,
  companyName: '',
  industry: '',
  monthlyRevenue: 5000,
  zipcode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  honeypot: '',
  submissionStartedAt: Date.now(),
};

const businessTypes = [
  { value: 'sole_prop', label: 'Sole Prop' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llc', label: 'LLC' },
  { value: 's_corp', label: 'S-Corp' },
  { value: 'c_corp', label: 'C-Corp' },
] as const;

const useOptions = [
  { value: 'working_capital', label: 'Working capital' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hiring', label: 'Hiring' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'other', label: 'Other' },
] as const;

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const years = Array.from({ length: 40 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return { value: String(year), label: String(year) };
});

const applyMetadata = buildPageMetadata({
  title: 'Apply',
  description: "Complete RedHat Funding's streamlined funding application in just a few steps.",
  path: '/apply',
});

const applySuccessMetadata = buildPageMetadata({
  title: 'Application received',
  description:
    'Thanks for applying to RedHat Funding. A funding specialist will review your information and reach out within one business day.',
  path: '/apply',
});

const Apply = () => {
  const methods = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: loadApplication(defaultValues),
  });
  const { register, watch, setValue, trigger, formState, handleSubmit, reset } = methods;
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isComplete, setComplete] = useState(false);
  const { notify } = useToast();
  const submissionStart = useRef(Date.now());

  useEffect(() => {
    submissionStart.current = Date.now();
    setValue('submissionStartedAt', submissionStart.current, { shouldDirty: false });
  }, [setValue]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      saveApplication(value as ApplicationSchema);
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const values = watch();

  useEffect(() => {
    logAnalyticsEvent('form_step_view', { step: steps[currentStep].id });
  }, [currentStep]);

  const goToStep = useCallback(
    async (nextStep: number) => {
      if (nextStep === currentStep) return;
      if (nextStep > currentStep) {
        const fields = steps[currentStep].fields;
        const isValid = await trigger(fields);
        if (!isValid) {
          notify('Please complete required fields before continuing.', 'error');
          return;
        }
      }
      setCurrentStep(nextStep);
      logAnalyticsEvent('form_step_change', { from: steps[currentStep].id, to: steps[nextStep].id });
    },
    [currentStep, notify, trigger]
  );

  const handleNext = useCallback(async (event?: ReactMouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    if (currentStep === steps.length - 1) {
      return;
    }
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);
    if (!isValid) {
      notify('Please correct the highlighted fields.', 'error');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [currentStep, notify, trigger]);

  const handleBack = useCallback((event?: ReactMouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const onSubmit = useCallback(
    async (data: ApplicationSchema) => {
      const elapsed = Date.now() - (data.submissionStartedAt || submissionStart.current);
      if (data.honeypot) {
        notify('Submission failed. Please try again.', 'error');
        return;
      }
      if (elapsed < 2500) {
        notify('Please take a moment to review before submitting.', 'error');
        return;
      }
      try {
        setSubmitting(true);
        const response = await api.post('/api/leads', {
          ...data,
          phone: normalizePhone(data.phone),
        });
        notify('Thanks! A specialist will reach out shortly.');
        logAnalyticsEvent('application_submitted', { leadId: response.data.lead_id });
        setComplete(true);
        clearApplication();
        reset({ ...defaultValues, submissionStartedAt: Date.now(), phone: '', companyName: '', industry: '', zipcode: '', firstName: '', lastName: '', email: '' });
      } catch (error: unknown) {
        const message =
          typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string'
            ? (error as { message: string }).message
            : 'Something went wrong. Please try again.';
        notify(message, 'error');
        logAnalyticsEvent('application_error', { error });
      } finally {
        setSubmitting(false);
      }
    },
    [notify, reset]
  );

  const reviewItems = useMemo(
    () => [
      { label: 'Business type', value: businessTypes.find((item) => item.value === values.businessType)?.label, stepIndex: 0 },
      { label: 'Amount requested', value: `$${values.amountRequested.toLocaleString()}`, stepIndex: 1 },
      { label: 'Use of funds', value: useOptions.find((item) => item.value === values.useOfFunds)?.label, stepIndex: 1 },
      {
        label: 'Time in business',
        value: `${months.find((m) => m.value === values.startMonth)?.label} ${values.startYear}`,
        stepIndex: 2,
      },
      { label: 'Business checking', value: values.hasBusinessAccount ? 'Yes' : 'No', stepIndex: 2 },
      { label: 'Company', value: values.companyName, stepIndex: 3 },
      { label: 'Industry', value: values.industry, stepIndex: 3 },
      { label: 'Average monthly revenue', value: `$${values.monthlyRevenue.toLocaleString()}`, stepIndex: 3 },
      { label: 'ZIP code', value: values.zipcode, stepIndex: 3 },
      { label: 'Contact', value: `${values.firstName} ${values.lastName}`, stepIndex: 4 },
      { label: 'Email', value: values.email, stepIndex: 4 },
      { label: 'Phone', value: formatPhone(values.phone), stepIndex: 4 },
    ],
    [values]
  );

  if (isComplete) {
    return (
      <section className="bg-[#f9fafc] py-20">
        <Helmet>
          <title>{applySuccessMetadata.title}</title>
          <meta name="description" content={applySuccessMetadata.description} />
          <meta name="keywords" content={applySuccessMetadata.keywords.join(', ')} />
          <link rel="canonical" href={applySuccessMetadata.url} />
          <meta property="og:title" content={applySuccessMetadata.title} />
          <meta property="og:description" content={applySuccessMetadata.description} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={applySuccessMetadata.url} />
          <meta property="og:image" content={applySuccessMetadata.image} />
          <meta property="og:site_name" content={applySuccessMetadata.siteName} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={applySuccessMetadata.title} />
          <meta name="twitter:description" content={applySuccessMetadata.description} />
          <meta name="twitter:image" content={applySuccessMetadata.image} />
        </Helmet>
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl border border-line bg-white p-12 text-center shadow-lift">
          <h1 className="text-3xl font-bold text-ink">Thanks! Your application is in.</h1>
          <p className="mt-4 text-muted">
            A funding specialist will review your information and reach out within one business day.
          </p>
          <button
            type="button"
            onClick={() => setComplete(false)}
            className="btn-primary mt-8"
          >
            Submit another application
          </button>
        </div>
      </section>
    );
  }

  const stepHasErrors = steps[currentStep].fields.some((field) => Boolean(formState.errors[field]));
  const stepHasValues = steps[currentStep].fields.every((field) => {
    const value = values[field];
    if (typeof value === 'boolean') return true;
    if (typeof value === 'number') return value >= 0;
    return value !== undefined && value !== null && String(value).trim().length > 0;
  });
  const canProceed = !stepHasErrors && stepHasValues;

  return (
    <section className="bg-[#f9fafc] py-12">
      <Helmet>
        <title>{applyMetadata.title}</title>
        <meta name="description" content={applyMetadata.description} />
        <meta name="keywords" content={applyMetadata.keywords.join(', ')} />
        <link rel="canonical" href={applyMetadata.url} />
        <meta property="og:title" content={applyMetadata.title} />
        <meta property="og:description" content={applyMetadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={applyMetadata.url} />
        <meta property="og:image" content={applyMetadata.image} />
        <meta property="og:site_name" content={applyMetadata.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={applyMetadata.title} />
        <meta name="twitter:description" content={applyMetadata.description} />
        <meta name="twitter:image" content={applyMetadata.image} />
      </Helmet>
      <div className="px-4 sm:px-6">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <StepWizard
              steps={steps}
              currentStep={currentStep}
              onStepChange={goToStep}
              onBack={handleBack}
              onNext={currentStep === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}
              isNextDisabled={!canProceed || formState.isSubmitting || isSubmitting}
              isSubmitting={isSubmitting}
              nextLabel={currentStep === steps.length - 1 ? 'Submit application' : 'Next'}
            >
              <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                  {currentStep === 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {businessTypes.map((option) => (
                        <ChoiceTile
                          key={option.value}
                          selected={values.businessType === option.value}
                          onClick={() => setValue('businessType', option.value, { shouldValidate: true })}
                        >
                          <span className="text-xl font-semibold text-ink">{option.label}</span>
                          <span className="text-sm text-muted">
                            {option.value === 'sole_prop' ? 'Operate as the owner without formal incorporation.' : 'A registered business entity.'}
                          </span>
                        </ChoiceTile>
                      ))}
                    </div>
                  )}

                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <FormField
                        label="How much capital are you seeking?"
                        htmlFor="amountRequested"
                        required
                        error={formState.errors.amountRequested?.message}
                      >
                        <input
                          id="amountRequested"
                          type="number"
                          inputMode="numeric"
                          step={500}
                          min={1000}
                          className="w-full rounded-3xl border border-line px-4 py-3 text-lg font-semibold text-ink focus:border-brand"
                          {...register('amountRequested', { valueAsNumber: true })}
                        />
                      </FormField>
                      <FormField
                        label="How will you use the funds?"
                        htmlFor="useOfFunds"
                        required
                        error={formState.errors.useOfFunds?.message}
                      >
                        <select
                          id="useOfFunds"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('useOfFunds')}
                        >
                          {useOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormField>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          label="When did you start the business?"
                          htmlFor="startMonth"
                          required
                          error={formState.errors.startMonth?.message}
                        >
                          <select
                            id="startMonth"
                            className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                            {...register('startMonth')}
                          >
                            {months.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormField>
                        <FormField label=" " htmlFor="startYear" required error={formState.errors.startYear?.message}>
                          <select
                            id="startYear"
                            className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                            {...register('startYear')}
                          >
                            {years.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormField>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {[true, false].map((value) => (
                          <ChoiceTile
                            key={String(value)}
                            selected={values.hasBusinessAccount === value}
                            onClick={() => setValue('hasBusinessAccount', value, { shouldValidate: true })}
                          >
                            <span className="text-xl font-semibold text-ink">{value ? 'Yes' : 'No'}</span>
                            <span className="text-sm text-muted">I have a dedicated business checking account.</span>
                          </ChoiceTile>
                        ))}
                      </div>
                      {formState.errors.hasBusinessAccount && (
                        <p className="text-sm text-error">Select whether you have a business checking account.</p>
                      )}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid gap-6">
                      <FormField
                        label="Legal business name"
                        htmlFor="companyName"
                        required
                        error={formState.errors.companyName?.message}
                      >
                        <input
                          id="companyName"
                          type="text"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('companyName')}
                        />
                      </FormField>
                      <FormField label="Industry" htmlFor="industry" required error={formState.errors.industry?.message}>
                        <input
                          id="industry"
                          type="text"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('industry')}
                        />
                      </FormField>
                      <FormField
                        label="Average monthly revenue"
                        htmlFor="monthlyRevenue"
                        required
                        error={formState.errors.monthlyRevenue?.message}
                      >
                        <input
                          id="monthlyRevenue"
                          type="number"
                          inputMode="numeric"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('monthlyRevenue', { valueAsNumber: true })}
                        />
                      </FormField>
                      <FormField label="Business ZIP" htmlFor="zipcode" required error={formState.errors.zipcode?.message}>
                        <input
                          id="zipcode"
                          inputMode="numeric"
                          maxLength={5}
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('zipcode')}
                          value={values.zipcode}
                          onChange={(event) =>
                            setValue('zipcode', event.target.value.replace(/[^\d]/g, ''), {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                        />
                      </FormField>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="grid gap-6">
                      <FormField label="First name" htmlFor="firstName" required error={formState.errors.firstName?.message}>
                        <input
                          id="firstName"
                          type="text"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('firstName')}
                        />
                      </FormField>
                      <FormField label="Last name" htmlFor="lastName" required error={formState.errors.lastName?.message}>
                        <input
                          id="lastName"
                          type="text"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('lastName')}
                        />
                      </FormField>
                      <FormField label="Email" htmlFor="email" required error={formState.errors.email?.message}>
                        <input
                          id="email"
                          type="email"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          {...register('email')}
                        />
                      </FormField>
                      <FormField label="Phone" htmlFor="phone" required error={formState.errors.phone?.message}>
                        <input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          className="w-full rounded-3xl border border-line px-4 py-3 text-base text-ink focus:border-brand"
                          value={formatPhone(values.phone)}
                          onChange={(event) => setValue('phone', normalizePhone(event.target.value), { shouldValidate: true })}
                        />
                      </FormField>
                      <input type="hidden" aria-hidden {...register('honeypot')} />
                      <input type="hidden" value={submissionStart.current} {...register('submissionStartedAt', { valueAsNumber: true })} />
                    </div>
                  )}
                </div>
                <aside className="space-y-4">
                  <div className="rounded-3xl border border-line bg-[#fdf7f7] p-6">
                    <h2 className="text-lg font-semibold text-ink">Review your answers</h2>
                    <ul className="mt-4 space-y-3 text-sm text-muted">
                      {reviewItems.map((item) => (
                        <li key={item.label} className="flex flex-col">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-ink">{item.label}</span>
                            <button
                              type="button"
                              className="text-xs font-semibold text-brand hover:underline"
                              onClick={() => goToStep(item.stepIndex)}
                            >
                              Edit
                            </button>
                          </div>
                          <span>{item.value || '—'}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border border-line bg-white p-6 text-sm text-muted">
                    <p>
                      By submitting, you agree to be contacted by RedHat Funding and its lending partners via phone, SMS, and email.
                    </p>
                  </div>
                </aside>
              </div>
            </StepWizard>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default Apply;
