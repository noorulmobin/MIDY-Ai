import { APP_ROUTE_MENU } from "@/constants";
import { usePathname } from "@/i18n/navigation";
import { useCallback, useMemo } from "react";

export const usePathUtils = () => {
  const pathname = usePathname();
  const isAuthPath = useMemo(() => {
    return pathname.includes("/auth");
  }, [pathname]);

  const needAuth = useMemo(() => {
    return APP_ROUTE_MENU.filter((menu) => menu.needAuth).some(
      (menu) => pathname === menu.path
    );
  }, [pathname]);

  const removeParams = useCallback(() => {
    if (typeof window !== "undefined" && pathname) {
      window.history.replaceState({}, "", pathname);
    }
  }, [pathname]);

  return {
    needAuth: false,
    isAuthPath: false,
    removeParams,
  } as const;
};
