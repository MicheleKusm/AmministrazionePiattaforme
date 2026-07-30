import { WIZARD_STEPS } from "../../types/type"

type StepperProps = {
    currentStep: number
    onStepClick?: (step: number) => void
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
    return (
        <ol className="stepper">
            {WIZARD_STEPS.map((label, index) => {
                const stepNumber = index + 1
                const clickable = onStepClick != null && stepNumber >= 2 && stepNumber !== currentStep
                return (
                    <li
                        className={currentStep === stepNumber ? "step active" : currentStep > stepNumber ? "step done" : "step"}
                        key={label}
                        onClick={clickable ? () => onStepClick(stepNumber) : undefined}
                        style={clickable ? { cursor: "pointer" } : undefined}>
                        {stepNumber}. {label}
                    </li>
                )
            })}
        </ol>
    )
}
