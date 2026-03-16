/**
 * Festival Calendar â€” Indian festivals & occasions.
 *
 * Each festival has:
 *   key         â€” unique id used for routing & logic
 *   name        â€” display name
 *   nameHindi   â€” Hindi display name (optional)
 *   icon        â€” emoji
 *   dates       â€” array of { start, end } (ISO date strings, inclusive)
 *                  Multiple entries allow multi-year support.
 *   offerCard   â€” the card id to open when user clicks the CTA
 *   offerPrice  â€” price text shown in the banner
 *   offerTitle  â€” headline for the special offer banner
 *   offerDesc   â€” description text for the offer
 *   offerCta    â€” CTA button label
 *   freeCards   â€” array of { id, icon, name, desc, grad } shown in the free section
 *   features    â€” array of feature strings shown as checkmarks
 *   grad        â€” gradient string for the section background
 *   type        â€” 'free' | 'paid' | 'both'
 *
 * To add a new festival: just add an entry here. The UI auto-renders it.
 */

const FESTIVAL_CALENDAR = [
  /* â•â•â•â•â•â•â•â•â•â• HOLI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'holi',
    name: 'Holi',
    nameHindi: 'à¤¹à¥‹à¤²à¥€',
    icon: 'ðŸŒˆ',
    dates: [
      { start: '2025-03-10', end: '2025-03-18' },
      { start: '2026-02-28', end: '2026-03-08' },
      { start: '2027-03-18', end: '2027-03-26' },
    ],
    offerCard: 'holicard',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŒˆ Holi Celebration Card â€” Unlimited Downloads!',
    offerDesc: 'Pay just <strong>â‚¹49</strong> once and download <strong>unlimited Holi cards forever</strong>! Create vibrant, colorful greeting cards with festive typography.',
    offerCta: 'ðŸŽ¨ Create Holi Card Now â€” â‚¹49 Only',
    freeCards: [
      { id: 'holiwishes',    icon: 'ðŸŒˆ', name: 'à¤¹à¥‹à¤²à¥€ à¤¶à¥à¤­à¤•à¤¾à¤®à¤¨à¤¾à¤à¤‚ (Hindi)',  desc: 'à¤°à¤‚à¤—à¥‹à¤‚ à¤­à¤°à¥€ à¤¹à¥‹à¤²à¥€ à¤¶à¤¾à¤¯à¤°à¥€ â€” à¤šà¥à¤¨à¥‡à¤‚, à¤°à¤‚à¤— à¤¬à¤¦à¤²à¥‡à¤‚ à¤”à¤° à¤¡à¤¾à¤‰à¤¨à¤²à¥‹à¤¡ à¤•à¤°à¥‡à¤‚!', grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)' },
      { id: 'holiwishes-en', icon: 'ðŸŒˆ', name: 'Holi Wishes (English)',    desc: 'Beautiful English Holi messages â€” pick, customize colors & download!', grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)' },
      { id: 'holivideo',     icon: 'ðŸŽ¬', name: 'Holi Video Wishes',        desc: 'Download colorful Holi video greetings â€” share on WhatsApp & social media!', grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)' },
    ],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'both',
  },

  /* â•â•â•â•â•â•â•â•â•â• DIWALI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'diwali',
    name: 'Diwali',
    nameHindi: 'à¤¦à¤¿à¤µà¤¾à¤²à¥€',
    icon: 'ðŸª”',
    dates: [
      { start: '2025-10-15', end: '2025-10-25' },
      { start: '2026-11-03', end: '2026-11-13' },
      { start: '2027-10-23', end: '2027-11-02' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸª” Diwali Special Card â€” Light Up Your Greetings!',
    offerDesc: 'Pay just <strong>â‚¹49</strong> once and download <strong>unlimited Diwali cards</strong>! Beautiful diyas, rangoli & festive designs.',
    offerCta: 'ðŸª” Create Diwali Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• RAKSHA BANDHAN â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'rakhi',
    name: 'Raksha Bandhan',
    nameHindi: 'à¤°à¤•à¥à¤·à¤¾ à¤¬à¤‚à¤§à¤¨',
    icon: 'ðŸª¢',
    dates: [
      { start: '2025-08-05', end: '2025-08-12' },
      { start: '2026-08-24', end: '2026-08-31' },
      { start: '2027-08-14', end: '2027-08-21' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸª¢ Raksha Bandhan Special â€” Celebrate the Bond!',
    offerDesc: 'Create beautiful <strong>Rakhi greeting cards</strong> for your siblings. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸª¢ Create Rakhi Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• NAVRATRI / GARBA â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'navratri',
    name: 'Navratri',
    nameHindi: 'à¤¨à¤µà¤°à¤¾à¤¤à¥à¤°à¤¿',
    icon: 'ðŸ”±',
    dates: [
      { start: '2025-09-22', end: '2025-10-03' },
      { start: '2026-10-11', end: '2026-10-22' },
      { start: '2027-10-01', end: '2027-10-12' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ”± Navratri Special â€” Divine Celebration Cards!',
    offerDesc: 'Create stunning <strong>Navratri & Garba night invitation cards</strong>. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸ”± Create Navratri Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• DUSSEHRA â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'dussehra',
    name: 'Dussehra',
    nameHindi: 'à¤¦à¤¶à¤¹à¤°à¤¾',
    icon: 'ðŸ¹',
    dates: [
      { start: '2025-10-01', end: '2025-10-05' },
      { start: '2026-10-19', end: '2026-10-23' },
      { start: '2027-10-09', end: '2027-10-13' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ¹ Dussehra Special â€” Victory of Good Over Evil!',
    offerDesc: 'Celebrate <strong>Vijaya Dashami</strong> with stunning cards. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸ¹ Create Dussehra Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• MAKAR SANKRANTI / LOHRI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'sankranti',
    name: 'Makar Sankranti / Lohri',
    nameHindi: 'à¤®à¤•à¤° à¤¸à¤‚à¤•à¥à¤°à¤¾à¤‚à¤¤à¤¿ / à¤²à¥‹à¤¹à¤¡à¤¼à¥€',
    icon: 'ðŸª',
    dates: [
      { start: '2026-01-10', end: '2026-01-18' },
      { start: '2027-01-10', end: '2027-01-18' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸª Sankranti & Lohri Special â€” Festive Cards!',
    offerDesc: 'Create beautiful <strong>Makar Sankranti & Lohri cards</strong> with kites and bonfire themes. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸª Create Sankranti Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• GANESH CHATURTHI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'ganesh',
    name: 'Ganesh Chaturthi',
    nameHindi: 'à¤—à¤£à¥‡à¤¶ à¤šà¤¤à¥à¤°à¥à¤¥à¥€',
    icon: 'ðŸ™',
    dates: [
      { start: '2025-08-27', end: '2025-09-06' },
      { start: '2026-09-16', end: '2026-09-26' },
      { start: '2027-09-06', end: '2027-09-16' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ™ Ganesh Chaturthi Special â€” Auspicious Cards!',
    offerDesc: 'Welcome Bappa with beautiful <strong>Ganesh Chaturthi cards</strong>. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸ™ Create Ganesh Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• JANMASHTAMI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'janmashtami',
    name: 'Janmashtami',
    nameHindi: 'à¤œà¤¨à¥à¤®à¤¾à¤·à¥à¤Ÿà¤®à¥€',
    icon: 'ðŸ¦š',
    dates: [
      { start: '2025-08-14', end: '2025-08-20' },
      { start: '2026-09-03', end: '2026-09-09' },
      { start: '2027-08-24', end: '2027-08-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ¦š Janmashtami Special â€” Celebrate Lord Krishna!',
    offerDesc: 'Create divine <strong>Janmashtami greeting cards</strong>. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸ¦š Create Janmashtami Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• EID â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'eid',
    name: 'Eid',
    nameHindi: 'à¤ˆà¤¦',
    icon: 'ðŸŒ™',
    dates: [
      { start: '2025-03-28', end: '2025-04-04' },
      { start: '2026-03-17', end: '2026-03-24' },
      { start: '2025-06-06', end: '2025-06-10' },
      { start: '2026-05-26', end: '2026-05-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŒ™ Eid Mubarak â€” Beautiful Greeting Cards!',
    offerDesc: 'Create elegant <strong>Eid greeting cards</strong> with crescent moon & mosque themes. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸŒ™ Create Eid Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• CHRISTMAS â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'christmas',
    name: 'Christmas',
    nameHindi: 'à¤•à¥à¤°à¤¿à¤¸à¤®à¤¸',
    icon: 'ðŸŽ„',
    dates: [
      { start: '2025-12-20', end: '2025-12-28' },
      { start: '2026-12-20', end: '2026-12-28' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŽ„ Christmas Special â€” Jolly Greeting Cards!',
    offerDesc: 'Spread the holiday cheer with beautiful <strong>Christmas cards</strong>. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸŽ„ Create Christmas Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• NEW YEAR â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'newyear',
    name: 'New Year',
    nameHindi: 'à¤¨à¤µ à¤µà¤°à¥à¤·',
    icon: 'ðŸŽ†',
    dates: [
      { start: '2025-12-28', end: '2026-01-05' },
      { start: '2026-12-28', end: '2027-01-05' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŽ† New Year Special â€” Start Fresh with Beautiful Cards!',
    offerDesc: 'Welcome the New Year with stunning <strong>greeting cards</strong>. Pay just <strong>â‚¹49</strong> for unlimited downloads!',
    offerCta: 'ðŸŽ† Create New Year Card Now â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• INDEPENDENCE DAY â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'independenceday',
    name: 'Independence Day',
    nameHindi: 'à¤¸à¥à¤µà¤¤à¤‚à¤¤à¥à¤°à¤¤à¤¾ à¤¦à¤¿à¤µà¤¸',
    icon: 'ðŸ‡®ðŸ‡³',
    dates: [
      { start: '2025-08-10', end: '2025-08-18' },
      { start: '2026-08-10', end: '2026-08-18' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ‡®ðŸ‡³ Independence Day Special â€” Patriotic Cards!',
    offerDesc: 'Celebrate <strong>15th August</strong> with tricolor themed patriotic greeting cards. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸ‡®ðŸ‡³ Create Independence Day Card â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• REPUBLIC DAY â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'republicday',
    name: 'Republic Day',
    nameHindi: 'à¤—à¤£à¤¤à¤‚à¤¤à¥à¤° à¤¦à¤¿à¤µà¤¸',
    icon: 'ðŸ‡®ðŸ‡³',
    dates: [
      { start: '2026-01-22', end: '2026-01-30' },
      { start: '2027-01-22', end: '2027-01-30' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸ‡®ðŸ‡³ Republic Day Special â€” Patriotic Cards!',
    offerDesc: 'Celebrate <strong>26th January</strong> with patriotic greeting cards. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸ‡®ðŸ‡³ Create Republic Day Card â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• MOTHER'S DAY â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'mothersday',
    name: "Mother's Day",
    nameHindi: 'à¤®à¤¾à¤¤à¥ƒ à¤¦à¤¿à¤µà¤¸',
    icon: 'ðŸ’',
    dates: [
      { start: '2025-05-07', end: '2025-05-14' },
      { start: '2026-05-06', end: '2026-05-13' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: "ðŸ’ Mother's Day Special â€” Celebrate Mom!",
    offerDesc: "Create heartfelt <strong>Mother's Day cards</strong> to show your love. Pay just <strong>â‚¹49</strong>!",
    offerCta: "ðŸ’ Create Mother's Day Card â€” â‚¹49 Only",
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• FATHER'S DAY â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'fathersday',
    name: "Father's Day",
    nameHindi: 'à¤ªà¤¿à¤¤à¥ƒ à¤¦à¤¿à¤µà¤¸',
    icon: 'ðŸ‘¨â€ðŸ‘§',
    dates: [
      { start: '2025-06-12', end: '2025-06-19' },
      { start: '2026-06-17', end: '2026-06-24' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: "ðŸ‘¨â€ðŸ‘§ Father's Day Special â€” Celebrate Dad!",
    offerDesc: "Create heartfelt <strong>Father's Day cards</strong> to honor your hero. Pay just <strong>â‚¹49</strong>!",
    offerCta: "ðŸ‘¨â€ðŸ‘§ Create Father's Day Card â€” â‚¹49 Only",
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• KARWA CHAUTH â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'karwachauth',
    name: 'Karwa Chauth',
    nameHindi: 'à¤•à¤°à¤µà¤¾ à¤šà¥Œà¤¥',
    icon: 'ðŸŒ•',
    dates: [
      { start: '2025-10-09', end: '2025-10-14' },
      { start: '2026-09-28', end: '2026-10-03' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŒ• Karwa Chauth Special â€” Cards for Your Love!',
    offerDesc: 'Create beautiful <strong>Karwa Chauth cards</strong> to celebrate your bond. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸŒ• Create Karwa Chauth Card â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• BAISAKHI â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'baisakhi',
    name: 'Baisakhi',
    nameHindi: 'à¤¬à¥ˆà¤¸à¤¾à¤–à¥€',
    icon: 'ðŸŒ¾',
    dates: [
      { start: '2025-04-10', end: '2025-04-17' },
      { start: '2026-04-10', end: '2026-04-17' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŒ¾ Baisakhi Special â€” Harvest Festival Cards!',
    offerDesc: 'Celebrate the harvest season with vibrant <strong>Baisakhi cards</strong>. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸŒ¾ Create Baisakhi Card â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },

  /* â•â•â•â•â•â•â•â•â•â• CHHATH PUJA â•â•â•â•â•â•â•â•â•â• */
  {
    key: 'chhath',
    name: 'Chhath Puja',
    nameHindi: 'à¤›à¤  à¤ªà¥‚à¤œà¤¾',
    icon: 'ðŸŒ…',
    dates: [
      { start: '2025-10-26', end: '2025-11-01' },
      { start: '2026-11-14', end: '2026-11-20' },
    ],
    offerCard: 'festivalcards',
    offerPrice: 'â‚¹49',
    offerTitle: 'ðŸŒ… Chhath Puja Special â€” Sacred Sun Greeting Cards!',
    offerDesc: 'Create beautiful <strong>Chhath Puja cards</strong> with sunrise & water themes. Pay just <strong>â‚¹49</strong>!',
    offerCta: 'ðŸŒ… Create Chhath Card â€” â‚¹49 Only',
    freeCards: [],
    features: ['Unlimited Downloads', 'Lifetime Access', 'No Watermark', 'HD Quality'],
    grad: 'linear-gradient(135deg, #818cf8, #a5b4fc, #c4b5fd)',
    type: 'paid',
  },
];

/**
 * Get all festivals that are currently active (today falls within their date range).
 * @param {Date} [now] â€” optional date override for testing
 * @returns {Array} â€” array of active festival objects
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
 * @returns {Array} â€” sorted by nearest start date
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
 * @param {Date} [now] â€” optional date override for testing
 * @returns {Array} â€” sorted by nearest start date, with `festivalStart` attached
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
