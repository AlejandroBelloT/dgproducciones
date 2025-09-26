import '../globals.css';

export const metadata = {
    title: 'Admin | DG Producciones',
};

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {children}
        </div>
    );
}
