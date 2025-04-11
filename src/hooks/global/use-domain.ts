"use client";

import { env } from "@/env";
import { useAppStore } from "@/stores";

export function useDomain() {
  const isChina = useAppStore((state) => state.isChina);

  const domain = isChina
    ? env.NEXT_PUBLIC_302_WEBSITE_URL_CHINA
    : env.NEXT_PUBLIC_302_WEBSITE_URL_GLOBAL;
  return domain;
}
