"use client";
import { usePathUtils } from "@/hooks/global/use-path-utils";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { ToolInfo } from "./tool-info";
import AppHistory from "../app-history";
import { useAppStore } from "@/stores";
import { GithubHyperlink } from "./github-hyperlink";

type HeaderProps = {
  className?: string;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const { isAuthPath } = usePathUtils();
  const { hideBrand } = useAppStore();
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-2 p-2", className)}
    >
      {/* <GithubHyperlink /> */}
      {/* {!isAuthPath && <AppHistory />} */}
      {/* {!isAuthPath && !hideBrand && <ToolInfo />} */}
      {/* <LanguageSwitcher /> */}
      <ThemeSwitcher />
    </div>
  );
});

Header.displayName = "AppHeader";

export default Header;
