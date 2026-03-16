import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Video Audio Replacer — Replace Sound in Video Free Online | Card Maker',
  description: 'Replace audio in any video online for free. Upload your video, add a new song or audio track, adjust volume levels, and download — all processed in your browser!',
  keywords: ['replace audio in video', 'video audio replacer', 'swap video audio', 'remove video sound', 'add music to video', 'video audio editor online', 'replace video soundtrack'],
  openGraph: {
    title: 'Video Audio Replacer — Swap or Replace Audio in Video Free',
    description: 'Upload a video and replace its audio with a new song. Adjust original and new audio volume. 100% browser-based!',
    type: 'website',
  },
};

export default function VideoAudioReplacerPage() {
  return (
    <>
      <CardPage cardType="videoaudioswap" />
      <section className="seo-content" aria-hidden="true">
        <h2>Video Audio Replacer — Replace Sound in Video Online</h2>
        <p>
          Easily replace or swap the audio in any video using our free browser-based tool.
          Upload your MP4, WebM, or MOV video, add a new MP3 or WAV audio track, control
          the volume of original and new audio, and download the final video instantly.
        </p>
        <p>
          Perfect for adding background music to videos, replacing dialogue, removing
          unwanted sound, and more. No server upload — everything processes in your browser.
        </p>
      </section>
    </>
  );
}
