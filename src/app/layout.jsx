import '@/global.css';

const SITE_URL = 'https://creativethinkerdesignhub.com';
const SITE_NAME = 'Free Online Card Maker | CreativeThinkerDesignHub – Birthday, Wedding, Invitation Cards';
const DESCRIPTION =
  'Create beautiful greeting cards online for free. Choose from birthday templates, wedding invitations, anniversary cards, Holi cards, motivational quote cards and more. 100+ aesthetic card templates. Easy to customize and download. Best free card maker online India 2026.';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s | Free Card Maker Online',
  },
  description: DESCRIPTION,
  keywords: [
    /* ── High-traffic keywords ── */
    'free card maker online', 'birthday invitation maker', 'marriage biodata templates',
    'aesthetic card templates', 'free motivational quote cards', 'Holi card templates',
    'wedding card design online free',
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
    /* ── Motivational ── */
    'motivational quotes images download', 'motivational quotes images',
    'inspirational quotes download free', 'motivational card maker',
    'quote card generator', 'motivational poster maker',
    /* ── Mothers & Fathers ── */
    "mother's quotes english", 'maa quotes hindi', 'माँ पर सुविचार',
    'happy mothers day 2026', "fathers quotes english", 'pitaji quotes',
    'पिता पर सुविचार', 'happy fathers day 2026',
    /* ── Biodata & Resume ── */
    'marriage biodata maker', 'biodata for marriage', 'online resume builder',
    'resume builder free pdf',
    /* ── PG & Rent ── */
    'rent card maker', 'PG advertisement card', 'room for rent card maker',
    'flat for rent poster', 'paying guest card', 'rent poster maker free',
    'किराये का कमरा', 'PG room card maker online',
    /* ── Salon ── */
    'salon card maker', 'salon price list card', 'parlour rate card maker',
    'beauty parlour card', 'salon menu card design', 'salon card online free',
    'सैलून कार्ड', 'ladies salon card maker', 'barber shop card',
    /* ── Brand ── */
    'Creative Thinker Design Hub', 'card maker india', 'card maker online india',
    'best card maker india 2026',
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
        {/* Preconnect for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7JKCTNQ014" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7JKCTNQ014');
            `,
          }}
        />
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
                offerCount: '10',
                offers: [
                  { '@type': 'Offer', name: 'Happy Holi Wishes – Hindi', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Happy Holi Wishes – English', price: '0', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Birthday Invitation Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Wedding Card Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Anniversary Card Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Festival Card Designer', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'PG & Rent Card Maker', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Salon Price List Card Maker', price: '49', priceCurrency: 'INR' },
                  { '@type': 'Offer', name: 'Resume Builder', price: '99', priceCurrency: 'INR' },
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
                  name: 'What is the best free card maker online?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Card Maker by Creative Thinker Design Hub is one of the best free online card makers. Create birthday invitations, wedding cards, festival greeting cards, and AI-powered personalised cards — all free with no watermark on free cards.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I create greeting cards without watermark?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! AI cards, festival cards, Holi wishes, motivational quotes, and all video tools are 100% free with no watermark. Premium cards (birthday, wedding, anniversary) offer a clean no-watermark download at ₹49.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I make festival cards online?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Simply click on the festival card you want (Eid, Diwali, Holi, etc.), customise the text and design, preview it, and download instantly. No signup required for free festival cards.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is your video trimmer free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! All video tools — Video Trimmer, MP4 to MP3 Converter, and Video Audio Replacer — are completely free. Everything processes in your browser, no files are uploaded to any server.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I convert MP4 video to MP3 audio for free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely! Use our free MP4 to MP3 Converter to extract audio from any video. Choose quality from 64kbps to 320kbps and download real MP3 files — all in your browser.',
                  },
                },
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
                  name: 'Do I need to install any software?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No installation needed! Card Maker is a web app that works directly in your browser on desktop, tablet, and mobile devices. Just open the website and start creating.',
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
                    text: 'You can create Birthday Invitations, Wedding Cards, Anniversary Greetings, Holi Wishes (Hindi & English), Festival Cards, Marriage Biodata, Professional Resumes, Jagrata Invitations, PG & Rent Cards, Salon Price List Cards, AI Cards, and more.',
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
        {/* Structured Data – BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'AI Text to Image Card', item: `${SITE_URL}/ai-text-image-card` },
                { '@type': 'ListItem', position: 3, name: 'AI Themed Card Maker', item: `${SITE_URL}/ai-themed-card-maker` },
                { '@type': 'ListItem', position: 4, name: 'Video Card Maker', item: `${SITE_URL}/video-maker` },
                { '@type': 'ListItem', position: 5, name: 'Video Trimmer', item: `${SITE_URL}/video-trimmer` },
                { '@type': 'ListItem', position: 6, name: 'MP4 to MP3 Converter', item: `${SITE_URL}/mp4-to-mp3-converter` },
                { '@type': 'ListItem', position: 7, name: 'Video Audio Replacer', item: `${SITE_URL}/video-audio-replacer` },
                { '@type': 'ListItem', position: 8, name: 'Birthday Invitation Maker', item: `${SITE_URL}/birthday-invitation-maker` },
                { '@type': 'ListItem', position: 9, name: 'Wedding Card Maker', item: `${SITE_URL}/wedding-card-maker` },
                { '@type': 'ListItem', position: 10, name: 'Festival Card Maker', item: `${SITE_URL}/festival-card-maker` },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
