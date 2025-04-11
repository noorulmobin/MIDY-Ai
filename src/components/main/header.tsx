"use client";
import { cn } from "@/lib/utils";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import LogoIcon from "./logo-icon";
import { useAppStore } from "@/stores";

/**
 * Header with brand
 * @param props
 * @returns
 */
const Header = () => {
  const { t } = useClientTranslation();
  const { hideBrand } = useAppStore();
  return (
    <header
      className={cn(
        "z-0 mt-8 flex flex-col items-center justify-center space-y-4 px-2"
      )}
    >
      <div className="flex flex-col items-center space-x-10 ">
  <div className="block items-right space-x-0 ">
    {!hideBrand && <LogoIcon className="size-30 flex-shrink-0 " />}
    <h1 className="text-8xl font-bold">MidyAI Lipsync</h1>
  </div>
  <p className="text-2xl text-white-600 mt-5">convert text into natural-sounding speech instantly</p>

</div>

    </header>
  );
};

export default Header;
