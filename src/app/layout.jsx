import '@/global.css';

const SITE_URL = 'https://card-maker-soniachauhan.vercel.app';
const SITE_NAME = 'Card Maker – Creative Thinker Design Hub';
const DESCRIPTION =
  'Create stunning birthday invitations, wedding cards, anniversary greetings, Holi wishes & festival cards online for free. Beautiful templates, Hindi & English, instant download. A product of Creative Thinker Design Hub.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Card Maker',
  },
  description: DESCRIPTION,
  keywords: [
    'card maker', 'online card maker', 'birthday invitation maker',
    'wedding card maker', 'anniversary card', 'holi wishes',
    'holi shayari', 'festival greeting cards', 'free holi cards',
    'hindi holi wishes', 'english holi messages', 'romantic holi shayari',
    'invitation designer', 'greeting card generator',
    'Creative Thinker Design Hub', 'card maker online free',
    'शादी का कार्ड', 'होली की शुभकामनाएं', 'जन्मदिन कार्ड',
  ],
  authors: [{ name: 'Creative Thinker Design Hub' }],
  creator: 'Creative Thinker Design Hub',
  publisher: 'Creative Thinker Design Hub',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your Google Search Console verification code here later
    // google: 'your-verification-code',
  },
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
        {/* Structured Data – WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Card Maker',
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: 'DesignApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                description: 'Free Holi wishes cards. Premium cards at ₹29 per download.',
              },
              creator: {
                '@type': 'Organization',
                name: 'Creative Thinker Design Hub',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
