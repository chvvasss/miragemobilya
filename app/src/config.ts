export interface SiteConfig {
  language: string
  siteTitle: string
  siteDescription: string
}

export interface NavigationLink {
  label: string
  target: string
}

export interface NavigationConfig {
  brandName: string
  logo?: string
  links: NavigationLink[]
}

export interface HeroConfig {
  videoPath: string
  eyebrow: string
  titleLine: string
  titleEmphasis: string
  subtitleLine1: string
  subtitleLine2: string
  ctaText: string
  ctaTargetId: string
}

export interface ManifestoConfig {
  sectionLabel: string
  text: string
}

export interface AnatomyPillar {
  label: string
  title: string
  body: string
}

export interface AnatomyConfig {
  sectionLabel: string
  title: string
  pillars: AnatomyPillar[]
}

export interface TierConfig {
  name: string
  price: string
  frequency: string
  journeys: string
  image: string
  description: string
  amenities: string[]
  ctaText: string
  ctaHref: string
}

export interface TiersConfig {
  sectionLabel: string
  title: string
  tiers: TierConfig[]
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumn {
  heading: string
  links: FooterLink[]
}

export interface FooterConfig {
  ageGateText: string
  brandName: string
  brandTaglineLines: string[]
  columns: FooterColumn[]
  copyright: string
}

export const siteConfig: SiteConfig = {
  language: "tr",
  siteTitle: "Mirage Mobilya — Lüks Mobilya & Dekorasyon",
  siteDescription: "Mirage Mobilya, Classic, Luxury ve Provence koleksiyonlarıyla yaşam alanlarınıza zarafet ve ayrıcalık katıyor. 25 yılı aşkın tecrübemizle, her detayı sanat eseri olan mobilyalar üretiyoruz.",
}

export const navigationConfig: NavigationConfig = {
  brandName: "Mirage",
  logo: "images/logo.png",
  links: [
    { label: "Koleksiyonlar", target: "#tiers" },
    { label: "Felsefemiz", target: "#manifesto" },
    { label: "Hakkımızda", target: "#anatomy" },
  ],
}

export const heroConfig: HeroConfig = {
  videoPath: "videos/hero.mp4",
  eyebrow: "1998'den Beri — İstanbul",
  titleLine: "Zamansız",
  titleEmphasis: "Zarafet",
  subtitleLine1: "Her detayı sanat eseri olan mobilyalarla,",
  subtitleLine2: "yaşam alanlarınıza ayrıcalık katıyoruz.",
  ctaText: "Koleksiyonları Keşfet",
  ctaTargetId: "#tiers",
}

export const manifestoConfig: ManifestoConfig = {
  sectionLabel: "Mirage Felsefesi",
  text: "Yirmi beş yılı aşkın süredir, en seçkin malzemeleri usta ellerle buluşturarak yaşam alanlarınıza değer katıyoruz. Her bir parça, sadece bir mobilya değil; kuşaktan kuşağa aktarılacak bir miras, zarafetin ve işçiliğin mükemmel uyumunu temsil eden bir başyapıttır. Mirage, lüksü bir yaşam tarzına dönüştürür.",
}

export const anatomyConfig: AnatomyConfig = {
  sectionLabel: "Neden Mirage",
  title: "Sanat, İşçilik ve Zamansız Tasarım",
  pillars: [
    {
      label: "USTA İŞÇİLİK",
      title: "Her Detayda Mükemmellik",
      body: "50 yılı aşkın tecrübeye sahip ustalarımız, her bir mobilya parçasını özenle işliyor. El oyması detaylardan altın varak kaplamalara kadar, her aşamada en yüksek kalite standartlarını uyguluyoruz. Geleneksel marangozluk tekniklerini modern teknolojiyle birleştirerek, eşsiz parçalar ortaya çıkarıyoruz.",
    },
    {
      label: "SEÇKİN MATERYALLER",
      title: "Doğanın En İyileri",
      body: "İtalyan kadifeler, Fransız dantelleri, doğal ceviz ve meşe ağaçları... Dünyanın dört bir yanından seçtiğimiz en kaliteli malzemeleri kullanarak mobilyalarımızı hayat bulduruyoruz. Her malzeme, dayanıklılığı ve estetiğiyle kendini kanıtlamış, en seçkin kaynaklardan temin edilmektedir.",
    },
    {
      label: "ÖZEL TASARIM",
      title: "Sizin İçin, Sizin Zevkinizde",
      body: "Her yaşam alanı kendine özgüdür. Mirage olarak, müşterilerimizin zevklerine ve mekanlarına özel tasarımlar üretiyoruz. Hayal ettiğiniz her detayı birlikte şekillendiriyoruz. Size özel ölçüler, renkler ve dokularla, hayalinizdeki mekanı gerçeğe dönüştürüyoruz.",
    },
  ],
}

export const tiersConfig: TiersConfig = {
  sectionLabel: "Koleksiyonlar",
  title: "Üç Farklı Tarz, Bir Mirage Kalitesi",
  tiers: [
    {
      name: "Classic Design",
      price: "Klasik",
      frequency: "Koleksiyon",
      journeys: "Altın Detaylar, Asaletli Çizgiler",
      image: "images/slider-41.jpg",
      description: "Klasik mobilya sanatının en seçkin örneklerini sunan Classic Design koleksiyonu, altın varak işlemeleri, oymalı detayları ve ihtişamlı siluetleriyle zamansız bir güzellik vaat eder. Her parça, asırlık geleneğin modern yorumunu taşır.",
      amenities: [
        "El yapımı altın varak işlemeler",
        "Doğal ceviz ve meşe iskelet",
        "İtalyan kadife kumaşlar",
        "Özel ölçü ve renk seçenekleri",
        "Konsol, koltuk takımı ve yemek odası",
      ],
      ctaText: "Koleksiyonu İncele",
      ctaHref: "#",
    },
    {
      name: "Luxury Design",
      price: "Modern",
      frequency: "Koleksiyon",
      journeys: "Çağdaş Lüks, Sadeliğin Gücü",
      image: "images/slider-42.jpg",
      description: "Modern çizgiler ve lüks detayların mükemmel uyumunu bulacağınız Luxury Design koleksiyonu, çağdaş yaşam alanları için tasarlandı. Mermer yüzeyler, metal aksamlar ve seçkin kumaşlarla sofistike bir estetik sunar.",
      amenities: [
        "Mermer ve doğal taş detaylar",
        "Paslanmaz çelik ve pirinç aksamlar",
        "Özel dokulu kumaş ve deri seçenekleri",
        "Modüler ve fonksiyonel tasarım",
        "Oturma odası ve TV ünitesi çözümleri",
      ],
      ctaText: "Koleksiyonu İncele",
      ctaHref: "#",
    },
    {
      name: "Provence Design",
      price: "Provence",
      frequency: "Koleksiyon",
      journeys: "Romantik Zarafet, Pastoral Rüya",
      image: "images/slider-43.jpg",
      description: "Fransa'nın romantik Provence bölgesinden ilham alan bu koleksiyon, pastel tonları, oyma detayları ve çiçek motifleriyle masalsı bir atmosfer yaratır. Yatak odası ve yaşam alanları için en özel tasarımları bir araya getirir.",
      amenities: [
        "El oyması çiçek ve yaprak motifleri",
        "Krem ve altın kombinasyonu",
        "Antik beyaz patina kaplama",
        "Romantik ve pastoral detaylar",
        "Yatak odası ve gardırop çözümleri",
      ],
      ctaText: "Koleksiyonu İncele",
      ctaHref: "#",
    },
  ],
}

export const footerConfig: FooterConfig = {
  ageGateText: "Zarafet, detaylarda gizlidir.",
  brandName: "Mirage",
  brandTaglineLines: [
    "Lüks Mobilya & Dekorasyon",
    "İstanbul, Türkiye",
  ],
  columns: [
    {
      heading: "Koleksiyonlar",
      links: [
        { label: "Classic Design", href: "#" },
        { label: "Luxury Design", href: "#" },
        { label: "Provence Design", href: "#" },
      ],
    },
    {
      heading: "Kurumsal",
      links: [
        { label: "Hakkımızda", href: "#" },
        { label: "Showroom", href: "#" },
        { label: "İletişim", href: "#" },
      ],
    },
    {
      heading: "Sosyal Medya",
      links: [
        { label: "Instagram", href: "#" },
        { label: "Pinterest", href: "#" },
        { label: "Facebook", href: "#" },
      ],
    },
  ],
  copyright: "© 2025 Mirage Mobilya & Dekorasyon. Tüm hakları saklıdır.",
}
