import type { ReactNode } from "react";

type Tone = "blue" | "green" | "gray" | "red" | "orange";

type BadgeProps = {
    tone?: Tone;
    children: ReactNode;
};

const tones: Record<Tone, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-50 text-red-700",
    orange: "bg-orange-50 text-orange-700"
};

export function Badge({ tone = "gray", children }: BadgeProps) {
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
