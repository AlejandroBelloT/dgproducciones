import Button from '@/components/ui/Button'

export default function BackToDashboardButton({
    onClick,
    className = "",
    disabled = false
}) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto ${className}`}
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
            </svg>
            <span>Volver al Dashboard</span>
        </Button>
    )
}