/**
 * Religion configuration for Jagrata card template.
 * Each entry defines the icons and decorations shown in the downloaded card
 * based on the organizer's religion.
 */

export const RELIGIONS = [
  { code: 'hindu',     label: '🕉️  Hindu (हिन्दू)'       },
  { code: 'sikh',      label: '☬  Sikh (ਸਿੱਖ)'          },
  { code: 'christian', label: '✝️  Christian (ईसाई)'     },
  { code: 'muslim',    label: '☪️  Muslim (मुस्लिम)'      },
  { code: 'buddhist',  label: '☸️  Buddhist (बौद्ध)'      },
  { code: 'jain',      label: '🙏  Jain (जैन)'           },
  { code: 'jewish',    label: '✡️  Jewish (यहूदी)'        },
  { code: 'other',     label: '🌐  Other / Universal'    },
];

export const RELIGION_CONFIG = {
  hindu: {
    mainIcon:   '🕉️',
    prasadIcon: '🍯',
    decoTop:    '🪔 ✨ 🪔 ✨ 🪔',
    decoBottom: '🌸 🪔 ॐ 🪔 🌸',
    accentColor: '#c0392b',   // saffron-maroon
  },
  sikh: {
    mainIcon:   '☬',
    prasadIcon: '🫓',
    decoTop:    '🙏 ✨ ☬ ✨ 🙏',
    decoBottom: '🌸 ☬ ਵਾਹਿਗੁਰੂ ☬ 🌸',
    accentColor: '#1a6b3c',   // deep green
  },
  christian: {
    mainIcon:   '✝️',
    prasadIcon: '🥖',
    decoTop:    '✝️ ✨ ✝️ ✨ ✝️',
    decoBottom: '🌹 ✝️ Amen ✝️ 🌹',
    accentColor: '#1a3a6b',   // navy
  },
  muslim: {
    mainIcon:   '☪️',
    prasadIcon: '🌙',
    decoTop:    '☪️ ✨ ☪️ ✨ ☪️',
    decoBottom: '🌙 ☪️ ٱللّٰه ☪️ 🌙',
    accentColor: '#006400',   // deep green
  },
  buddhist: {
    mainIcon:   '☸️',
    prasadIcon: '🫖',
    decoTop:    '☸️ ✨ ☸️ ✨ ☸️',
    decoBottom: '🌸 ☸️ Buddha ☸️ 🌸',
    accentColor: '#b8860b',   // golden
  },
  jain: {
    mainIcon:   '🔆',
    prasadIcon: '🍏',
    decoTop:    '🙏 ✨ 🔆 ✨ 🙏',
    decoBottom: '🌸 🔆 जय जिनेन्द्र 🔆 🌸',
    accentColor: '#8b5e00',   // warm brown-gold
  },
  jewish: {
    mainIcon:   '✡️',
    prasadIcon: '🍞',
    decoTop:    '✡️ ✨ ✡️ ✨ ✡️',
    decoBottom: '🕯️ ✡️ Shalom ✡️ 🕯️',
    accentColor: '#003399',   // deep blue
  },
  other: {
    mainIcon:   '🌐',
    prasadIcon: '🌿',
    decoTop:    '🌟 ✨ 🌟 ✨ 🌟',
    decoBottom: '🌸 🌟 Peace 🌟 🌸',
    accentColor: '#4a4a6a',   // slate
  },
};
