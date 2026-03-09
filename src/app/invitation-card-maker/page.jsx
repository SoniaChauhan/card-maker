import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Invitation Card Maker Online | Birthday, Wedding & Event Invitations',
  description:
    'Create free invitation cards online for any occasion - birthdays, weddings, anniversaries, religious events, baby showers. 100+ aesthetic card templates in Hindi & English. Customizable designs, instant download. Best free card maker online India.',
  keywords: [
    'invitation card maker', 'invitation maker online', 'free invitation maker',
    'online invitation maker free', 'digital invitation card maker', 'free card maker online',
    'party invitation maker', 'event invitation card creator', 'invitation card design',
    'aesthetic card templates', 'invitation templates free download',
    'निमंत्रण पत्र', 'invitation card maker india', 'e-invitation maker',
    'whatsapp invitation maker', 'digital invite creator',
  ],
  openGraph: {
    title: 'Free Invitation Card Maker | 100+ Templates for Every Occasion',
    description: 'Create free invitation cards for birthdays, weddings, parties & more. 100+ aesthetic templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Invitation Maker',
    description: 'Create stunning invitations for any event. 100+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/invitation-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How do I create an invitation card online?',
    answer: 'Pick a template, add event details like date, time, venue, and guest names, then download your invitation instantly.',
  },
  {
    question: 'What types of invitation cards can I make?',
    answer: 'Birthday invitations, wedding cards, anniversary invites, religious ceremony cards, baby shower invitations, housewarming, and more.',
  },
  {
    question: 'Can I create invitations in Hindi?',
    answer: 'Yes! Our invitation maker supports Hindi, English, Punjabi, and other Indian languages.',
  },
  {
    question: 'Is the invitation card maker free to use?',
    answer: 'Yes, you can design and preview your invitation for free. Premium downloads without watermark are also available.',
  },
  {
    question: 'Can I share invitation cards on WhatsApp?',
    answer: 'Absolutely! Download your invitation as a high-quality PNG and share on WhatsApp, Instagram, or any platform.',
  },
];

export default function InvitationPage() {
  return (
    <>
      <CardPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
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
              { '@type': 'ListItem', position: 2, name: 'Invitation Card Maker', item: 'https://creativethinkerdesignhub.com/invitation-card-maker' },
            ],
          }),
        }}
      />
      <section className="seo-content" aria-hidden="true">
        <h1>Free Invitation Card Maker Online</h1>
        <p>
          Create stunning invitation cards for any occasion with our free online invitation maker. Design
          personalized invitations for birthdays, weddings, religious events, baby showers, and more.
          Choose from 100+ beautiful templates, customize every detail, and download instantly.
        </p>
        <p>
          Our invitation card maker supports Hindi and English, making it perfect for Indian families.
          Share digitally on WhatsApp, Instagram, or print for distribution.
        </p>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </section>
    </>
  );
}
