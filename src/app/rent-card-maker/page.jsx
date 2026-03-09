import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free PG & Rent Card Maker | Create Room, Flat & Hostel Rent Cards Online',
  description:
    'Design PG, room rent, flat rent, and hostel rent cards online for free. Add amenities, pricing, rules, contact details & download instantly. Perfect for owners, agents, hostels & PG accommodations.',
  keywords: [
    'PG rent card maker', 'room rent card online', 'flat rent card template',
    'hostel accommodation card', 'rental information card', 'PG details card',
    'rent card PDF download', 'rent card maker', 'PG advertisement card maker',
    'room for rent card', 'flat for rent poster', 'pg card maker online',
    'rent poster maker free', 'room available poster', 'paying guest card maker',
    'rental advertisement', 'rent card design online',
  ],
  openGraph: {
    title: 'Free PG & Rent Card Maker | Create Room & Flat Rent Cards',
    description: 'Create PG, hostel, room, and flat rent cards online for free. Add details and download instantly in PNG.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PG & Rent Card Maker Online',
    description: 'Create PG, hostel, room, and flat rent cards online for free. Add details and download instantly.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/rent-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I create a PG or rent card online for free?',
    answer: 'Choose a template, add your property details, and download instantly.',
  },
  {
    question: 'Can I add pricing and amenities to the card?',
    answer: 'Yes, you can add rent amount, deposit, food availability, Wi-Fi, room type, and more.',
  },
  {
    question: 'Do you have templates for hostel or flat rent cards?',
    answer: 'Yes, we offer designs for PGs, hostels, rooms, flats, and shops.',
  },
  {
    question: 'Can I download the card in PDF?',
    answer: 'Yes, you can download both PNG and PDF formats.',
  },
  {
    question: 'Do I need an app to make rent cards?',
    answer: 'No, everything works directly in your browser — easy and quick.',
  },
];

export default function RentCardPage() {
  return (
    <>
      <CardPage cardType="rentcard" />

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
              { '@type': 'ListItem', position: 2, name: 'Rent Card Maker', item: 'https://creativethinkerdesignhub.com/rent-card-maker' },
            ],
          }),
        }}
      />

      <section className="seo-content">
        <h1>Free PG &amp; Rent Card Maker Online</h1>
        <p>
          Managing rental properties becomes easier when you share information clearly and professionally.
          With our Free PG &amp; Rent Card Maker, you can create clean and attractive rent cards for PG
          accommodations, hostels, flats, shops, rooms, and rental properties in just a few minutes —
          no design skills needed.
        </p>
        <p>
          Choose from a variety of ready-made templates designed specifically for PG owners, hostel managers,
          rental brokers, flat owners, and small landlords. Customize your rent card by adding amenities,
          pricing, room type, rules, food availability, Wi-Fi options, deposit details, and contact information.
          Our editor provides a real-time preview so you can instantly see how your card looks.
        </p>
        <p>
          Once completed, download your PG or Rent Card instantly in high-quality PNG or PDF format.
          You can share it on WhatsApp, display it on notice boards, or print it for offline use.
          No app or signup required — simple and fast for all users.
        </p>
        <h2>Popular Searches</h2>
        <ul>
          <li>PG rent card maker</li>
          <li>room rent card online</li>
          <li>flat rent card template</li>
          <li>hostel accommodation card</li>
          <li>rental information card</li>
          <li>PG details card</li>
          <li>rent card PDF download</li>
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
