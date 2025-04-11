export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  // TODO: Change to your own support languages
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "en",
  // TODO: Change to your own SEO data
  languages: {
    zh: {
      title: "AI 照片说话",
      description: "让照片开口说话",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "AI Talking Photo",
      description: "Let the photo speak",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "AIリップシンク",
      description: "写真を口にして話す",
      image: "/images/global/desc_ja.png",
    },
  },
};
