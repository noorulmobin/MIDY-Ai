"use client";

import { getCookie, setCookie } from "cookies-next";
import i18next, { FlatNamespace, KeyPrefix } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useEffect, useState } from "react";
import {
  FallbackNs,
  initReactI18next,
  UseTranslationOptions,
  useTranslation as useTranslationOrg,
  UseTranslationResponse,
} from "react-i18next";
import { cookieName, getOptions, languages, searchParamName } from "./settings";
const runsOnServerSide = typeof window === "undefined";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./messages/${language}/${namespace}.json`)
    )
  )
  .init({
    // TODO: Add your custom namespaces here, e.g. ['auth', 'extras', 'home', 'translation'].
    // Without doing this, hot reload won't work in debug mode
    ...getOptions(undefined, ["global", "extras", "auth", "home"]),
    lng: undefined,
    detection: {
      order: ["querystring", "cookie", "htmlTag", "navigator", "path"],
      lookupQuerystring: searchParamName,
      lookupCookie: cookieName,
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(
  lng: string,
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return;
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return;
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (getCookie(cookieName) === lng) return;
      setCookie(cookieName, lng, { path: "/" });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lng]);
  }
  return ret;
}
