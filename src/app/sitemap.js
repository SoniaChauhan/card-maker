const BASE_URL = 'https://creativethinkerdesignhub.com';

export default function sitemap() {
  const now = new Date().toISOString();
  return [
    /* ── Main pages ── */
    { url: BASE_URL,                                         lastModified: now, changeFrequency: 'weekly',  priority: 1.0  },

    /* ── Card category landing pages ── */
    { url: `${BASE_URL}/birthday-invitation-maker`,          lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${BASE_URL}/wedding-card-maker`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${BASE_URL}/anniversary-card-maker`,             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/marriage-biodata-maker`,             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/rent-card-maker`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/salon-card-maker`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/card-resume-maker`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/resume-builder-online`,              lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/festival-card-maker`,                lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/greeting-card-maker`,                lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/invitation-card-maker`,              lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE_URL}/holi-card-maker-online`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE_URL}/holi-celebration-card`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE_URL}/jagrata-invitation-card`,            lastModified: now, changeFrequency: 'monthly', priority: 0.75 },

    /* ── AI-powered card pages ── */
    { url: `${BASE_URL}/ai-text-image-card`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/ai-themed-card-maker`,               lastModified: now, changeFrequency: 'monthly', priority: 0.85 },

    /* ── Video tools pages ── */
    { url: `${BASE_URL}/video-maker`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/video-trimmer`,                      lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/mp4-to-mp3-converter`,               lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/video-audio-replacer`,               lastModified: now, changeFrequency: 'monthly', priority: 0.85 },

    /* ── Wishes & quotes pages ── */
    { url: `${BASE_URL}/happy-holi-wishes-hindi`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE_URL}/happy-holi-wishes-english`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE_URL}/mothers-quotes-english`,             lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/mothers-quotes-hindi`,               lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/fathers-quotes-english`,             lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/fathers-quotes-hindi`,               lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/motivational-quotes-images-download`,lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/motivational-quotes-english`,        lastModified: now, changeFrequency: 'monthly', priority: 0.70 },

    /* ── Blog index + articles ── */
    { url: `${BASE_URL}/blog`,                                      lastModified: now, changeFrequency: 'weekly',  priority: 0.80 },
    { url: `${BASE_URL}/blog/best-online-card-maker-in-india`,      lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/free-birthday-invitation-templates`,   lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/best-wedding-card-maker-online`,       lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/how-to-make-holi-card-online`,         lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/birthday-invitation-wording-ideas`,    lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/how-to-create-marriage-biodata`,       lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/free-online-video-trimmer`,            lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/mp4-to-mp3-converter-free`,            lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    { url: `${BASE_URL}/blog/replace-video-audio-online-free`,      lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
  ];
}
