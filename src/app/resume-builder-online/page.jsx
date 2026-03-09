import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Online Resume Maker | Create Professional Resumes for Freshers & Experienced',
  description:
    'Make a professional resume online for free. Use modern templates, add your details, and download instantly in PDF or Word format. Perfect for freshers, students, job seekers, and experienced professionals.',
  keywords: [
    'resume maker online', 'free resume builder', 'resume for freshers',
    'professional resume format', 'resume template download',
    'one-page resume builder', 'CV maker India', 'job resume online',
    'resume PDF download', 'resume Word download', 'resume builder', 'online resume builder',
    'resume maker online free', 'resume creator online', 'cv maker online free',
    'resume builder india', 'ATS resume builder', 'job resume maker',
  ],
  openGraph: {
    title: 'Free Resume Maker Online | Create Professional Job-Ready Resumes',
    description: 'Make a modern, professional resume online for free. HR-approved templates, easy editing, instant PDF & Word download.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Maker Online | Professional Resumes',
    description: 'Make a modern, professional resume online for free. HR-approved templates, easy editing, instant PDF & Word download.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/resume-builder-online',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I make a resume online for free?',
    answer: 'Choose a template, fill in your details, and download your resume instantly — free and easy.',
  },
  {
    question: 'Is this resume format suitable for freshers?',
    answer: 'Yes! We provide HR-approved templates for freshers, students, and graduates.',
  },
  {
    question: 'Can I download my resume in PDF or Word format?',
    answer: 'Yes, you can download your resume in high-quality PDF or Word format instantly.',
  },
  {
    question: 'Can I edit my resume later?',
    answer: 'Yes, you can reopen your template and make changes anytime.',
  },
  {
    question: 'Are these resume formats accepted on job portals?',
    answer: 'Yes, our resumes are compatible with Naukri, Indeed, LinkedIn, and all major job portals.',
  },
];

export default function ResumePage() {
  return (
    <>
      <CardPage cardType="resume" />

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
              { '@type': 'ListItem', position: 2, name: 'Resume Builder Online', item: 'https://creativethinkerdesignhub.com/resume-builder-online' },
            ],
          }),
        }}
      />

      <section className="seo-content">
        <h1>Free Online Resume Maker</h1>
        <p>
          A professional resume is the first step toward your dream job. With our Free Online Resume Maker,
          you can create a clean, modern, and job-ready resume in just a few minutes. Whether you are a fresher,
          a student, or an experienced professional, our resume templates are crafted to help you stand out and
          make a strong first impression.
        </p>
        <p>
          Choose from a range of HR-approved templates designed specifically for IT jobs, non-technical roles,
          designers, developers, accountants, teachers, marketing professionals, and more. Customize everything
          easily — add your personal details, education, work experience, skills, projects, certifications,
          and profile summary. Our resume editor shows instant live preview so you can see exactly how your
          resume will look.
        </p>
        <p>
          Once done, download your resume instantly in high-quality PDF or Word format. You can print it, attach it
          in job applications, or upload it directly to job portals. No signup or app installation required —
          simple, fast, and beginner-friendly.
        </p>
        <h2>Popular Searches</h2>
        <ul>
          <li>resume maker online</li>
          <li>free resume builder</li>
          <li>resume for freshers</li>
          <li>professional resume format</li>
          <li>resume template download</li>
          <li>one-page resume builder</li>
          <li>CV maker India</li>
          <li>job resume online</li>
          <li>resume PDF download</li>
          <li>resume Word download</li>
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
