This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## DG Producciones — Landing + Panel Admin

La landing consume contenido dinámico para la galería desde `/admin/content`.

Para que las imágenes aparezcan en la sección “Proyectos Destacados”:

- Crea o edita entradas en `/admin/content` con:
  - `type`: `project` o `gallery`
  - `status`: `published`
  - `data`: objeto con una de estas propiedades:
    - `images`: array de URLs
    - o `image`: una URL

Ejemplo de `data`:

```json
{
  "images": [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop",
    "/gallery/proyecto1.jpg"
  ]
}
```

Si no hay elementos publicados, la galería muestra imágenes de demo (Unsplash). Para usar URLs externas recuerda agregarlas a `next.config.mjs` en `images.remotePatterns`.
