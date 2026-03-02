export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://card-maker-seven-eta.vercel.app/sitemap.xml',
  };
}
