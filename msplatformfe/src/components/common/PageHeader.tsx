import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
    return (
        <div className="mb-4 flex items-start justify-between gap-4">
            <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
