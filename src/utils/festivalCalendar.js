/**
 * Festival Calendar — Indian festivals & occasions.
 *
 * Each festival has:
 *   key         — unique id used for routing & logic
 *   name        — display name
 *   nameHindi   — Hindi display name (optional)
 *   icon        — emoji
 *   dates       — array of { start, end } (ISO date strings, inclusive)
 *                  Multiple entries allow multi-year support.
 *   offerCard   — the card id to open when user clicks the CTA
 *   offerPrice  — price text shown in the banner
 *   offerTitle  — headline for the special offer banner
 *   offerDesc   — description text for the offer
 *   offerCta    — CTA button label
 *   freeCards   — array of { id, icon, name, desc, grad } shown in the free section
 *   features    — array of feature strings shown as checkmarks
 *   grad        — gradient string for the section background
 *   type        — 'free' | 'paid' | 'both'
 *
 * To add a new festival: just add an entry here. The UI auto-renders it.
 */

const FESTIVAL_CALENDAR = [
  /* ══════════ HOLI ══════════ */
  {
    key: 'holi',
    name: 'Holi',
    nameHindi: 'होली',
    icon: '🌈',
    dates: [
      { start: '2025-03-10', end: '2025-03-18' },
      { start: '2026-02-28', end: '2026-03-08' },
      { start: '2027-03-18', end: '2027-03-26' },
    ],
    offerCard: 'holicard',
    offerPrice: '₹49',
    offerTitle: '🌈 Holi Celebration Card — Unlimited Downloads!',
    offerDesc: 'Pay just <strong>₹49</strong> once and download <strong>unlimited Holi cards forever</strong>! Create vibrant, colorful greeting cards with festive typography.',
    offerCta: '🎨 Create Holi Card Now — ₹49 Only',
    freeCards: [
      { id: 'holiwishes',    icon: '🌈', name: 'होली शुभकामनाएं (Hindi)',  desc: 'रंगों भरी होली शायरी — चुनें, रंग बदलें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #ff6f91, #ffc75f)' },
      { id: 'holiwishes-en', icon: '🌈', name: 'Holi Wishes (English)',    desc: 'Beautiful English Holi messages — pick, customize colors & download!', grad: 'linear-gradient(135deg, #a29bfe, #ffc75f)' },
      { id: 'holivideo',     icon: '🎬', name: 'Holi Video Wishes',        desc: 'Download colorful Holi video greetings — share on WhatsApp & social media!', grad: 'linear-gradient(135deg, #e44d26, #f7df1e)' },
    ],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #ff6f91, #ffc75f)',
    type: 'both',
  },

  /* ══════════ DIWALI ══════════ */
  {
    key: 'diwali',
    name: 'Diwali',
    nameHindi: 'दिवाली',
    icon: '🪔',
    dates: [
      { start: '2025-10-15', end: '2025-10-25' },
      { start: '2026-11-03', end: '2026-11-13' },
      { start: '2027-10-23', end: '2027-11-02' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🪔 Diwali Special Card — Light Up Your Greetings!',
    offerDesc: 'Pay just <strong>₹49</strong> once and download <strong>unlimited Diwali cards</strong>! Beautiful diyas, rangoli & festive designs.',
    offerCta: '🪔 Create Diwali Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #f7971e, #ffd200)',
    type: 'paid',
  },

  /* ══════════ RAKSHA BANDHAN ══════════ */
  {
    key: 'rakhi',
    name: 'Raksha Bandhan',
    nameHindi: 'रक्षा बंधन',
    icon: '🪢',
    dates: [
      { start: '2025-08-05', end: '2025-08-12' },
      { start: '2026-08-24', end: '2026-08-31' },
      { start: '2027-08-14', end: '2027-08-21' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🪢 Raksha Bandhan Special — Celebrate the Bond!',
    offerDesc: 'Create beautiful <strong>Rakhi greeting cards</strong> for your siblings. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🪢 Create Rakhi Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)',
    type: 'paid',
  },

  /* ══════════ NAVRATRI / GARBA ══════════ */
  {
    key: 'navratri',
    name: 'Navratri',
    nameHindi: 'नवरात्रि',
    icon: '🔱',
    dates: [
      { start: '2025-09-22', end: '2025-10-03' },
      { start: '2026-10-11', end: '2026-10-22' },
      { start: '2027-10-01', end: '2027-10-12' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🔱 Navratri Special — Divine Celebration Cards!',
    offerDesc: 'Create stunning <strong>Navratri & Garba night invitation cards</strong>. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🔱 Create Navratri Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)',
    type: 'paid',
  },

  /* ══════════ DUSSEHRA ══════════ */
  {
    key: 'dussehra',
    name: 'Dussehra',
    nameHindi: 'दशहरा',
    icon: '🏹',
    dates: [
      { start: '2025-10-01', end: '2025-10-05' },
      { start: '2026-10-19', end: '2026-10-23' },
      { start: '2027-10-09', end: '2027-10-13' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🏹 Dussehra Special — Victory of Good Over Evil!',
    offerDesc: 'Celebrate <strong>Vijaya Dashami</strong> with stunning cards. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🏹 Create Dussehra Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #c0392b, #f39c12)',
    type: 'paid',
  },

  /* ══════════ MAKAR SANKRANTI / LOHRI ══════════ */
  {
    key: 'sankranti',
    name: 'Makar Sankranti / Lohri',
    nameHindi: 'मकर संक्रांति / लोहड़ी',
    icon: '🪁',
    dates: [
      { start: '2026-01-10', end: '2026-01-18' },
      { start: '2027-01-10', end: '2027-01-18' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🪁 Sankranti & Lohri Special — Festive Cards!',
    offerDesc: 'Create beautiful <strong>Makar Sankranti & Lohri cards</strong> with kites and bonfire themes. Pay just <strong>₹49</strong>!',
    offerCta: '🪁 Create Sankranti Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #f9d423, #f7971e)',
    type: 'paid',
  },

  /* ══════════ GANESH CHATURTHI ══════════ */
  {
    key: 'ganesh',
    name: 'Ganesh Chaturthi',
    nameHindi: 'गणेश चतुर्थी',
    icon: '🙏',
    dates: [
      { start: '2025-08-27', end: '2025-09-06' },
      { start: '2026-09-16', end: '2026-09-26' },
      { start: '2027-09-06', end: '2027-09-16' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🙏 Ganesh Chaturthi Special — Auspicious Cards!',
    offerDesc: 'Welcome Bappa with beautiful <strong>Ganesh Chaturthi cards</strong>. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🙏 Create Ganesh Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #f7971e, #ffd200)',
    type: 'paid',
  },

  /* ══════════ JANMASHTAMI ══════════ */
  {
    key: 'janmashtami',
    name: 'Janmashtami',
    nameHindi: 'जन्माष्टमी',
    icon: '🦚',
    dates: [
      { start: '2025-08-14', end: '2025-08-20' },
      { start: '2026-09-03', end: '2026-09-09' },
      { start: '2027-08-24', end: '2027-08-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🦚 Janmashtami Special — Celebrate Lord Krishna!',
    offerDesc: 'Create divine <strong>Janmashtami greeting cards</strong>. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🦚 Create Janmashtami Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #667eea, #764ba2)',
    type: 'paid',
  },

  /* ══════════ EID ══════════ */
  {
    key: 'eid',
    name: 'Eid',
    nameHindi: 'ईद',
    icon: '🌙',
    dates: [
      { start: '2025-03-28', end: '2025-04-04' },
      { start: '2026-03-17', end: '2026-03-24' },
      { start: '2025-06-06', end: '2025-06-10' },
      { start: '2026-05-26', end: '2026-05-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🌙 Eid Mubarak — Beautiful Greeting Cards!',
    offerDesc: 'Create elegant <strong>Eid greeting cards</strong> with crescent moon & mosque themes. Pay just <strong>₹49</strong>!',
    offerCta: '🌙 Create Eid Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #2d3436, #00b894)',
    type: 'paid',
  },

  /* ══════════ CHRISTMAS ══════════ */
  {
    key: 'christmas',
    name: 'Christmas',
    nameHindi: 'क्रिसमस',
    icon: '🎄',
    dates: [
      { start: '2025-12-20', end: '2025-12-28' },
      { start: '2026-12-20', end: '2026-12-28' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🎄 Christmas Special — Jolly Greeting Cards!',
    offerDesc: 'Spread the holiday cheer with beautiful <strong>Christmas cards</strong>. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🎄 Create Christmas Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #c0392b, #27ae60)',
    type: 'paid',
  },

  /* ══════════ NEW YEAR ══════════ */
  {
    key: 'newyear',
    name: 'New Year',
    nameHindi: 'नव वर्ष',
    icon: '🎆',
    dates: [
      { start: '2025-12-28', end: '2026-01-05' },
      { start: '2026-12-28', end: '2027-01-05' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🎆 New Year Special — Start Fresh with Beautiful Cards!',
    offerDesc: 'Welcome the New Year with stunning <strong>greeting cards</strong>. Pay just <strong>₹49</strong> for unlimited downloads!',
    offerCta: '🎆 Create New Year Card Now — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #0f0c29, #302b63)',
    type: 'paid',
  },

  /* ══════════ INDEPENDENCE DAY ══════════ */
  {
    key: 'independenceday',
    name: 'Independence Day',
    nameHindi: 'स्वतंत्रता दिवस',
    icon: '🇮🇳',
    dates: [
      { start: '2025-08-10', end: '2025-08-18' },
      { start: '2026-08-10', end: '2026-08-18' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🇮🇳 Independence Day Special — Patriotic Cards!',
    offerDesc: 'Celebrate <strong>15th August</strong> with tricolor themed patriotic greeting cards. Pay just <strong>₹49</strong>!',
    offerCta: '🇮🇳 Create Independence Day Card — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #ff9933, #138808)',
    type: 'paid',
  },

  /* ══════════ REPUBLIC DAY ══════════ */
  {
    key: 'republicday',
    name: 'Republic Day',
    nameHindi: 'गणतंत्र दिवस',
    icon: '🇮🇳',
    dates: [
      { start: '2026-01-22', end: '2026-01-30' },
      { start: '2027-01-22', end: '2027-01-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🇮🇳 Republic Day Special — Patriotic Cards!',
    offerDesc: 'Celebrate <strong>26th January</strong> with patriotic greeting cards. Pay just <strong>₹49</strong>!',
    offerCta: '🇮🇳 Create Republic Day Card — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #ff9933, #138808)',
    type: 'paid',
  },

  /* ══════════ MOTHER'S DAY ══════════ */
  {
    key: 'mothersday',
    name: "Mother's Day",
    nameHindi: 'मातृ दिवस',
    icon: '💐',
    dates: [
      { start: '2025-05-07', end: '2025-05-14' },
      { start: '2026-05-06', end: '2026-05-13' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: "💐 Mother's Day Special — Celebrate Mom!",
    offerDesc: "Create heartfelt <strong>Mother's Day cards</strong> to show your love. Pay just <strong>₹49</strong>!",
    offerCta: "💐 Create Mother's Day Card — ₹49 Only",
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
    type: 'paid',
  },

  /* ══════════ FATHER'S DAY ══════════ */
  {
    key: 'fathersday',
    name: "Father's Day",
    nameHindi: 'पितृ दिवस',
    icon: '👨‍👧',
    dates: [
      { start: '2025-06-12', end: '2025-06-19' },
      { start: '2026-06-17', end: '2026-06-24' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: "👨‍👧 Father's Day Special — Celebrate Dad!",
    offerDesc: "Create heartfelt <strong>Father's Day cards</strong> to honor your hero. Pay just <strong>₹49</strong>!",
    offerCta: "👨‍👧 Create Father's Day Card — ₹49 Only",
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #2d3436, #636e72)',
    type: 'paid',
  },

  /* ══════════ KARWA CHAUTH ══════════ */
  {
    key: 'karwachauth',
    name: 'Karwa Chauth',
    nameHindi: 'करवा चौथ',
    icon: '🌕',
    dates: [
      { start: '2025-10-09', end: '2025-10-14' },
      { start: '2026-09-28', end: '2026-10-03' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🌕 Karwa Chauth Special — Cards for Your Love!',
    offerDesc: 'Create beautiful <strong>Karwa Chauth cards</strong> to celebrate your bond. Pay just <strong>₹49</strong>!',
    offerCta: '🌕 Create Karwa Chauth Card — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #c0392b, #e74c3c)',
    type: 'paid',
  },

  /* ══════════ BAISAKHI ══════════ */
  {
    key: 'baisakhi',
    name: 'Baisakhi',
    nameHindi: 'बैसाखी',
    icon: '🌾',
    dates: [
      { start: '2025-04-10', end: '2025-04-17' },
      { start: '2026-04-10', end: '2026-04-17' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🌾 Baisakhi Special — Harvest Festival Cards!',
    offerDesc: 'Celebrate the harvest season with vibrant <strong>Baisakhi cards</strong>. Pay just <strong>₹49</strong>!',
    offerCta: '🌾 Create Baisakhi Card — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #f9d423, #f7971e)',
    type: 'paid',
  },

  /* ══════════ CHHATH PUJA ══════════ */
  {
    key: 'chhath',
    name: 'Chhath Puja',
    nameHindi: 'छठ पूजा',
    icon: '🌅',
    dates: [
      { start: '2025-10-26', end: '2025-11-01' },
      { start: '2026-11-14', end: '2026-11-20' },
    ],
    offerCard: 'festivalcards',
    offerPrice: '₹49',
    offerTitle: '🌅 Chhath Puja Special — Sacred Sun Greeting Cards!',
    offerDesc: 'Create beautiful <strong>Chhath Puja cards</strong> with sunrise & water themes. Pay just <strong>₹49</strong>!',
    offerCta: '🌅 Create Chhath Card — ₹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #f7971e, #ffd200)',
    type: 'paid',
  },
];

/**
 * Get all festivals that are currently active (today falls within their date range).
 * @param {Date} [now] — optional date override for testing
 * @returns {Array} — array of active festival objects
 */
export function getActiveFestivals(now = new Date()) {
  const today = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  return FESTIVAL_CALENDAR.filter(f =>
    f.dates.some(d => today >= d.start && today <= d.end)
  );
}

/**
 * Get all festivals (for the "all occasional cards" bottom drawer).
 * @returns {Array}
 */
export function getAllFestivals() {
  return FESTIVAL_CALENDAR;
}

/**
 * Get upcoming festivals (next 60 days from now).
 * @param {Date} [now]
 * @returns {Array} — sorted by nearest start date
 */
export function getUpcomingFestivals(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const futureLimit = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return FESTIVAL_CALENDAR
    .map(f => {
      const next = f.dates.find(d => d.start >= today && d.start <= futureLimit);
      return next ? { ...f, nextStart: next.start } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.nextStart.localeCompare(b.nextStart));
}

/**
 * Get festivals visible on the landing page.
 * Logic: show from 7 days BEFORE the festival start date until 1 day AFTER.
 * @param {Date} [now] — optional date override for testing
 * @returns {Array} — sorted by nearest start date, with `festivalStart` attached
 */
export function getVisibleFestivals(now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
  const ONE_DAY_MS = 1 * 24 * 60 * 60 * 1000;

  return FESTIVAL_CALENDAR
    .map(f => {
      const match = f.dates.find(d => {
        const showFrom = new Date(new Date(d.start + 'T00:00:00').getTime() - SEVEN_DAYS_MS)
          .toISOString().slice(0, 10);
        const hideAfter = new Date(new Date(d.start + 'T00:00:00').getTime() + ONE_DAY_MS)
          .toISOString().slice(0, 10);
        return today >= showFrom && today <= hideAfter;
      });
      return match ? { ...f, festivalStart: match.start } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.festivalStart.localeCompare(b.festivalStart));
}

export default FESTIVAL_CALENDAR;
