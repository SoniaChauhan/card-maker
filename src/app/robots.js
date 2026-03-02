export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://card-maker-soniachauhan.vercel.app/sitemap.xml',
  };
}
