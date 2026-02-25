/**
 * Translations for all card templates.
 * Usage: import { T } from '../../utils/translations';
 *        const t = T['hi']; // or T['en']
 */

export const T = {
  en: {
    /* ---- Shared ---- */
    to:          'To',
    date:        'Date',
    time:        'Time',
    venue:       'Venue',

    /* ---- Birthday ---- */
    bdayBadge:   '🎊 Birthday Celebration 🎊',
    bdayTitle:   'Happy Birthday!',
    bdayTurning: (n) => `🎂 Turning ${n}! 🎂`,

    /* ---- Anniversary ---- */
    annivBadge:  (n) => `🎊 ${n} Anniversary 🎊`,
    annivTitle:  'Happy Anniversary!',

    /* ---- Jagrata ---- */
    jagBadge:    '॥ Jay Shree Shyam ॥',
    jagOrg:      'Organiser',
    jagGuest:    'Respected',
    jagPurpose:  '🙏 Purpose',
    jagStart:    'onwards',
    jagPlace:    'Venue',
    jagPrasad:   'Prasad',
    jagFooter:   'Sab Ka Beda Paar Karen Baba',
    jagSubtitle: 'Khatu Shyam Ji Ki Jai 🙏',

    /* ---- Biodata ---- */
    bioTitle:          'Marriage Biodata',
    bioSubTitle:       'विवाह परिचय पत्र',
    bioBorn:           'Born',
    bioPersonal:       '👤 Personal Details',
    bioAge:            'Age',
    bioHeight:         'Height',
    bioWeight:         'Weight',
    bioComplexion:     'Complexion',
    bioBlood:          'Blood Group',
    bioReligion:       'Religion',
    bioCaste:          'Caste',
    bioSubCaste:       'Sub Caste',
    bioAstro:          '🔮 Astrological Details',
    bioGotra:          'Gotra',
    bioRashi:          'Rashi',
    bioNakshatra:      'Nakshatra',
    bioManglik:        'Manglik',
    bioEdu:            '🎓 Education & Career',
    bioEducation:      'Education',
    bioOccupation:     'Occupation',
    bioEmployer:       'Employer',
    bioIncome:         'Annual Income',
    bioFamily:         '👨‍👩‍👧 Family Details',
    bioFather:         "Father's Name",
    bioFatherOcc:      "Father's Occupation",
    bioMother:         "Mother's Name",
    bioMotherOcc:      "Mother's Occupation",
    bioSiblings:       'Siblings',
    bioAbout:          '💬 About Me',
    bioHobbies:        'Hobbies',
    bioContact:        '📞 Contact Details',
    bioContactPerson:  'Contact Person',
    bioPhone:          'Phone',
    bioAddress:        'Address',
    bioFooter:         'With Family Blessings',
    bioYears:          'Years',
  },

  hi: {
    /* ---- Shared ---- */
    to:          'प्रिय',
    date:        'दिनांक',
    time:        'समय',
    venue:       'स्थान',

    /* ---- Birthday ---- */
    bdayBadge:   '🎊 जन्मदिन उत्सव 🎊',
    bdayTitle:   'जन्मदिन की हार्दिक शुभकामनाएँ!',
    bdayTurning: (n) => `🎂 ${n} साल के हो गए! 🎂`,

    /* ---- Anniversary ---- */
    annivBadge:  (n) => `🎊 ${n} वीं सालगिरह 🎊`,
    annivTitle:  'शादी की सालगिरह मुबारक!',

    /* ---- Jagrata ---- */
    jagBadge:    '॥ जय श्री श्याम ॥',
    jagOrg:      'आयोजक',
    jagGuest:    'आदरणीय',
    jagPurpose:  '🙏 उद्देश्य',
    jagStart:    'से प्रारंभ',
    jagPlace:    'स्थान',
    jagPrasad:   'प्रसाद',
    jagFooter:   'सब का बेड़ा पार करें बाबा',
    jagSubtitle: 'खाटू श्याम जी की जय 🙏',

    /* ---- Biodata ---- */
    bioTitle:          'विवाह परिचय पत्र',
    bioSubTitle:       'Marriage Biodata',
    bioBorn:           'जन्म तिथि',
    bioPersonal:       '👤 व्यक्तिगत विवरण',
    bioAge:            'आयु',
    bioHeight:         'लंबाई',
    bioWeight:         'वजन',
    bioComplexion:     'रंग',
    bioBlood:          'रक्त समूह',
    bioReligion:       'धर्म',
    bioCaste:          'जाति',
    bioSubCaste:       'उपजाति',
    bioAstro:          '🔮 ज्योतिष विवरण',
    bioGotra:          'गोत्र',
    bioRashi:          'राशि',
    bioNakshatra:      'नक्षत्र',
    bioManglik:        'मांगलिक',
    bioEdu:            '🎓 शिक्षा एवं व्यवसाय',
    bioEducation:      'शिक्षा',
    bioOccupation:     'व्यवसाय',
    bioEmployer:       'कंपनी',
    bioIncome:         'वार्षिक आय',
    bioFamily:         '👨‍👩‍👧 पारिवारिक विवरण',
    bioFather:         'पिता का नाम',
    bioFatherOcc:      'पिता का व्यवसाय',
    bioMother:         'माता का नाम',
    bioMotherOcc:      'माता का व्यवसाय',
    bioSiblings:       'भाई-बहन',
    bioAbout:          '💬 मेरे बारे में',
    bioHobbies:        'शौक',
    bioContact:        '📞 संपर्क विवरण',
    bioContactPerson:  'संपर्क व्यक्ति',
    bioPhone:          'फोन',
    bioAddress:        'पता',
    bioFooter:         'परिवार के आशीर्वाद से',
    bioYears:          'वर्ष',
  },
};
