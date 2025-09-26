export default function LoadingState({ message = "Cargando actividades..." }) {
    return (
        <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-gray-600">{message}</p>
        </div>
    );
}