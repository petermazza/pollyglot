# Pollyglot — Language Family Translator

Type a word, choose language families, and reveal translations across all languages within those families — with romanization, audio pronunciation, search history, and copy-to-clipboard.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 — **it just works.** No API key, no signup, no backend setup required.

## How It Works

1. **Pick a source language** from the dropdown (defaults to English)
2. **Toggle language families** — each chip shows how many languages it contains
3. **Type a word** and hit Translate
4. **Translations reveal progressively** — each language fades in as its API call resolves
5. **Interact** — play audio, copy text, expand/collapse families, re-run from history

## Translation API

Pollyglot uses [MyMemory](https://mymemory.translated.net), a free translation API with **no signup and no API key required**.

- **5,000 chars/day** per user IP (anonymous) — enough for ~300 word lookups/day
- **50,000 chars/day** with an email address (optional, no verification needed)
- **200+ language pairs** supported
- **CORS-enabled** — calls go directly from the browser, no backend proxy needed

### Optional: Higher Rate Limit

Create a `.env` file in the project root:

```
VITE_MYMEMORY_EMAIL=your_email@example.com
```

This bumps the daily limit from 5K to 50K characters. No account creation or verification required — just pass your email as a query parameter.

## Deploy to Netlify

```bash
npm run build
```

The `netlify.toml` config handles everything. The app is a static site — no backend required. An optional Netlify Function (`netlify/functions/translate.js`) is included for server-side caching if you want to reduce API calls in production.

## Tech Stack

- **React 18 + Vite** — frontend framework
- **TailwindCSS** — styling
- **MyMemory API** — free translation, no API key, CORS-enabled
- **pinyin-pro** — high-quality Chinese romanization
- **transliteration** — generic script romanization (Cyrillic, Arabic, Devanagari, Thai, Khmer, etc.)
- **Web Speech API** — text-to-speech (free, built-in, no API key)
- **localStorage** — client-side caching (24h TTL) + search history

## Architecture

```
Browser → MyMemory API (direct, CORS-enabled)
              ↓
      localStorage cache (24h TTL)
```

No backend proxy required. The app calls MyMemory directly from the browser. An optional Netlify Function is included for server-side caching in production.

## Language Families

75 languages mapped to 15 families:

| Family | Languages | Highlights |
|---|---|---|
| Indo-European | 40 | Romance, Germanic, Slavic, Indo-Iranian, Celtic, Hellenic, Baltic, Armenian, Albanian |
| Niger-Congo | 5 | Swahili, Shona, Nyanja, Zulu, Xhosa |
| Austronesian | 5 | Indonesian, Tagalog, Malay, Samoan, Maori |
| Uralic | 3 | Finnish, Estonian, Hungarian |
| Turkic | 4 | Turkish, Azerbaijani, Kazakh, Uzbek |
| Dravidian | 3 | Tamil, Telugu, Kannada |
| Sino-Tibetan | 3 | Chinese, Burmese, Tibetan |
| Afroasiatic | 2 | Arabic, Hebrew |
| Austroasiatic | 2 | Vietnamese, Khmer |
| Tai-Kadai | 2 | Thai, Lao |
| Japonic | 1 | Japanese |
| Koreanic | 1 | Korean |
| Kartvelian | 1 | Georgian |
| Mongolic | 1 | Mongolian |
| Language Isolate | 1 | Basque |

## Project Structure

```
pollyglot/
├── netlify/functions/translate.js   # Optional server-side caching proxy
├── src/
│   ├── data/languageFamilies.js     # Family → language mapping (75 langs, 15 families)
│   ├── lib/
│   │   ├── translate.js             # MyMemory API client + localStorage cache
│   │   ├── romanize.js              # Per-script romanization dispatcher
│   │   ├── speech.js                # TTS (Web Speech API)
│   │   ├── history.js               # localStorage search history
│   │   └── utils.js                 # cn() class merge utility
│   ├── hooks/useTranslation.js      # Progressive reveal state orchestration
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── FamilySelector.jsx
│   │   ├── FamilyCard.jsx
│   │   ├── TranslationItem.jsx
│   │   └── HistoryBar.jsx
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── netlify.toml
```
