import BackToDashboardButton from './BackToDashboardButton'

export default function SectionHeader({
    title,
    onBackToDashboard,
    className = "",
    disabled = false
}) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
            <BackToDashboardButton
                onClick={onBackToDashboard}
                disabled={disabled}
            />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-right">
                {title}
            </h2>
        </div>
    )
}