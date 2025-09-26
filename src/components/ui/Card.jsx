export function Card({ children, className = '' }) {
    return <div className={`rounded-lg border border-neutral-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = '' }) {
    return <div className={`p-4 border-b border-neutral-200 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
    return <h3 className={`text-base font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = '' }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}
