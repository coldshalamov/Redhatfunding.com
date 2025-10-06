import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /two/i }));
    expect(onStepChange).toHaveBeenCalledWith(1);
  });
});
