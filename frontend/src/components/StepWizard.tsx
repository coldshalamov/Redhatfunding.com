import { ReactNode, MouseEvent } from 'react';
import ProgressBar from './ProgressBar';

export interface StepDefinition {
  id: string;
  title: string;
  description?: string;
}

interface StepWizardProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepChange?: (index: number) => void;
  children: ReactNode;
  onNext?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  onBack?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  backLabel?: string;
}

const StepWizard = ({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onBack,
  isNextDisabled,
  isSubmitting,
  nextLabel = 'Next',
  backLabel = 'Back',
}: StepWizardProps) => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Funding application</h1>
            <p className="text-sm text-muted">We use your answers to match you with the right partners.</p>
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        </div>
        <ol className="grid grid-cols-2 gap-2 text-sm font-medium text-muted sm:grid-cols-5 sm:gap-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            return (
              <li key={step.id}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-3xl border px-3 py-2 text-left transition ${
                    isActive ? 'border-brand bg-brand/5 text-ink' : 'border-transparent hover:border-line'
                  }`}
                  onClick={() => onStepChange?.(index)}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isActive ? 'bg-brand text-white' : 'bg-line text-muted'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <div>{children}</div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={currentStep === 0}
          className="inline-flex items-center justify-center rounded-3xl border border-line px-6 py-3 font-semibold text-ink transition hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50"
        >
          {backLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="inline-flex items-center justify-center rounded-3xl bg-brand px-6 py-3 font-semibold text-white shadow-lift transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting…' : nextLabel}
        </button>
      </div>
    </div>
  );
};

export default StepWizard;
