import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Online Resume Builder – Create Professional Resume & Download PDF Free',
  description:
    'Build a polished professional resume online and download it instantly as PDF. Modern templates, clean layouts, easy-to-use editor. Free resume builder by Creative Thinker Design Hub.',
  keywords: [
    'resume builder', 'online resume builder', 'resume maker online free',
    'free resume builder', 'resume builder pdf download', 'professional resume maker',
    'resume creator online', 'cv maker online free', 'resume builder india',
  ],
  openGraph: {
    title: 'Online Resume Builder – Create & Download Professional Resume PDF',
    description: 'Build a professional resume online with modern templates. Download as PDF instantly!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/resume-builder-online',
  },
};

export default function ResumePage() {
  redirect('/?card=resume');
}
