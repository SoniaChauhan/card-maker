import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Wedding Invitation Card Maker | Create Beautiful Digital Shaadi Cards Online',
  description:
    'Design stunning wedding invitation cards online for free. Choose elegant, traditional, and modern templates. Add names, dates, venue, photos & more. Instant download in high quality. Perfect for Indian weddings.',
  keywords: [
    'wedding invitation card maker', 'digital wedding card', 'free shaadi card online',
    'Indian wedding invitation', 'wedding card design online', 'royal wedding invitation',
    'pastel wedding card', 'Hindu wedding invite', 'Sikh wedding invite',
    'Muslim wedding invite', 'Christian wedding invite', 'downloadable wedding card',
    'wedding card maker', 'online wedding card maker', 'free wedding card design',
    'शादी का कार्ड', 'विवाह निमंत्रण पत्र', 'marriage card maker online',
  ],
  openGraph: {
    title: 'Free Wedding Invitation Card Maker | Elegant Digital Shaadi Card Designs',
    description: 'Create beautiful wedding invitation cards online for free. Choose traditional, royal, and modern designs. Add details and download instantly.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Wedding Invitation Card Maker | Elegant Digital Shaadi Card Designs',
    description: 'Create beautiful wedding invitation cards online for free. Choose traditional, royal, and modern designs. Add details and download instantly.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/wedding-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I create a free wedding invitation card online?',
    answer: 'Choose a template, customize your details, and download the card instantly \u2014 completely free.',
  },
  {
    question: 'Can I use these cards for Indian weddings?',
    answer: 'Yes! We offer templates for Hindu, Muslim, Sikh, and Christian weddings.',
  },
  {
    question: 'Can I add names, dates, and venue details?',
    answer: 'Yes, you can edit everything including text, colors, photos, and layouts.',
  },
  {
    question: 'Do I need to install any app?',
    answer: 'No, everything works directly in your browser \u2014 easy and fast.',
  },
  {
    question: 'Is the wedding card free to download?',
    answer: 'Yes, free with watermark. Premium users can download without watermark.',
  },
];

export default function WeddingPage() {
  return (
    <>
      <CardPage cardType="wedding" />

      {/* JSON-LD FAQ Structured Data for Rich Snippets */}
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
      />      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://creativethinkerdesignhub.com' },
              { '@type': 'ListItem', position: 2, name: 'Wedding Card Maker', item: 'https://creativethinkerdesignhub.com/wedding-card-maker' },
            ],
          }),
        }}
      />
      {/* SEO Content \u2014 visible to Google, hidden from UI */}
      <section className="seo-content" aria-hidden="true">
        <h1>Free Wedding Invitation Card Maker Online</h1>
        <p>
          Your wedding is one of the most memorable days of your life, and your invitation card should
          reflect that beauty. Our Free Wedding Invitation Card Maker allows you to create elegant, modern,
          and traditional shaadi cards in just a few minutes. Whether you&#39;re planning a simple ceremony
          or a grand celebration, our designer-made templates make it easy to create the perfect wedding invite.
        </p>
        <p>
          Choose from a wide range of royal, floral, pastel, minimalist, Hindu wedding, Muslim wedding,
          Sikh wedding, Christian wedding, and traditional Indian wedding invitation designs. Customize
          everything \u2014 add names, event dates, timings, venue details, RSVP info, photos, and personal
          messages. Use our live preview editor to see real-time changes before downloading.
        </p>
        <p>
          Once your design is ready, download your wedding invitation card instantly in high&#8209;quality
          PNG or PDF formats. Share it digitally on WhatsApp, Instagram, or print it for distribution.
          No signup or app installation required \u2014 fast and simple for all users.
        </p>
        <h2>Our wedding card maker is perfect for:</h2>
        <ul>
          <li>Digital shaadi card invitations</li>
          <li>Simple &amp; modern wedding invites</li>
          <li>Traditional Indian wedding cards</li>
          <li>Photo wedding invitation designs</li>
          <li>Engagement &amp; ring ceremony invitations</li>
        </ul>
        <p>
          Create your beautiful wedding invitation card today \u2014 elegant, unique, and unforgettable.
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
          wedding invitation card maker, digital wedding card, free shaadi card online,
          Indian wedding invitation, wedding card design online, royal wedding invitation,
          pastel wedding card, Hindu Sikh Muslim Christian wedding invite, downloadable wedding card
        </p>
      </section>
    </>
  );
}
