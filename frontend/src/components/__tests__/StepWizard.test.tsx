import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepWizard, { StepDefinition } from '../StepWizard';
import { describe, expect, it, vi } from 'vitest';

const steps: StepDefinition[] = [
  { id: 'one', title: 'One' },
  { id: 'two', title: 'Two' },
  { id: 'three', title: 'Three' },
];

describe('StepWizard', () => {
  it('renders step headers and calls callbacks', async () => {
    const onBack = vi.fn();
    const onNext = vi.fn();
    const onStepChange = vi.fn();
    const user = userEvent.setup();

    render(
      <StepWizard steps={steps} currentStep={1} onBack={onBack} onNext={onNext} onStepChange={onStepChange}>
        <div>Step content</div>
      </StepWizard>
    );

    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '2');
    expect(progress).toHaveAttribute('aria-valuemax', '3');
    expect(screen.getByText('Currently on step 2 of 3: Two')).toHaveAttribute('aria-live', 'polite');

    const heading = screen.getByRole('heading', { level: 2, name: 'Step 2: Two' });
    await waitFor(() => expect(heading).toHaveFocus());
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /two/i }));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });

  it('shifts focus to first invalid field when the step updates', async () => {
    const { rerender } = render(
      <StepWizard steps={steps} currentStep={0}>
        <input aria-label="Valid field" />
      </StepWizard>
    );

    const firstHeading = screen.getByRole('heading', { level: 2, name: 'Step 1: One' });
    await waitFor(() => expect(firstHeading).toHaveFocus());

    rerender(
      <StepWizard steps={steps} currentStep={1}>
        <input aria-label="Invalid field" aria-invalid="true" />
      </StepWizard>
    );

    const invalidField = screen.getByLabelText('Invalid field');
    await waitFor(() => expect(invalidField).toHaveFocus());
  });
});
