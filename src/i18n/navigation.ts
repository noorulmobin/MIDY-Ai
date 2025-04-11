// Ensure i18n compatibility so that all hooks under next/navigation automatically support i18n
import {
  useParams as useNextParams,
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from "next/navigation";
import { useCallback, useMemo } from "react";

// Get pathname from url without locale
export const usePathname = () => {
  const pathname = useNextPathname();
  const { locale } = useNextParams();
  const newPathname = useMemo(() => {
    return pathname.slice(locale!.length + 1);
  }, [pathname, locale]);
  return newPathname;
};

// Get router, ensure locale support
export const useRouter = () => {
  const router = useNextRouter();
  const { locale } = useNextParams();
  return useMemo(
    () => ({
      push: (path: string) => router.push(`/${locale}${path}`),
      replace: (path: string) => router.replace(`/${locale}${path}`),
      refresh: () => router.refresh(),
      back: () => router.back(),
      forward: () => router.forward(),
      prefetch: (path: string) => router.prefetch(`/${locale}${path}`),
    }),
    [router, locale]
  );
};

// Get locale from url
export const useLocale = () => {
  const { locale: originalLocale } = useNextParams();
  const router = useNextRouter();
  const pathname = useNextPathname();
  const changeLocale = useCallback(
    (locale: string) => {
      if (locale === originalLocale) return;
      router.push(`/${locale}${pathname.slice(originalLocale!.length + 1)}`);
    },
    [router, pathname, originalLocale]
  );
  return { locale: originalLocale, changeLocale } as const;
};
