import { WIZARD_STEPS } from "../../types";

type StepperProps = {
    currentStep: number;
};

export function Stepper({ currentStep }: StepperProps) {
    return (
        <ol className="stepper">
            {WIZARD_STEPS.map((label, index) => (
                <li className={currentStep === index + 1 ? "step active" : currentStep > index + 1 ? "step done" : "step"} key={label}>
                    {index + 1}. {label}
                </li>
            ))}
        </ol>
    );
}
