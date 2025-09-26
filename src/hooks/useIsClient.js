import { useEffect, useState } from 'react';

/**
 * Hook para evitar problemas de hidratación
 * Devuelve true solo después de que el componente se haya montado en el cliente
 */
export function useIsClient() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient;
}

/**
 * Hook para manejar datos que pueden causar problemas de hidratación
 */
export function useClientData(fetchFn) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isClient = useIsClient();

    useEffect(() => {
        if (!isClient) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchFn();
                setData(result);
            } catch (err) {
                setError(err);
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isClient, fetchFn]);

    return { data, loading, error, isClient };
}