import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Card Resume Maker Online | Compact Resume Card Designer Free',
  description:
    'Create a professional card-style resume online. Compact, beautiful resume cards perfect for sharing on WhatsApp, LinkedIn & social media. Multiple premium themes. Best card resume maker India 2026.',
  keywords: [
    'card resume maker', 'compact resume card', 'resume card designer',
    'card style resume maker online', 'professional resume card',
    'resume card for whatsapp', 'resume card linkedin', 'mini resume maker',
    'resume card template', 'card resume builder free',
    'digital resume card', 'resume visiting card maker',
    'creative resume card', 'modern resume card design',
    'कार्ड रिज्यूम मेकर', 'रिज्यूम कार्ड डिज़ाइनर',
  ],
  openGraph: {
    title: 'Card Resume Maker | Compact Resume Card Designer',
    description: 'Create stunning card-style resumes with premium themes. Perfect for WhatsApp, LinkedIn & social media sharing!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Card Resume Maker Free Online',
    description: 'Create professional card-style resumes with premium themes. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/card-resume-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'What is a card resume?',
    answer: 'A card resume is a compact, visually appealing resume in card format — ideal for quick sharing on WhatsApp, LinkedIn, or social media.',
  },
  {
    question: 'Can I create a card resume for free?',
    answer: 'Yes, you can design and preview your card resume for free. Premium downloads are available without watermark.',
  },
  {
    question: 'What formats can I download my card resume in?',
    answer: 'You can download your card resume as a high-quality PNG image, perfect for digital sharing.',
  },
  {
    question: 'Is the card resume maker mobile-friendly?',
    answer: 'Absolutely! Our card resume maker works smoothly on mobile, tablet, and desktop browsers.',
  },
  {
    question: 'How is a card resume different from a regular resume?',
    answer: 'A card resume is a mini, single-card version of your resume — great for networking, social media profiles, and quick introductions.',
  },
];

export default function CardResumePage() {
  return (
    <>
      <CardPage cardType="cardresume" />
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
              { '@type': 'ListItem', position: 2, name: 'Card Resume Maker', item: 'https://creativethinkerdesignhub.com/card-resume-maker' },
            ],
          }),
        }}
      />
      <section className="seo-content" aria-hidden="true">
        <h1>Card Resume Maker Online — Compact Resume Card Designer</h1>
        <p>
          Stand out from the crowd with a beautifully designed card resume. Our Card Resume Maker lets you create
          compact, professional resume cards in minutes — perfect for sharing on WhatsApp, LinkedIn, Instagram,
          and other social platforms. Choose from multiple premium themes, add your details, and download instantly.
        </p>
        <p>
          Whether you are a fresher, student, or working professional, a card resume gives a quick snapshot of
          your skills, experience, and contact info in a visually appealing format. No design skills needed.
        </p>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </section>
    </>
  );
}
