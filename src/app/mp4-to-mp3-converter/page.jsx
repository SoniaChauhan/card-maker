import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'MP4 to MP3 Converter — Extract Audio from Video Free Online | Card Maker',
  description: 'Convert MP4 video to MP3 audio online for free. Upload any video, choose audio quality, and download the extracted audio — all in your browser, no server upload needed!',
  keywords: ['mp4 to mp3', 'video to audio converter', 'extract audio from video', 'mp4 to mp3 converter online', 'free audio converter', 'video to mp3 online', 'convert video to audio'],
  openGraph: {
    title: 'MP4 to MP3 Converter — Extract Audio from Video Free',
    description: 'Upload any video and extract audio with selectable quality. 100% browser-based, no upload to server!',
    type: 'website',
  },
};

export default function Mp4ToMp3Page() {
  return (
    <>
      <CardPage cardType="mp4tomp3" />
      <section className="seo-content" aria-hidden="true">
        <h2>MP4 to MP3 Converter — Extract Audio from Video Online</h2>
        <p>
          Convert any MP4, WebM, or MOV video to audio using our free browser-based converter.
          Upload your video file, select audio quality (64kbps to 320kbps), and download the
          extracted audio instantly. No server upload — everything happens in your browser.
        </p>
        <p>
          Perfect for extracting songs from videos, saving podcast audio, converting lecture
          recordings, and more. Works on desktop, mobile, and tablet.
        </p>
      </section>
    </>
  );
}
