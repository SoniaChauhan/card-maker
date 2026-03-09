import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Marriage Biodata Maker Online | Create Shaadi Biodata for Boys & Girls',
  description:
    'Create a professional marriage biodata online for free. Choose templates for Hindu, Muslim, Sikh, Jain & Christian marriage profiles. Add photos, education, family details & download instantly in high-quality PNG.',
  keywords: [
    'marriage biodata maker', 'free biodata format', 'Hindu marriage biodata',
    'Muslim marriage biodata', 'Sikh marriage biodata', 'Jain marriage biodata',
    'biodata for marriage', 'marriage profile maker', 'online matrimony biodata',
    'shaadi biodata format', 'biodata maker online', 'biodata maker with photo',
    'marathi biodata', 'gujarati biodata', 'शादी बायोडाटा',
    'विवाह परिचय पत्र', 'biodata download png', 'biodata template',
  ],
  openGraph: {
    title: 'Free Marriage Biodata Maker | Create Shaadi Biodata Online',
    description: 'Create professional marriage biodata online for free. Add personal details, family info & partner preferences. Instant download in high-quality PNG.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Marriage Biodata Maker | Create Shaadi Biodata Online',
    description: 'Create professional marriage biodata online for free. Add personal details, family info & partner preferences. Instant download in high-quality PNG.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/marriage-biodata-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How do I create a marriage biodata online for free?',
    answer: 'Select a template, fill in your details, add a photo, and download your biodata instantly.',
  },
  {
    question: 'Can I download the biodata in PNG format?',
    answer: 'Yes, you can download your biodata in high-quality PNG image format.',
  },
  {
    question: 'Do you have community-specific biodata formats?',
    answer: 'Yes, we provide templates for Hindu, Muslim, Sikh, Christian, Jain, and more.',
  },
  {
    question: 'Can I add my own photo?',
    answer: 'Yes, you can upload a photo and customize the layout with live preview.',
  },
  {
    question: 'Is this biodata accepted on matrimonial sites?',
    answer: 'Yes, the biodata format is suitable for all matrimonial websites and traditional matchmaking.',
  },
];

export default function BiodataPage() {
  return (
    <>
      <CardPage cardType="biodata" />

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
              { '@type': 'ListItem', position: 2, name: 'Marriage Biodata Maker', item: 'https://creativethinkerdesignhub.com/marriage-biodata-maker' },
            ],
          }),
        }}
      />

      {/* SEO Content — visible to Google, hidden from UI */}
      <section className="seo-content" aria-hidden="true">
        <h1>Free Marriage Biodata Maker Online</h1>
        <p>
          Your marriage biodata is the first impression for any suitable match, and a well‑designed
          profile makes all the difference. With our Free Marriage Biodata Maker, you can create a clean,
          professional, and beautifully formatted biodata in just a few minutes. Whether you need a biodata
          for Hindu marriage, Muslim marriage, Sikh marriage, Jain marriage, Christian marriage, or a simple
          traditional Shaadi biodata, our templates are designed to suit every community and preference.
        </p>
        <p>
          Choose from a variety of elegant and modern layouts and easily add your personal details, including
          name, age, date of birth, height, education, occupation, family background, partner preferences,
          and more. You can also upload a photo and customize colors, fonts, and sections as needed. Our live
          preview editor ensures every detail is perfectly aligned.
        </p>
        <p>
          Once your biodata is ready, download it instantly in high-quality PNG format. You can print
          it, share it on WhatsApp, or email it to relatives, matrimonial agents, or potential matches. No
          app installation or signup required.
        </p>
        <p>
          Create a biodata that stands out — professional, clean, and ready for your marriage journey.
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
          marriage biodata maker, free biodata format, Hindu marriage biodata, Muslim Sikh Jain marriage
          biodata, biodata for marriage, marriage profile maker, online matrimony biodata, shaadi
          biodata format
        </p>
      </section>
    </>
  );
}
