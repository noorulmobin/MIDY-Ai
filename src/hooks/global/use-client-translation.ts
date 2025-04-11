import { useTranslation } from "@/i18n/client";
import { useLocale } from "@/i18n/navigation";

export function useClientTranslation() {
  const { locale } = useLocale();
  const { t } = useTranslation(locale as string);

  return {
    t,
  };
}
