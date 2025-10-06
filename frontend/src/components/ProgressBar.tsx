interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm font-medium text-muted">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{percentage}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-line">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-brand to-[#e64545] transition-all"
          style={{ width: `${percentage}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
};

export default ProgressBar;
