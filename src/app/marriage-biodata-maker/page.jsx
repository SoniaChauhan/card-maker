import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Marriage Biodata Maker Online – Create Traditional Biodata with Photo',
  description:
    'Create a traditional and detailed marriage biodata online with photo upload. Clean layout, multi-language support in Hindi & English. Download as PDF. Biodata maker by Creative Thinker Design Hub.',
  keywords: [
    'marriage biodata maker', 'biodata maker online', 'marriage biodata format',
    'biodata for marriage', 'shaadi biodata maker', 'biodata format for marriage',
    'marriage profile maker', 'शादी बायोडाटा', 'biodata maker with photo',
  ],
  openGraph: {
    title: 'Marriage Biodata Maker – Create Biodata with Photo Online',
    description: 'Create traditional marriage biodata with photo upload. Hindi & English support. Download PDF!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/marriage-biodata-maker',
  },
};

export default function BiodataPage() {
  redirect('/?card=biodata');
}
