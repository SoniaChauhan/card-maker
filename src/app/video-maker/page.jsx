import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Video Card Maker — Create Slideshow Videos with Photos & Music | Card Maker',
  description: 'Upload your photos and favourite song to create a beautiful video slideshow. Add transitions, choose resolution, and download your video card — all in your browser!',
  keywords: ['video maker', 'photo slideshow', 'video card maker', 'photo video with music', 'slideshow creator', 'video greeting card', 'image to video', 'free video maker online'],
  openGraph: {
    title: 'Video Card Maker — Photo Slideshow with Music',
    description: 'Upload images & audio to create stunning video slideshows with transitions. Free & works in your browser!',
    type: 'website',
  },
};

export default function VideoMakerPage() {
  return (
    <>
      <CardPage cardType="videomaker" />
      <section className="seo-content" aria-hidden="true">
        <h2>Video Card Maker — Create Photo Slideshows with Music</h2>
        <p>
          Create stunning photo slideshows with your favourite songs using our free online Video Card Maker.
          Upload your images, add background music, choose transition effects like fade, slide, and zoom,
          then generate and download your video — all within your browser, no upload to any server required.
        </p>
        <p>
          Perfect for birthday videos, anniversary slideshows, wedding photo stories, travel memories,
          and sharing on WhatsApp, Instagram, Facebook and other social media.
        </p>
      </section>
    </>
  );
}
