import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Anniversary Card Maker Online | Custom Wishes, Templates & Invitations',
  description:
    'Create beautiful anniversary cards online for free. Choose from romantic, elegant, and modern templates. Add names, photos, messages, and download instantly. Perfect for wedding anniversaries, couple wishes, and invitation cards. No app required.',
  keywords: [
    'anniversary card maker online', 'free anniversary card', 'wedding anniversary card',
    'couple anniversary wishes', 'anniversary invitation card', 'online greeting card maker',
    'anniversary wishes card', 'personalized anniversary card', 'romantic anniversary card',
    'anniversary card download', 'anniversary greeting card', 'free anniversary card maker',
    '25th anniversary card', '50th anniversary card', 'anniversary templates',
    'silver anniversary card', 'golden anniversary card', 'शादी की सालगिरह कार्ड',
    'marriage anniversary card maker', 'couple card maker',
  ],
  openGraph: {
    title: 'Free Anniversary Card Maker | Create Romantic & Personalized Cards Online',
    description: 'Design beautiful anniversary wishes and invitation cards online. Free templates, easy editing, instant download. Perfect for couples, parents, and wedding anniversaries.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Anniversary Card Maker | Create Romantic & Personalized Cards Online',
    description: 'Design beautiful anniversary wishes and invitation cards online. Free templates, easy editing, instant download. Perfect for couples, parents, and wedding anniversaries.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/anniversary-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I create a free anniversary card online?',
    answer: 'You can choose a template, customize it with names, photos, and messages, and download the card instantly—completely free.',
  },
  {
    question: 'Can I add photos to my anniversary card?',
    answer: 'Yes, you can upload your own photos and personalize your anniversary card in just one click.',
  },
  {
    question: 'Do I need to install an app to make an anniversary card?',
    answer: 'No app is required. You can create and download your card directly from your browser.',
  },
  {
    question: 'Can I use these cards for wedding anniversary invitations?',
    answer: 'Yes, our templates can be used for both wishes and invitation cards.',
  },
  {
    question: 'Is the anniversary card download free?',
    answer: 'Yes, downloading is free with a watermark. Premium users can download without watermark.',
  },
];

export default function AnniversaryPage() {
  return (
    <>
      <CardPage cardType="anniversary" />

      {/* ═══ JSON-LD FAQ Structured Data for Rich Snippets ═══ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://creativethinkerdesignhub.com' },
              { '@type': 'ListItem', position: 2, name: 'Anniversary Card Maker', item: 'https://creativethinkerdesignhub.com/anniversary-card-maker' },
            ],
          }),
        }}
      />

      {/* ═══ SEO Content — visible to Google, hidden from UI ═══ */}
      <section className="seo-content" aria-hidden="true">
        <h1>Free Anniversary Card Maker Online</h1>
        <p>
          Celebrating a special milestone? Create a beautiful and personalized anniversary card in minutes
          with our Free Anniversary Card Maker. Whether it&#39;s a wedding anniversary, a couple celebration,
          a parent&#39;s anniversary, or a love message for your partner, you can design the perfect card
          without any design skills.
        </p>
        <p>
          Choose from a wide range of pre‑designed romantic, floral, classic, and modern anniversary card
          templates. Customize everything — add names, photos, dates, heartfelt messages, quotes, stickers,
          and more. The editor is simple, fast, and user‑friendly for all age groups.
        </p>
        <p>
          Once your design is ready, download your anniversary card instantly in high quality. You can share
          it on WhatsApp, Instagram, or print it for gifting. No signup or app installation required.
        </p>

        <h2>Our free anniversary card maker is perfect for:</h2>
        <ul>
          <li>Wife or husband anniversary wishes</li>
          <li>Couple anniversary greeting cards</li>
          <li>Family &amp; friends anniversary cards</li>
          <li>Wedding anniversary invitation cards</li>
        </ul>

        <p>
          Design a memorable and professional‑looking anniversary card today and make every celebration special.
        </p>

        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}

        <h2>Popular Searches</h2>
        <p>
          anniversary card maker online, free anniversary card, wedding anniversary card,
          couple anniversary wishes, anniversary invitation card, online greeting card maker,
          anniversary wishes card, personalized anniversary card, romantic anniversary card,
          anniversary card download
        </p>
      </section>
    </>
  );
}
