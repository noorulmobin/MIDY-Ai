// Fallback language
export const fallbackLng = "en";
// Supported languages
export const languages = [fallbackLng, "zh", "ja"];
// Cookie name
export const cookieName = "lang";
// Default namespace
export const defaultNS = "translation";
// Search param name
export const searchParamName = "lang";

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    // Only enable devtools in non-production environments
    debug:
      process.env.NEXT_PUBLIC_LOCALE_DEBUG === "true" &&
      process.env.NODE_ENV !== "production",
    supportedLngs: languages,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
