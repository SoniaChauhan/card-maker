import '@/global.css';

export const metadata = {
  title: 'Card Maker – Online Invitation & Greeting Editor | Creative Thinker Design Hub',
  description: 'Create stunning birthday, wedding, anniversary, and invitation cards online with Card Maker by Creative Thinker Design Hub. Beautiful templates, multi-language support, and instant downloads.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
