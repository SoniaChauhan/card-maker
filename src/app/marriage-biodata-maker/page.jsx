import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Marriage Biodata Maker Online Free – Create Traditional Biodata with Photo | Hindi, English, Marathi, Gujarati',
  description:
    'Create beautiful marriage biodata online with photo upload. Support for Hindi, English, Marathi, Gujarati, Muslim biodata formats. 6+ premium templates. Download as PDF & Image. Best biodata maker in India by Creative Thinker Design Hub.',
  keywords: [
    'marriage biodata maker', 'biodata maker online', 'marriage biodata format',
    'biodata for marriage', 'shaadi biodata maker', 'biodata format for marriage',
    'marriage profile maker', 'शादी बायोडाटा', 'biodata maker with photo',
    'marathi biodata', 'gujarati biodata', 'muslim biodata', 'hindu biodata',
    'biodata maker free', 'biodata download pdf', 'biodata template',
    'vivah biodata', 'matrimonial biodata', 'लग्न बायोडेटा', 'विवाह परिचय पत्र',
  ],
  openGraph: {
    title: 'Marriage Biodata Maker Free – Create Professional Biodata Online',
    description: 'Create traditional marriage biodata with photo upload. Hindi, English, Marathi, Gujarati & Muslim formats. 6+ premium templates. Download PDF & Image!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marriage Biodata Maker Online Free',
    description: 'Create beautiful marriage biodata in Hindi, English, Marathi, Gujarati. Download PDF & Image.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/marriage-biodata-maker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function BiodataPage() {
  return <CardPage cardType="biodata" />;
}
