export interface MediaItem {
  id: string;
  name: string;
  category: string;
  url: string;
  sizeLabel: string;
  createdAt?: string;
  isDefault?: boolean;
}

export const STATIC_BRAND_ASSETS: MediaItem[] = [
  {
    "id": "brand-og-image-jpg",
    "name": "OpenGraph Social Share Card",
    "category": "Brand & Logos",
    "url": "/assets/og-image.jpg",
    "sizeLabel": "271 KB",
    "isDefault": true
  },
  {
    "id": "brand-favicon-ico",
    "name": "Browser Favicon (32x32)",
    "category": "Brand & Logos",
    "url": "/favicon.ico",
    "sizeLabel": "142 KB",
    "isDefault": true
  },
  {
    "id": "brand-icon-png",
    "name": "App Web Clip Touch Icon",
    "category": "Brand & Logos",
    "url": "/icon.png",
    "sizeLabel": "142 KB",
    "isDefault": true
  },
  {
    "id": "brand-about-hero-woman-jpg",
    "name": "About Hero Woman",
    "category": "Hero & Banners",
    "url": "/images/about-hero-woman.jpg",
    "sizeLabel": "324 KB",
    "isDefault": true
  },
  {
    "id": "brand-about-story-founder-jpg",
    "name": "About Story Founder",
    "category": "Community & Sisterhood",
    "url": "/images/about-story-founder.jpg",
    "sizeLabel": "246 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-about-family-jpg",
    "name": "Ayeeyo About Family",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-about-family.jpg",
    "sizeLabel": "186 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-care-boy-jpg",
    "name": "Ayeeyo Care Boy",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-care-boy.jpg",
    "sizeLabel": "186 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-education-bus-girl-full-jpg",
    "name": "Ayeeyo Education Bus Girl Full",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-education-bus-girl-full.jpg",
    "sizeLabel": "138 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-education-bus-girl-jpg",
    "name": "Ayeeyo Education Bus Girl",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-education-bus-girl.jpg",
    "sizeLabel": "80 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-education-girls-jpg",
    "name": "Ayeeyo Education Girls",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-education-girls.jpg",
    "sizeLabel": "80 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-education-reading-jpg",
    "name": "Ayeeyo Education Reading",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-education-reading.jpg",
    "sizeLabel": "252 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-get-involved-bg-jpg",
    "name": "Ayeeyo Get Involved Bg",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-get-involved-bg.jpg",
    "sizeLabel": "34 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-hero-banner-official-png",
    "name": "Ayeeyo Hero Banner Official",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-hero-banner-official.png",
    "sizeLabel": "853 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-hero-banner-jpg",
    "name": "Ayeeyo Hero Banner",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-hero-banner.jpg",
    "sizeLabel": "94 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-hero-family-portrait-jpg",
    "name": "Ayeeyo Hero Family Portrait",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-hero-family-portrait.jpg",
    "sizeLabel": "88 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-hero-family-jpg",
    "name": "Ayeeyo Hero Family",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-hero-family.jpg",
    "sizeLabel": "365 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-hero-full-bg-jpg",
    "name": "Ayeeyo Hero Full Bg",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-hero-full-bg.jpg",
    "sizeLabel": "121 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-emblem-png",
    "name": "Ayeeyo Koris Emblem",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-emblem.png",
    "sizeLabel": "392 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-footer-png",
    "name": "Ayeeyo Koris Logo Footer",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo-footer.png",
    "sizeLabel": "3 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-header-png",
    "name": "Ayeeyo Koris Logo Header",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo-header.png",
    "sizeLabel": "3 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-nav-png",
    "name": "Ayeeyo Koris Logo Nav",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo-nav.png",
    "sizeLabel": "4 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-official-png",
    "name": "Ayeeyo Koris Logo Official",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo-official.png",
    "sizeLabel": "518 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-square-png",
    "name": "Ayeeyo Koris Logo Square",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo-square.png",
    "sizeLabel": "419 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-logo-png",
    "name": "Ayeeyo Koris Logo",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-logo.png",
    "sizeLabel": "23 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-koris-text-png",
    "name": "Ayeeyo Koris Text",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-koris-text.png",
    "sizeLabel": "97 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-power-futures-jpg",
    "name": "Ayeeyo Power Futures",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-power-futures.jpg",
    "sizeLabel": "90 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeeyo-power-grandmother-jpg",
    "name": "Ayeeyo Power Grandmother",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeeyo-power-grandmother.jpg",
    "sizeLabel": "90 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-actual-hero-png",
    "name": "Ayeeyo Koris Foundation Hero Portrait",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-actual-hero.png",
    "sizeLabel": "626 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-hero-svg",
    "name": "Ayeeyo Hero Vector",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-hero.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-portrait-png",
    "name": "Ayeeyo Portrait",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-portrait.png",
    "sizeLabel": "626 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-schoolgirls-png",
    "name": "Ayeeyo Schoolgirls",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-schoolgirls.png",
    "sizeLabel": "185 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-study-png",
    "name": "Ayeeyo Study",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-study.png",
    "sizeLabel": "40 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-village-png",
    "name": "Ayeeyo Village",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-village.png",
    "sizeLabel": "104 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-walking-png",
    "name": "Ayeeyo Walking",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-walking.png",
    "sizeLabel": "37 KB",
    "isDefault": true
  },
  {
    "id": "brand-ayeyo-writing-png",
    "name": "Ayeeyo Writing",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/ayeyo-writing.png",
    "sizeLabel": "85 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-abundance-png",
    "name": "The Abundance Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-abundance.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-awakening-png",
    "name": "The Awakening Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-awakening.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-clarity-png",
    "name": "The Clarity Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-clarity.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-confidence-png",
    "name": "The Confidence Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-confidence.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-healing-png",
    "name": "The Healing Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-healing.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-book-cover-legacy-png",
    "name": "The Legacy Edition Hardcover",
    "category": "Journals & Books",
    "url": "/images/book-cover-legacy.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-botanical-branch-svg",
    "name": "Somali Frankincense Botanical Silhouette",
    "category": "Atmospheric & Accents",
    "url": "/images/botanical-branch.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-circle-svg",
    "name": "Community Circle Vector",
    "category": "Community & Sisterhood",
    "url": "/images/community-circle.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-hero-woman-jpg",
    "name": "Community Hero Woman",
    "category": "Community & Sisterhood",
    "url": "/images/community-hero-woman.jpg",
    "sizeLabel": "246 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-sisterhood-gathering-jpg",
    "name": "Sisterhood Community Roundtable",
    "category": "Community & Sisterhood",
    "url": "/images/community-sisterhood-gathering.jpg",
    "sizeLabel": "235 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-sisterhood-sunset-jpg",
    "name": "Sisterhood Golden Hour Sunset",
    "category": "Community & Sisterhood",
    "url": "/images/community-sisterhood-sunset.jpg",
    "sizeLabel": "235 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-sunset-png",
    "name": "Community Sunset",
    "category": "Community & Sisterhood",
    "url": "/images/community-sunset.png",
    "sizeLabel": "271 KB",
    "isDefault": true
  },
  {
    "id": "brand-community-women-circle-jpg",
    "name": "Community Sisterhood Gathering Circle",
    "category": "Community & Sisterhood",
    "url": "/images/community-women-circle.jpg",
    "sizeLabel": "271 KB",
    "isDefault": true
  },
  {
    "id": "brand-contact-hero-women-jpg",
    "name": "Contact Hero Women",
    "category": "Community & Sisterhood",
    "url": "/images/contact-hero-women.jpg",
    "sizeLabel": "281 KB",
    "isDefault": true
  },
  {
    "id": "brand-contact-sisterhood-jpg",
    "name": "Contact Sisterhood",
    "category": "Community & Sisterhood",
    "url": "/images/contact-sisterhood.jpg",
    "sizeLabel": "221 KB",
    "isDefault": true
  },
  {
    "id": "brand-favicon-official-png",
    "name": "Official Brand Favicon Icon",
    "category": "Brand & Logos",
    "url": "/images/favicon-official.png",
    "sizeLabel": "142 KB",
    "isDefault": true
  },
  {
    "id": "brand-favicon-png",
    "name": "Browser Favicon (32x32)",
    "category": "Brand & Logos",
    "url": "/images/favicon.png",
    "sizeLabel": "89 KB",
    "isDefault": true
  },
  {
    "id": "brand-hero-banner-full-png",
    "name": "Hero Banner Full",
    "category": "Hero & Banners",
    "url": "/images/hero-banner-full.png",
    "sizeLabel": "333 KB",
    "isDefault": true
  },
  {
    "id": "brand-hero-landscape-png",
    "name": "Hero Landscape",
    "category": "Hero & Banners",
    "url": "/images/hero-landscape.png",
    "sizeLabel": "782 KB",
    "isDefault": true
  },
  {
    "id": "brand-hero-portrait-svg",
    "name": "Hero Portrait Vector",
    "category": "Hero & Banners",
    "url": "/images/hero-portrait.svg",
    "sizeLabel": "3 KB",
    "isDefault": true
  },
  {
    "id": "brand-hero-woman-portrait-png",
    "name": "Hero Woman Portrait",
    "category": "Hero & Banners",
    "url": "/images/hero-woman-portrait.png",
    "sizeLabel": "199 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-ayeyo-section-png",
    "name": "Homepage Ayeeyo Section",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/hp-ayeyo-section.png",
    "sizeLabel": "203 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-ayeyo-woman-png",
    "name": "Homepage Ayeeyo Woman",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/hp-ayeyo-woman.png",
    "sizeLabel": "85 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-abundance-png",
    "name": "Homepage Book Abundance",
    "category": "Journals & Books",
    "url": "/images/hp-book-abundance.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-awakening-png",
    "name": "Homepage Book Awakening",
    "category": "Journals & Books",
    "url": "/images/hp-book-awakening.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-clarity-png",
    "name": "Homepage Book Clarity",
    "category": "Journals & Books",
    "url": "/images/hp-book-clarity.png",
    "sizeLabel": "11 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-confidence-png",
    "name": "Homepage Book Confidence",
    "category": "Journals & Books",
    "url": "/images/hp-book-confidence.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-healing-png",
    "name": "Homepage Book Healing",
    "category": "Journals & Books",
    "url": "/images/hp-book-healing.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-book-legacy-png",
    "name": "Homepage Book Legacy",
    "category": "Journals & Books",
    "url": "/images/hp-book-legacy.png",
    "sizeLabel": "12 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-community-sunset-png",
    "name": "Homepage Community Sunset",
    "category": "Community & Sisterhood",
    "url": "/images/hp-community-sunset.png",
    "sizeLabel": "63 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-banner-png",
    "name": "Homepage Hero Banner",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-banner.png",
    "sizeLabel": "340 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-bg-seamless-png",
    "name": "Homepage Hero Canvas Seamless Texture",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-bg-seamless.png",
    "sizeLabel": "782 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-bg-png",
    "name": "Homepage Hero Bg",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-bg.png",
    "sizeLabel": "782 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-full-cropped-png",
    "name": "Homepage Hero Full Cropped",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-full-cropped.png",
    "sizeLabel": "458 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-full-exact-png",
    "name": "Homepage Hero Full Exact",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-full-exact.png",
    "sizeLabel": "345 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-full-with-nav-png",
    "name": "Homepage Hero Full With Nav",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-full-with-nav.png",
    "sizeLabel": "381 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-panoramic-png",
    "name": "Homepage Hero Panoramic Landscape",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-panoramic.png",
    "sizeLabel": "399 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-woman-exact-png",
    "name": "Homepage Hero Woman Exact",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-woman-exact.png",
    "sizeLabel": "193 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-hero-woman-png",
    "name": "Homepage Hero Woman",
    "category": "Hero & Banners",
    "url": "/images/hp-hero-woman.png",
    "sizeLabel": "188 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-journals-row-png",
    "name": "Homepage Journals Row",
    "category": "Journals & Books",
    "url": "/images/hp-journals-row.png",
    "sizeLabel": "150 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-movement-collage-png",
    "name": "Homepage Movement Collage",
    "category": "Community & Sisterhood",
    "url": "/images/hp-movement-collage.png",
    "sizeLabel": "97 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-prefooter-banner-png",
    "name": "Homepage Prefooter Banner",
    "category": "Hero & Banners",
    "url": "/images/hp-prefooter-banner.png",
    "sizeLabel": "86 KB",
    "isDefault": true
  },
  {
    "id": "brand-hp-why-journaling-png",
    "name": "Homepage Why Journaling",
    "category": "Journals & Books",
    "url": "/images/hp-why-journaling.png",
    "sizeLabel": "122 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-abundance-png",
    "name": "The Abundance Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-abundance.png",
    "sizeLabel": "60 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-abundance-svg",
    "name": "The Abundance Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-abundance.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-awakening-png",
    "name": "The Awakening Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-awakening.png",
    "sizeLabel": "57 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-awakening-svg",
    "name": "The Awakening Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-awakening.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-clarity-png",
    "name": "The Clarity Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-clarity.png",
    "sizeLabel": "63 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-clarity-svg",
    "name": "The Clarity Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-clarity.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-confidence-png",
    "name": "The Confidence Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-confidence.png",
    "sizeLabel": "56 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-confidence-svg",
    "name": "The Confidence Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-confidence.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-dreams-english-jpg",
    "name": "Book of Dreams (English Edition)",
    "category": "Journals & Books",
    "url": "/images/journal-dreams-english.jpg",
    "sizeLabel": "200 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-dreams-somali-png",
    "name": "Buugga Riyada (Somali Edition)",
    "category": "Journals & Books",
    "url": "/images/journal-dreams-somali.png",
    "sizeLabel": "1008 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-grateful-english-jpg",
    "name": "Book of Gratitude (English Edition)",
    "category": "Journals & Books",
    "url": "/images/journal-grateful-english.jpg",
    "sizeLabel": "221 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-grateful-somali-jpg",
    "name": "Buugga Mahadnaqa (Somali Edition)",
    "category": "Journals & Books",
    "url": "/images/journal-grateful-somali.jpg",
    "sizeLabel": "220 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-healing-png",
    "name": "The Healing Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-healing.png",
    "sizeLabel": "54 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-healing-svg",
    "name": "The Healing Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-healing.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-legacy-png",
    "name": "The Legacy Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-legacy.png",
    "sizeLabel": "56 KB",
    "isDefault": true
  },
  {
    "id": "brand-journal-legacy-svg",
    "name": "The Legacy Edition Cover Artwork",
    "category": "Journals & Books",
    "url": "/images/journal-legacy.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-admin-png",
    "name": "Logo Admin",
    "category": "Brand & Logos",
    "url": "/images/logo-admin.png",
    "sizeLabel": "75 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-auth-png",
    "name": "Logo Auth",
    "category": "Brand & Logos",
    "url": "/images/logo-auth.png",
    "sizeLabel": "75 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-brand-png",
    "name": "Logo Brand",
    "category": "Brand & Logos",
    "url": "/images/logo-brand.png",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-dark-bg-png",
    "name": "Logo Dark Bg",
    "category": "Brand & Logos",
    "url": "/images/logo-dark-bg.png",
    "sizeLabel": "75 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-footer-white-png",
    "name": "Logo Footer White",
    "category": "Brand & Logos",
    "url": "/images/logo-footer-white.png",
    "sizeLabel": "75 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-footer-png",
    "name": "Logo Footer",
    "category": "Brand & Logos",
    "url": "/images/logo-footer.png",
    "sizeLabel": "75 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-header-official-png",
    "name": "Logo Header Official",
    "category": "Brand & Logos",
    "url": "/images/logo-header-official.png",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-header-png",
    "name": "Logo Header",
    "category": "Brand & Logos",
    "url": "/images/logo-header.png",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-light-bg-png",
    "name": "Logo Light Bg",
    "category": "Brand & Logos",
    "url": "/images/logo-light-bg.png",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-official-png",
    "name": "Logo Official",
    "category": "Brand & Logos",
    "url": "/images/logo-official.png",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-logo-square-png",
    "name": "Logo Square",
    "category": "Brand & Logos",
    "url": "/images/logo-square.png",
    "sizeLabel": "332 KB",
    "isDefault": true
  },
  {
    "id": "brand-merch-canvas-tote-jpg",
    "name": "Heritage Canvas Tote Bag",
    "category": "Merchandise & Goods",
    "url": "/images/merch-canvas-tote.jpg",
    "sizeLabel": "834 KB",
    "isDefault": true
  },
  {
    "id": "brand-merch-dabqaad-burner-jpg",
    "name": "Handcrafted Clay Dabqaad Burner",
    "category": "Merchandise & Goods",
    "url": "/images/merch-dabqaad-burner.jpg",
    "sizeLabel": "793 KB",
    "isDefault": true
  },
  {
    "id": "brand-merch-garbasaar-scarf-jpg",
    "name": "Silk Heritage Garbasaar Scarf",
    "category": "Merchandise & Goods",
    "url": "/images/merch-garbasaar-scarf.jpg",
    "sizeLabel": "1006 KB",
    "isDefault": true
  },
  {
    "id": "brand-merch-shax-board-jpg",
    "name": "Carved Wooden Shax Game Board",
    "category": "Merchandise & Goods",
    "url": "/images/merch-shax-board.jpg",
    "sizeLabel": "807 KB",
    "isDefault": true
  },
  {
    "id": "brand-mission-women-community-jpg",
    "name": "Sisterhood Empowerment Mission Gathering",
    "category": "Community & Sisterhood",
    "url": "/images/mission-women-community.jpg",
    "sizeLabel": "274 KB",
    "isDefault": true
  },
  {
    "id": "brand-movement-sisterhood-cropped-jpg",
    "name": "Sisterhood Movement Vignette",
    "category": "Community & Sisterhood",
    "url": "/images/movement-sisterhood-cropped.jpg",
    "sizeLabel": "53 KB",
    "isDefault": true
  },
  {
    "id": "brand-movement-sisterhood-jpg",
    "name": "Naag Nool Sisterhood Movement Gathering",
    "category": "Community & Sisterhood",
    "url": "/images/movement-sisterhood.jpg",
    "sizeLabel": "281 KB",
    "isDefault": true
  },
  {
    "id": "brand-movement-woman-jpg",
    "name": "Empowered Somali Woman Editorial Portrait",
    "category": "Community & Sisterhood",
    "url": "/images/movement-woman.jpg",
    "sizeLabel": "221 KB",
    "isDefault": true
  },
  {
    "id": "brand-movement-woman-png",
    "name": "Empowered Somali Woman Editorial Portrait",
    "category": "Community & Sisterhood",
    "url": "/images/movement-woman.png",
    "sizeLabel": "669 KB",
    "isDefault": true
  },
  {
    "id": "brand-mug-naagnool-black-png",
    "name": "Naag Nool Matte Black Ceramic Mug",
    "category": "Merchandise & Goods",
    "url": "/images/mug-naagnool-black.png",
    "sizeLabel": "982 KB",
    "isDefault": true
  },
  {
    "id": "brand-mug-naagnool-white-jpg",
    "name": "Naag Nool Glazed Sand White Mug",
    "category": "Merchandise & Goods",
    "url": "/images/mug-naagnool-white.jpg",
    "sizeLabel": "256 KB",
    "isDefault": true
  },
  {
    "id": "brand-notebook-mogadishu-map-jpg",
    "name": "Mogadishu Cartography Notebook",
    "category": "Journals & Books",
    "url": "/images/notebook-mogadishu-map.jpg",
    "sizeLabel": "297 KB",
    "isDefault": true
  },
  {
    "id": "brand-notebook-naagnool-blue-jpg",
    "name": "Naag Nool Azure Pocket Notebook",
    "category": "Journals & Books",
    "url": "/images/notebook-naagnool-blue.jpg",
    "sizeLabel": "203 KB",
    "isDefault": true
  },
  {
    "id": "brand-notebook-studying-green-jpg",
    "name": "Emerald Reflection Study Journal",
    "category": "Journals & Books",
    "url": "/images/notebook-studying-green.jpg",
    "sizeLabel": "364 KB",
    "isDefault": true
  },
  {
    "id": "brand-edahab-jpg",
    "name": "eDahab Dahabshiil Mobile Money Logo",
    "category": "Payment Badges",
    "url": "/images/payment-methods/edahab.jpg",
    "sizeLabel": "8 KB",
    "isDefault": true
  },
  {
    "id": "brand-evc-plus-logo-01-230x128-webp",
    "name": "Hormuud EVC Plus Mobile Gateway Logo",
    "category": "Payment Badges",
    "url": "/images/payment-methods/EVC-PLUS-Logo-01-230x128.webp",
    "sizeLabel": "4 KB",
    "isDefault": true
  },
  {
    "id": "brand-golis-telecom-logo-png",
    "name": "Golis Telecom Sahal Service Logo",
    "category": "Payment Badges",
    "url": "/images/payment-methods/Golis_Telecom_Logo.png",
    "sizeLabel": "107 KB",
    "isDefault": true
  },
  {
    "id": "brand-premier-wallet-png",
    "name": "Premier Bank Mobile Wallet Logo",
    "category": "Payment Badges",
    "url": "/images/payment-methods/premier wallet.png",
    "sizeLabel": "35 KB",
    "isDefault": true
  },
  {
    "id": "brand-zaad-png",
    "name": "Telesom ZAAD Service Logo",
    "category": "Payment Badges",
    "url": "/images/payment-methods/zaad.png",
    "sizeLabel": "13 KB",
    "isDefault": true
  },
  {
    "id": "brand-prefooter-sunset-cinematic-jpg",
    "name": "Cinematic Sunset Ambient Horizon Banner",
    "category": "Hero & Banners",
    "url": "/images/prefooter-sunset-cinematic.jpg",
    "sizeLabel": "698 KB",
    "isDefault": true
  },
  {
    "id": "brand-product-clarity-main-png",
    "name": "The Clarity Journal Studio Product Shot",
    "category": "Product Showcase",
    "url": "/images/product-clarity-main.png",
    "sizeLabel": "297 KB",
    "isDefault": true
  },
  {
    "id": "brand-product-editorial-woman-png",
    "name": "Journal Reflection Editorial Portrait",
    "category": "Product Showcase",
    "url": "/images/product-editorial-woman.png",
    "sizeLabel": "238 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-banner-actual-png",
    "name": "Shop Banner Actual",
    "category": "Hero & Banners",
    "url": "/images/shop-banner-actual.png",
    "sizeLabel": "877 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-banner-books-png",
    "name": "Shop Banner Books",
    "category": "Journals & Books",
    "url": "/images/shop-banner-books.png",
    "sizeLabel": "110 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-banner-official-png",
    "name": "Shop Banner Official",
    "category": "Hero & Banners",
    "url": "/images/shop-banner-official.png",
    "sizeLabel": "877 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-abundance-png",
    "name": "Shop Flatlay Abundance",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-abundance.png",
    "sizeLabel": "56 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-awakening-png",
    "name": "Shop Flatlay Awakening",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-awakening.png",
    "sizeLabel": "56 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-clarity-png",
    "name": "Shop Flatlay Clarity",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-clarity.png",
    "sizeLabel": "61 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-confidence-png",
    "name": "Shop Flatlay Confidence",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-confidence.png",
    "sizeLabel": "54 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-healing-png",
    "name": "Shop Flatlay Healing",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-healing.png",
    "sizeLabel": "53 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-flatlay-legacy-png",
    "name": "Shop Flatlay Legacy",
    "category": "Product Showcase",
    "url": "/images/shop-flatlay-legacy.png",
    "sizeLabel": "53 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-hero-banner-png",
    "name": "Shop Hero Banner",
    "category": "Hero & Banners",
    "url": "/images/shop-hero-banner.png",
    "sizeLabel": "488 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-hero-woman-png",
    "name": "Shop Hero Woman",
    "category": "Hero & Banners",
    "url": "/images/shop-hero-woman.png",
    "sizeLabel": "202 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-impact-ayeeyo-jpg",
    "name": "Shop Impact Ayeeyo",
    "category": "Ayeeyo Koris Foundation",
    "url": "/images/shop-impact-ayeeyo.jpg",
    "sizeLabel": "332 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-impact-banner-png",
    "name": "Shop Impact Banner",
    "category": "Hero & Banners",
    "url": "/images/shop-impact-banner.png",
    "sizeLabel": "130 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-impact-books-png",
    "name": "Shop Impact Books",
    "category": "Journals & Books",
    "url": "/images/shop-impact-books.png",
    "sizeLabel": "129 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-abundance-png",
    "name": "Shop Journal Abundance",
    "category": "Journals & Books",
    "url": "/images/shop-journal-abundance.png",
    "sizeLabel": "42 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-awakening-png",
    "name": "Shop Journal Awakening",
    "category": "Journals & Books",
    "url": "/images/shop-journal-awakening.png",
    "sizeLabel": "63 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-clarity-png",
    "name": "Shop Journal Clarity",
    "category": "Journals & Books",
    "url": "/images/shop-journal-clarity.png",
    "sizeLabel": "64 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-confidence-png",
    "name": "Shop Journal Confidence",
    "category": "Journals & Books",
    "url": "/images/shop-journal-confidence.png",
    "sizeLabel": "35 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-healing-png",
    "name": "Shop Journal Healing",
    "category": "Journals & Books",
    "url": "/images/shop-journal-healing.png",
    "sizeLabel": "61 KB",
    "isDefault": true
  },
  {
    "id": "brand-shop-journal-legacy-png",
    "name": "Shop Journal Legacy",
    "category": "Journals & Books",
    "url": "/images/shop-journal-legacy.png",
    "sizeLabel": "56 KB",
    "isDefault": true
  },
  {
    "id": "brand-somali-women-group-png",
    "name": "Somali Women Circle Community Vector",
    "category": "Community & Sisterhood",
    "url": "/images/somali-women-group.png",
    "sizeLabel": "212 KB",
    "isDefault": true
  },
  {
    "id": "brand-somali-women-group-svg",
    "name": "Somali Women Circle Community Vector",
    "category": "Community & Sisterhood",
    "url": "/images/somali-women-group.svg",
    "sizeLabel": "2 KB",
    "isDefault": true
  },
  {
    "id": "brand-story-women-journals-jpg",
    "name": "Women Sharing Journal Reflections",
    "category": "Journals & Books",
    "url": "/images/story-women-journals.jpg",
    "sizeLabel": "315 KB",
    "isDefault": true
  },
  {
    "id": "brand-sunset-banner-png",
    "name": "Sunset Banner",
    "category": "Hero & Banners",
    "url": "/images/sunset-banner.png",
    "sizeLabel": "86 KB",
    "isDefault": true
  },
  {
    "id": "brand-sunset-banner-svg",
    "name": "Sunset Banner Vector",
    "category": "Hero & Banners",
    "url": "/images/sunset-banner.svg",
    "sizeLabel": "1 KB",
    "isDefault": true
  },
  {
    "id": "brand-sunset-clean-bg-png",
    "name": "Sunset Clean Bg",
    "category": "Hero & Banners",
    "url": "/images/sunset-clean-bg.png",
    "sizeLabel": "59 KB",
    "isDefault": true
  },
  {
    "id": "brand-thumb-1-png",
    "name": "Thumb 1",
    "category": "Product Showcase",
    "url": "/images/thumb-1.png",
    "sizeLabel": "6 KB",
    "isDefault": true
  },
  {
    "id": "brand-thumb-2-png",
    "name": "Thumb 2",
    "category": "Product Showcase",
    "url": "/images/thumb-2.png",
    "sizeLabel": "6 KB",
    "isDefault": true
  },
  {
    "id": "brand-thumb-3-png",
    "name": "Thumb 3",
    "category": "Product Showcase",
    "url": "/images/thumb-3.png",
    "sizeLabel": "5 KB",
    "isDefault": true
  },
  {
    "id": "brand-thumb-4-png",
    "name": "Thumb 4",
    "category": "Product Showcase",
    "url": "/images/thumb-4.png",
    "sizeLabel": "6 KB",
    "isDefault": true
  },
  {
    "id": "brand-tote-bag-black-jpg",
    "name": "Classic Ebony Canvas Tote Bag",
    "category": "Merchandise & Goods",
    "url": "/images/tote-bag-black.jpg",
    "sizeLabel": "79 KB",
    "isDefault": true
  },
  {
    "id": "brand-tote-bag-natural-jpg",
    "name": "Natural Linen Canvas Tote Bag",
    "category": "Merchandise & Goods",
    "url": "/images/tote-bag-natural.jpg",
    "sizeLabel": "82 KB",
    "isDefault": true
  },
  {
    "id": "brand-why-journaling-woman-png",
    "name": "Why Journaling Woman",
    "category": "Journals & Books",
    "url": "/images/why-journaling-woman.png",
    "sizeLabel": "725 KB",
    "isDefault": true
  },
  {
    "id": "brand-why-journaling-png",
    "name": "Why Journaling",
    "category": "Journals & Books",
    "url": "/images/why-journaling.png",
    "sizeLabel": "725 KB",
    "isDefault": true
  },
  {
    "id": "brand-writing-hands-svg",
    "name": "Mindful Journaling Hand Illustration",
    "category": "Atmospheric & Accents",
    "url": "/images/writing-hands.svg",
    "sizeLabel": "3 KB",
    "isDefault": true
  },
  {
    "id": "brand-zipper-pouch-natural-jpg",
    "name": "Natural Canvas Zipper Stationery Pouch",
    "category": "Merchandise & Goods",
    "url": "/images/zipper-pouch-natural.jpg",
    "sizeLabel": "100 KB",
    "isDefault": true
  }
];
