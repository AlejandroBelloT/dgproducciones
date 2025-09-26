import Button from '@/components/ui/Button';

export default function ProjectsCTA() {
    return (
        <div className="text-center animate-fade-up">
            <div className="inline-block bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white rounded-xl px-8 py-6">
                    <h3 className="font-title text-xl font-bold text-gray-800 mb-2">
                        ¿Listo para tu próximo proyecto?
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Llevemos tu marca al siguiente nivel con una experiencia BTL memorable
                    </p>
                    <Button size="lg" className="pulse-glow">
                        🚀 Empezar mi Proyecto
                    </Button>
                </div>
            </div>
        </div>
    );
}