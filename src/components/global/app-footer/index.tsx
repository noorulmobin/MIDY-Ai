"use client";

import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
// import { Trans } from "react-i18next";
// import AppLogo from "../app-logo";
import { useAppStore } from "@/stores";
import { usePathname } from "next/navigation"; // ✅ Get current route

type FooterProps = {
  className?: string;
};

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ className }, ref) => {
  const { t } = useClientTranslation();
  const { hideBrand } = useAppStore();
  const pathname = usePathname(); // ✅ Check the current route

  // ✅ Hide footer only on the landing page
  if (pathname === "/" || hideBrand) return null;

  return (
    <footer
      className={cn("flex flex-col items-center justify-center p-2", className)}
      style={{ color: "rgb(102, 102, 102)", fontSize: "12px" }}
      ref={ref}
    >
      <div className="break-all text-center">
        {t("global:footer.copyright_leading")}
      </div>
      {/* <div className="flex items-center justify-center gap-1">
        <Trans
          t={t}
          i18nKey={"global:footer.copyright_content"}
          components={{
            LinkLogo: (
              <AppLogo
                size="full"
                className="mx-auto h-[18px] w-[64px]"
                height={72}
                width={256}
              />
            ),
          }}
        />
      </div> */}
    </footer>
  );
});

Footer.displayName = "AppFooter";

export default Footer;
