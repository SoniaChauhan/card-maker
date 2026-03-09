import Link from 'next/link';

export const metadata = {
  title: 'Blog – Tips, Guides & Templates | Creative Thinker Design Hub',
  description:
    'Read helpful guides on card designing, invitations, resumes, biodata, festival greetings and more. Free tips, templates and ideas for every occasion.',
  keywords: [
    'card design blog', 'invitation ideas', 'resume tips', 'biodata guide',
    'birthday wording ideas', 'wedding card tips', 'festival greeting guide',
    'card maker blog india',
  ],
  openGraph: {
    title: 'Blog – Tips, Guides & Templates | Creative Thinker Design Hub',
    description: 'Card design tips, invitation ideas, resume guidance, biodata formatting and festival greeting guides.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/blog',
  },
};

const BLOG_POSTS = [
  {
    title: 'Best Online Card Maker in India 2026 — Free & Premium Templates',
    slug: '/blog/best-online-card-maker-in-india',
    excerpt:
      'Discover why Creative Thinker Design Hub is India\u2019s most trusted card maker. Compare features, pricing, templates, languages, and instant download options.',
  },
  {
    title: '50+ Birthday Invitation Wording Ideas (Kids, Adults, Friends)',
    slug: '/blog/birthday-invitation-wording-ideas',
    excerpt:
      'Struggling with what to write on a birthday card? Here are 50+ ready-to-use wordings for kids\u2019 parties, surprise birthdays, friends, and adults.',
  },
  {
    title: 'How to Create a Marriage Biodata (With Examples & Templates)',
    slug: '/blog/how-to-create-marriage-biodata',
    excerpt:
      'A complete guide on how to write a marriage biodata with correct formatting, examples, do\u2019s & don\u2019ts, and downloadable templates.',
  },
  {
    title: 'Free Resume Formats for Freshers (2026 Guide)',
    slug: '/blog/resume-format-for-freshers-2026',
    excerpt:
      'Best resume examples for freshers \u2014 education-based, skill-based, and project-based formats with HR-approved tips.',
  },
  {
    title: 'Best Wedding Card Maker Online — Create Stunning Invitations',
    slug: '/blog/best-wedding-card-maker-online',
    excerpt:
      'Design beautiful wedding invitation cards online with premium templates. Hindu, Muslim, Sikh & Christian designs available.',
  },
  {
    title: 'Free Birthday Invitation Templates — Download & Customize',
    slug: '/blog/free-birthday-invitation-templates',
    excerpt:
      'Browse free birthday invitation templates for kids, adults, and themed parties. Customize and download instantly.',
  },
  {
    title: 'How to Make a Holi Card Online — Free Templates & Wishes',
    slug: '/blog/how-to-make-holi-card-online',
    excerpt:
      'Create colorful Holi greeting cards online with free templates. Add wishes in Hindi & English and share instantly.',
  },
];

export default function BlogIndex() {
  return (
    <article style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif', color: '#333', lineHeight: 1.8, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
      <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', marginBottom: 8 }}>Blog &ndash; Tips, Guides &amp; Templates</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Welcome to the Creative Thinker Design Hub Blog &mdash; your source for card design tips,
        invitation ideas, resume guidance, biodata formatting, festival greetings, and online creation tools.
        Here you&apos;ll find helpful guides that make your designing journey easier, faster, and more creative.
      </p>

      <h2 style={{ marginTop: 32, marginBottom: 20 }}>⭐ Featured Articles</h2>

      <div style={{ display: 'grid', gap: 24 }}>
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            style={{
              padding: 20,
              border: '1px solid #e5e7eb',
              borderRadius: 10,
              background: '#fafafa',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', marginBottom: 8, color: '#1a1a2e' }}>{post.title}</h3>
            <p style={{ color: '#555', marginBottom: 12 }}>{post.excerpt}</p>
            <Link href={post.slug} style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none' }}>
              Read More &rarr;
            </Link>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 32, padding: 16, background: '#f0f0ff', borderRadius: 8 }}>
        <strong>Want to create your own card?</strong>{' '}
        <Link href="/" style={{ color: '#667eea', fontWeight: 600 }}>
          Visit Card Maker &mdash; India&apos;s Best Online Card Designer &rarr;
        </Link>
      </p>

      <p style={{ marginTop: 24, fontSize: '0.85rem', color: '#999' }}>
        Card Maker is a product of Creative Thinker Design Hub. India&apos;s favourite online card and invitation designer.
      </p>
    </article>
  );
}
