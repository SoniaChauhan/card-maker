import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Birthday Card Maker Online | Create Personalized Birthday Wishes & Invitations',
  description:
    'Create beautiful birthday cards online for free. Choose from cute, fun, modern, and photo birthday templates. Add name, age, photos, messages, and download instantly. Perfect for kids, adults, friends & family.',
  keywords: [
    'birthday card maker online', 'free birthday card', 'birthday invitation maker',
    'birthday greeting card online', 'personalized birthday card', 'printable birthday card',
    'photo birthday card', 'cartoon birthday card design', 'birthday party invitation',
    'birthday card designer', 'online birthday card maker', 'free card maker online',
    'kids birthday invitation', '1st birthday card', 'birthday card with photo',
    'जन्मदिन कार्ड बनाएं', 'birthday card download', 'happy birthday card maker',
  ],
  openGraph: {
    title: 'Free Birthday Card Maker | Cute & Personalized Birthday Card Designs',
    description: 'Create beautiful birthday cards online for free. Add photos, names, and messages. Instant download. Perfect for kids, friends, and family.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Birthday Card Maker | Cute & Personalized Birthday Card Designs',
    description: 'Create beautiful birthday cards online for free. Add photos, names, and messages. Instant download. Perfect for kids, friends, and family.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/birthday-invitation-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I make a birthday card for free?',
    answer: 'Choose a template, customize text and photos, and download the card instantly — completely free.',
  },
  {
    question: 'Can I create birthday invitations online?',
    answer: 'Yes, you can design both birthday wishes and invitation cards using our templates.',
  },
  {
    question: 'Can I add photos to my birthday card?',
    answer: 'Absolutely! Upload your photo and instantly preview how it looks on the card.',
  },
  {
    question: 'Do I need to install any app?',
    answer: 'No, everything works directly in your browser — fast and easy.',
  },
  {
    question: 'Is the birthday card download free?',
    answer: 'Yes, downloading is free with watermark. Premium users can download without watermark.',
  },
];

export default function BirthdayPage() {
  return (
    <>
      <CardPage cardType="birthday" />

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
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://creativethinkerdesignhub.com' },
              { '@type': 'ListItem', position: 2, name: 'Birthday Invitation Maker', item: 'https://creativethinkerdesignhub.com/birthday-invitation-maker' },
            ],
          }),
        }}
      />

      {/* SEO Content — visible to Google, hidden from UI */}
      <section className="seo-content" aria-hidden="true">
        <h1>Free Birthday Card Maker Online</h1>
        <p>
          Birthdays are meant to be special, and the perfect card can make the celebration even more memorable.
          With our Free Birthday Card Maker, you can design unique and personalized birthday cards in just a
          few minutes. Whether you want to create a fun card for kids, a cute birthday wish for friends, or a
          stylish birthday invitation, our tool offers everything you need in one place.
        </p>
        <p>
          Choose from a wide collection of colorful, modern, cartoon, floral, minimal, and photo&#8209;based
          birthday templates. Customize your card by adding the birthday person&#39;s name, age, photos,
          stickers, quotes, and personalized messages. Our editor gives you a live preview so you can see
          changes instantly.
        </p>
        <p>
          After designing, download your birthday card instantly in high&#8209;quality PNG or PDF formats.
          Share it on WhatsApp, Instagram, or print it for gifting. No signup or app installation is
          required — easy and fast for all users.
        </p>
        <h2>Our birthday card maker is perfect for:</h2>
        <ul>
          <li>Kids&#39; birthday invitation cards</li>
          <li>Adult &amp; friend birthday greetings</li>
          <li>Funny birthday wishes</li>
          <li>Photo birthday cards for family</li>
          <li>Simple and elegant birthday invitations</li>
        </ul>
        <p>
          Design a birthday card that stands out and brings a smile to your loved one&#39;s face — all
          within minutes.
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
          birthday card maker online, free birthday card, birthday invitation maker,
          birthday greeting card online, personalized birthday card, printable birthday card,
          photo birthday card, cartoon birthday card design
        </p>
      </section>
    </>
  );
}
