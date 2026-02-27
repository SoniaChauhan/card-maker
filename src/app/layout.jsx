import '@/global.css';

export const metadata = {
  title: 'Card Maker – Design Beautiful Cards',
  description: 'Create stunning birthday, wedding, anniversary, and other cards with ease.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
