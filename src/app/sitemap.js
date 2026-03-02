const BASE_URL = 'https://card-maker-seven-eta.vercel.app';

export default function sitemap() {
  const now = new Date().toISOString();
  return [
    { url: BASE_URL,                                lastModified: now, changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${BASE_URL}/happy-holi-wishes-hindi`,   lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE_URL}/happy-holi-wishes-english`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${BASE_URL}/birthday-invitation-maker`,  lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/wedding-card-maker`,          lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/anniversary-card-maker`,      lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/festival-card-maker`,          lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
  ];
}
