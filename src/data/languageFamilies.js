// Language family data — source of truth
// Maps each family → sub-family → language
// Languages supported by MyMemory API (200+ language pairs)

export const languages = [
  // ═══════════════════════════════════════════════
  // Indo-European (~40 languages)
  // ═══════════════════════════════════════════════

  // Indo-European — Romance
  { code: 'es', name: 'Spanish', nativeName: 'Español', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'fr', name: 'French', nativeName: 'Français', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },
  { code: 'gl', name: 'Galician', nativeName: 'Galego', family: 'Indo-European', subfamily: 'Romance', script: 'Latin', rtl: false, romanize: false },

  // Indo-European — Germanic
  { code: 'en', name: 'English', nativeName: 'English', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'nb', name: 'Norwegian', nativeName: 'Norsk', family: 'Indo-European', subfamily: 'Germanic', script: 'Latin', rtl: false, romanize: false },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש', family: 'Indo-European', subfamily: 'Germanic', script: 'Arabic', rtl: true, romanize: true },

  // Indo-European — Slavic
  { code: 'ru', name: 'Russian', nativeName: 'Русский', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', family: 'Indo-European', subfamily: 'Slavic', script: 'Latin', rtl: false, romanize: false },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', family: 'Indo-European', subfamily: 'Slavic', script: 'Latin', rtl: false, romanize: false },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', family: 'Indo-European', subfamily: 'Slavic', script: 'Latin', rtl: false, romanize: false },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', family: 'Indo-European', subfamily: 'Slavic', script: 'Latin', rtl: false, romanize: false },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', family: 'Indo-European', subfamily: 'Slavic', script: 'Latin', rtl: false, romanize: false },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская', family: 'Indo-European', subfamily: 'Slavic', script: 'Cyrillic', rtl: false, romanize: true },

  // Indo-European — Indo-Iranian
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Devanagari', rtl: false, romanize: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Arabic', rtl: true, romanize: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Bengali', rtl: false, romanize: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Gujarati', rtl: false, romanize: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Gurmukhi', rtl: false, romanize: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Arabic', rtl: true, romanize: true },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Devanagari', rtl: false, romanize: true },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Arabic', rtl: true, romanize: true },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', family: 'Indo-European', subfamily: 'Indo-Iranian', script: 'Arabic', rtl: true, romanize: true },

  // Indo-European — Celtic
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', family: 'Indo-European', subfamily: 'Celtic', script: 'Latin', rtl: false, romanize: false },
  { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig', family: 'Indo-European', subfamily: 'Celtic', script: 'Latin', rtl: false, romanize: false },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg', family: 'Indo-European', subfamily: 'Celtic', script: 'Latin', rtl: false, romanize: false },

  // Indo-European — Hellenic
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', family: 'Indo-European', subfamily: 'Hellenic', script: 'Greek', rtl: false, romanize: true },

  // Indo-European — Baltic
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', family: 'Indo-European', subfamily: 'Baltic', script: 'Latin', rtl: false, romanize: false },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', family: 'Indo-European', subfamily: 'Baltic', script: 'Latin', rtl: false, romanize: false },

  // Indo-European — Armenian
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', family: 'Indo-European', subfamily: 'Armenian', script: 'Armenian', rtl: false, romanize: true },

  // Indo-European — Albanian
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', family: 'Indo-European', subfamily: 'Albanian', script: 'Latin', rtl: false, romanize: false },

  // ═══════════════════════════════════════════════
  // Afroasiatic
  // ═══════════════════════════════════════════════

  // Afroasiatic — Semitic
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', family: 'Afroasiatic', subfamily: 'Semitic', script: 'Arabic', rtl: true, romanize: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', family: 'Afroasiatic', subfamily: 'Semitic', script: 'Arabic', rtl: true, romanize: true },

  // ═══════════════════════════════════════════════
  // Uralic
  // ═══════════════════════════════════════════════

  // Uralic — Finnic / Ugric
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', family: 'Uralic', subfamily: 'Finnic', script: 'Latin', rtl: false, romanize: false },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti', family: 'Uralic', subfamily: 'Finnic', script: 'Latin', rtl: false, romanize: false },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', family: 'Uralic', subfamily: 'Ugric', script: 'Latin', rtl: false, romanize: false },

  // ═══════════════════════════════════════════════
  // Austronesian
  // ═══════════════════════════════════════════════

  // Austronesian — Malayo-Polynesian
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', family: 'Austronesian', subfamily: 'Malayo-Polynesian', script: 'Latin', rtl: false, romanize: false },
  { code: 'tl', name: 'Tagalog', nativeName: 'Tagalog', family: 'Austronesian', subfamily: 'Malayo-Polynesian', script: 'Latin', rtl: false, romanize: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', family: 'Austronesian', subfamily: 'Malayo-Polynesian', script: 'Latin', rtl: false, romanize: false },
  { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa', family: 'Austronesian', subfamily: 'Malayo-Polynesian', script: 'Latin', rtl: false, romanize: false },
  { code: 'mi', name: 'Maori', nativeName: 'Māori', family: 'Austronesian', subfamily: 'Malayo-Polynesian', script: 'Latin', rtl: false, romanize: false },

  // ═══════════════════════════════════════════════
  // Sino-Tibetan
  // ═══════════════════════════════════════════════

  // Sino-Tibetan — Sinitic
  { code: 'zh', name: 'Chinese', nativeName: '中文', family: 'Sino-Tibetan', subfamily: 'Sinitic', script: 'Han', rtl: false, romanize: true },

  // Sino-Tibetan — Tibeto-Burman
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ', family: 'Sino-Tibetan', subfamily: 'Tibeto-Burman', script: 'Burmese', rtl: false, romanize: true },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་སྐད', family: 'Sino-Tibetan', subfamily: 'Tibeto-Burman', script: 'Tibetan', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Turkic
  // ═══════════════════════════════════════════════

  // Turkic — Oghuz
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', family: 'Turkic', subfamily: 'Oghuz', script: 'Latin', rtl: false, romanize: false },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', family: 'Turkic', subfamily: 'Oghuz', script: 'Latin', rtl: false, romanize: false },

  // Turkic — Kipchak
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', family: 'Turkic', subfamily: 'Kipchak', script: 'Cyrillic', rtl: false, romanize: true },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek', family: 'Turkic', subfamily: 'Kipchak', script: 'Latin', rtl: false, romanize: false },

  // ═══════════════════════════════════════════════
  // Dravidian
  // ═══════════════════════════════════════════════

  // Dravidian — South Dravidian
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', family: 'Dravidian', subfamily: 'South Dravidian', script: 'Tamil', rtl: false, romanize: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', family: 'Dravidian', subfamily: 'South Dravidian', script: 'Telugu', rtl: false, romanize: true },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', family: 'Dravidian', subfamily: 'South Dravidian', script: 'Kannada', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Japonic
  // ═══════════════════════════════════════════════

  { code: 'ja', name: 'Japanese', nativeName: '日本語', family: 'Japonic', subfamily: 'Japanese', script: 'Kana', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Koreanic
  // ═══════════════════════════════════════════════

  { code: 'ko', name: 'Korean', nativeName: '한국어', family: 'Koreanic', subfamily: 'Korean', script: 'Hangul', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Austroasiatic
  // ═══════════════════════════════════════════════

  // Austroasiatic — Vietic
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', family: 'Austroasiatic', subfamily: 'Viatic', script: 'Latin', rtl: false, romanize: false },

  // Austroasiatic — Mon-Khmer
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ', family: 'Austroasiatic', subfamily: 'Mon-Khmer', script: 'Khmer', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Tai-Kadai
  // ═══════════════════════════════════════════════

  { code: 'th', name: 'Thai', nativeName: 'ไทย', family: 'Tai-Kadai', subfamily: 'Kam-Tai', script: 'Thai', rtl: false, romanize: true },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ', family: 'Tai-Kadai', subfamily: 'Kam-Tai', script: 'Lao', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Niger-Congo
  // ═══════════════════════════════════════════════

  // Niger-Congo — Bantu
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', family: 'Niger-Congo', subfamily: 'Bantu', script: 'Latin', rtl: false, romanize: false },
  { code: 'sn', name: 'Shona', nativeName: 'ChiShona', family: 'Niger-Congo', subfamily: 'Bantu', script: 'Latin', rtl: false, romanize: false },
  { code: 'ny', name: 'Nyanja', nativeName: 'Chichewa', family: 'Niger-Congo', subfamily: 'Bantu', script: 'Latin', rtl: false, romanize: false },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', family: 'Niger-Congo', subfamily: 'Bantu', script: 'Latin', rtl: false, romanize: false },

  // ═══════════════════════════════════════════════
  // Kartvelian
  // ═══════════════════════════════════════════════

  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', family: 'Kartvelian', subfamily: 'Georgian', script: 'Georgian', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Mongolic
  // ═══════════════════════════════════════════════

  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол', family: 'Mongolic', subfamily: 'Mongolian', script: 'Cyrillic', rtl: false, romanize: true },

  // ═══════════════════════════════════════════════
  // Language Isolate
  // ═══════════════════════════════════════════════

  { code: 'eu', name: 'Basque', nativeName: 'Euskara', family: 'Language Isolate', subfamily: 'Basque', script: 'Latin', rtl: false, romanize: false },
]

// Build family → sub-family → languages structure
export const families = (() => {
  const familyMap = {}
  for (const lang of languages) {
    if (!familyMap[lang.family]) {
      familyMap[lang.family] = { name: lang.family, subfamilies: {} }
    }
    if (!familyMap[lang.family].subfamilies[lang.subfamily]) {
      familyMap[lang.family].subfamilies[lang.subfamily] = []
    }
    familyMap[lang.family].subfamilies[lang.subfamily].push(lang)
  }
  // Convert to array with sorted subfamilies
  return Object.values(familyMap).map((f) => ({
    name: f.name,
    languageCount: languages.filter((l) => l.family === f.name).length,
    subfamilies: Object.entries(f.subfamilies)
      .map(([name, langs]) => ({ name, languages: langs }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  })).sort((a, b) => b.languageCount - a.languageCount)
})()

export function getLanguagesByFamily(familyName) {
  return languages.filter((l) => l.family === familyName)
}

export function getLanguageByCode(code) {
  return languages.find((l) => l.code === code)
}

export function getFamilyByName(name) {
  return families.find((f) => f.name === name)
}
