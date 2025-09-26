// Re-exportaciones para compatibilidad con código existente
// Los componentes han sido movidos a carpetas específicas para mejor organización

// Componentes de contactos
export { StatusBadge, ContactActions } from './contacts'

// Componentes compartidos
export { ImageUploadPreview } from './shared'

// TODO: Migrar gradualmente las importaciones para usar las rutas específicas:
// import { StatusBadge, ContactActions } from '@/components/admin/contacts'
// import { ImageUploadPreview } from '@/components/admin/shared'