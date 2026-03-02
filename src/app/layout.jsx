import '@/global.css';

const SITE_URL = 'https://creativethinkerdesignhub.com';
const SITE_NAME = 'Online Card Maker – Create Birthday, Wedding, Festival Cards | Free Templates';
const DESCRIPTION =
  'Create beautiful invitation cards and greeting cards online. Free templates for birthdays, weddings, anniversaries, festivals like Holi, Diwali, Lohri. Customizable designs in Hindi & English, instant download. A product of Creative Thinker Design Hub.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Online Card Maker – Free Templates',
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
    siteName: 'Card Maker',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Online Card Maker – Create Birthday, Wedding & Festival Cards Free',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.svg`],
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
    google: 'S8dnFn0N-8ihgYb08FBTFC3UETrpX2rW1SlQpXjPFu0',
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
              name: 'Card Maker – Online Card & Invitation Designer',
              url: SITE_URL,
              description: DESCRIPTION,
              applicationCategory: 'DesignApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '0',
                'highPrice': '99',
                priceCurrency: 'INR',
                offerCount: '8',
                offers: [
                  { '@type': 'Offer', name: 'Happy Holi Wishes – Hindi', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Happy Holi Wishes – English', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Birthday Invitation Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Wedding Card Designer', price: '99', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Anniversary Card Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Festival Card Designer', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Resume Builder', price: '79', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Marriage Biodata Maker', price: '99', priceCurrency: 'INR' },
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
                  name: 'How can I create a card online?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Visit Card Maker, choose a template (birthday, wedding, anniversary, etc.), customize it with your text and photos, preview, and download instantly. No software installation needed!',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Card Maker free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Holi wishes cards (Hindi & English) and festival cards are 100% free — no sign-up required. Premium card designers like birthday (₹49), wedding (₹99), and anniversary (₹49) are affordably priced.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need to sign up to download cards?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No! Free cards like Holi wishes can be downloaded without signing up. For premium cards, you can use them as a guest or create an account to save templates and download history.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do you support Hindi and English templates?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Card Maker supports multiple languages including Hindi, English, Punjabi, and Gujarati. Holi wishes are available in both Hindi (50+ shayaris) and English (47 messages).',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What types of cards can I create?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'You can create Birthday Invitations, Wedding Cards, Anniversary Greetings, Holi Wishes (Hindi & English), Festival Cards, Marriage Biodata, Professional Resumes, Jagrata Invitations, and more.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I download cards as PDF?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Resumes and biodata can be downloaded as PDF files. Invitation cards and greeting cards are downloaded as high-quality PNG images perfect for printing and sharing.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is Card Maker available on mobile?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely! Card Maker works on all devices — desktop, tablet, and mobile phones. The interface is fully responsive and optimised for touch screens.',
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
