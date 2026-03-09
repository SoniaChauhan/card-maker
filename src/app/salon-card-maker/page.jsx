import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Salon & Beauty Parlour Card Maker | Create Service & Price List Cards Online',
  description:
    'Design professional salon and beauty parlour cards online for free. Create price lists, service menus, offers, bridal packages & contact cards. Add logo, timings, address & download instantly in PNG/PDF.',
  keywords: [
    'salon card maker online', 'beauty parlour price list card',
    'salon service menu template', 'bridal makeup package card',
    'spa & wellness card design', 'salon offer card',
    'salon visiting card online', 'salon card PDF download',
    'salon card maker', 'salon price list card maker', 'parlour rate card maker',
    'salon menu card design', 'beauty parlour card maker online',
    'ladies salon card', 'men salon card', 'unisex salon card maker',
  ],
  openGraph: {
    title: 'Free Salon & Beauty Parlour Card Maker | Service & Price List Templates',
    description: 'Design professional salon cards online for free — price lists, offers, packages & visiting cards. Add logo and contact details. Instant PNG download.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Salon & Beauty Parlour Card Maker',
    description: 'Design professional salon cards online for free — price lists, offers, packages & visiting cards. Instant PNG download.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/salon-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I create a salon price list card online for free?',
    answer: 'Select a template, add your services, prices, and contact details, then download instantly.',
  },
  {
    question: 'Can I add my salon logo and WhatsApp number?',
    answer: 'Yes, you can add a logo, phone/WhatsApp, address, timings, and social media handles.',
  },
  {
    question: 'Is there a template for bridal or festive offers?',
    answer: 'Absolutely—use our offer, package, and seasonal promo templates.',
  },
  {
    question: 'Can I download the card in PDF and PNG?',
    answer: 'Yes, both high-quality PNG and print-ready PDF are available.',
  },
  {
    question: 'Do I need to install any app?',
    answer: 'No, everything works in your browser — quick and easy.',
  },
];

export default function SalonCardPage() {
  return (
    <>
      <CardPage cardType="saloncard" />

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
              { '@type': 'ListItem', position: 2, name: 'Salon Card Maker', item: 'https://creativethinkerdesignhub.com/salon-card-maker' },
            ],
          }),
        }}
      />

      <section className="seo-content">
        <h1>Free Salon &amp; Beauty Parlour Card Maker</h1>
        <p>
          Make your beauty business stand out with clean, attractive, and easy-to-share cards. Our Free
          Salon &amp; Beauty Parlour Card Maker helps you design professional cards in minutes — ideal for
          service menus, price lists, festive offers, bridal packages, monthly memberships, visiting cards,
          and appointment reminders. No design skills needed.
        </p>
        <p>
          Choose from elegant, modern, and minimal templates tailored for salons, parlours, beauty studios,
          nail art, spa &amp; wellness centers, makeup artists, mehndi artists, and home salons. Customize
          every detail: add logo, services, price list, discounts, operating hours, location, WhatsApp number,
          social handles, and appointment links. See changes live with our easy editor.
        </p>
        <p>
          When you&apos;re happy with your design, download your salon card instantly in high-quality PNG or PDF.
          Share on WhatsApp &amp; Instagram, print for your reception desk, or use as stories and flyers for
          promotions. No signup or app required — fast and business-friendly.
        </p>
        <h2>Popular Searches</h2>
        <ul>
          <li>salon card maker online</li>
          <li>beauty parlour price list card</li>
          <li>salon service menu template</li>
          <li>bridal makeup package card</li>
          <li>spa &amp; wellness card design</li>
          <li>salon offer card</li>
          <li>salon visiting card online</li>
          <li>salon card PDF download</li>
        </ul>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </>
  );
}
