import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Video Trimmer — Cut & Crop Videos Online Free | Card Maker',
  description: 'Trim and crop your videos online for free. Upload any video, select start and end points with a visual timeline, and download your trimmed clip — all in your browser, no upload to server!',
  keywords: ['video trimmer', 'video cutter', 'crop video online', 'trim video free', 'cut video clip', 'video editor online', 'video cropper', 'clip maker'],
  openGraph: {
    title: 'Video Trimmer — Cut & Crop Videos Online Free',
    description: 'Upload a video, drag the timeline handles to select your clip, and download — works entirely in your browser!',
    type: 'website',
  },
};

export default function VideoTrimmerPage() {
  return (
    <>
      <CardPage cardType="videotrimmer" />
      <section className="seo-content" aria-hidden="true">
        <h2>Video Trimmer — Cut & Crop Videos Online</h2>
        <p>
          Trim your videos online for free using our browser-based Video Trimmer tool.
          Upload any video file (MP4, WebM, MOV), use the visual timeline to select the
          exact portion you want, preview the clip, and download it instantly.
        </p>
        <p>
          Perfect for creating short clips for WhatsApp status, Instagram Reels, YouTube Shorts,
          and social media. No file upload to any server — everything happens in your browser for maximum privacy.
        </p>
      </section>
    </>
  );
}
