import '@/global.css';

const SITE_URL = 'https://card-maker-soniachauhan.vercel.app';
const SITE_NAME = 'Card Maker – Free Online Card & Invitation Designer | Creative Thinker Design Hub';
const DESCRIPTION =
  'Create stunning birthday invitations, wedding cards, anniversary greetings, Happy Holi wishes & festival cards online free. 100+ templates in Hindi & English. Free Holi shayari cards, romantic Holi messages, Holi wishes 2026 download. A product of Creative Thinker Design Hub.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Card Maker – Free Online Card Designer',
  },
  description: DESCRIPTION,
  keywords: [
    /* ── Core ── */
    'card maker', 'online card maker', 'free card maker', 'card maker online free',
    'card maker app', 'free online card maker', 'greeting card maker',
    'invitation maker', 'invitation designer', 'free invitation maker',
    'online invitation maker free', 'digital card maker',
    /* ── Birthday ── */
    'birthday invitation maker', 'birthday card maker', 'free birthday card maker',
    'birthday invitation online', 'birthday party invitation maker',
    'birthday card maker online free', 'जन्मदिन कार्ड बनाएं',
    /* ── Wedding ── */
    'wedding card maker', 'wedding invitation maker', 'free wedding card design',
    'online wedding card maker', 'hindu wedding card maker', 'शादी का कार्ड',
    'wedding card designer online', 'marriage card maker',
    /* ── Anniversary ── */
    'anniversary card maker', 'anniversary greeting card', 'free anniversary card',
    'wedding anniversary card maker online', 'anniversary wishes card',
    /* ── Holi ── */
    'happy holi wishes', 'happy holi wishes 2026', 'holi wishes in hindi',
    'holi wishes in english', 'holi shayari', 'holi shayari in hindi',
    'romantic holi wishes', 'romantic holi shayari', 'holi greeting cards',
    'free holi cards', 'free holi cards download', 'holi wishes images',
    'holi messages', 'holi wishes for family', 'holi wishes for love',
    'होली की शुभकामनाएं', 'होली शायरी 2026', 'होली विशेज इन हिंदी',
    'happy holi 2026', 'holi card maker', 'holi wishes card download free',
    /* ── Festival ── */
    'festival greeting cards', 'festival card maker', 'diwali card maker',
    'eid card maker', 'christmas card maker', 'navratri card maker',
    /* ── Brand ── */
    'Creative Thinker Design Hub', 'card maker india',
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
        {/* Structured Data – WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Card Maker – Free Online Card Designer',
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: 'DesignApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '0',
                highPrice: '29',
                priceCurrency: 'INR',
                offerCount: '6',
                offers: [
                  { '@type': 'Offer', name: 'Happy Holi Wishes – Hindi', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Happy Holi Wishes – English', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Birthday Invitation Designer', price: '29', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Wedding Card Designer', price: '29', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Anniversary Card Designer', price: '29', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Festival Card Designer', price: '29', priceCurrency: 'INR' },
                ],
              },
              creator: {
                '@type': 'Organization',
                name: 'Creative Thinker Design Hub',
                url: SITE_URL,
              },
            }),
          }}
        />
        {/* Structured Data – FAQPage for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is Card Maker free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Happy Holi wishes cards (Hindi & English) are 100% free. Birthday, Wedding, Anniversary & Festival card designers are available at just ₹29 per download.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How to download free Holi wishes cards?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Visit Card Maker, click on "Holi Wishes – Hindi" or "Holi Wishes – English", customize colors, and click the download button on any card. No sign-up required!',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I make birthday invitations online for free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Card Maker offers a premium Birthday Invitation Designer where you can create personalised party invitations with beautiful templates for just ₹29 per download.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What types of cards can I create?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can create Birthday Invitations, Wedding Cards, Anniversary Greetings, Holi Wishes (Hindi & English), and Festival Greeting Cards for Diwali, Eid, Christmas, and more.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does Card Maker support Hindi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Card Maker supports both Hindi and English. Holi wishes are available in both languages with 50+ Hindi shayaris and 47 English messages.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
