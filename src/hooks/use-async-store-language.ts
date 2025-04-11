import { useLocale } from "@/i18n/navigation";
import { useAppStore } from "@/stores";
import { useLayoutEffect } from "react";

const useAsyncStoreLanguage = () => {
  const { locale } = useLocale();

  const { uiLanguage } = useAppStore();

  useLayoutEffect(() => {
    if (!!uiLanguage && locale !== uiLanguage && typeof locale === "string") {
      useAppStore.getState().updateConfig({ uiLanguage: locale });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAsyncStoreLanguage;
