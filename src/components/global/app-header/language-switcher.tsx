"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_LANG_OPTION } from "@/constants";
import { useClientTranslation } from "@/hooks/global/use-client-translation";
import { useLocale } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores";
import { LanguagesIcon } from "lucide-react";
type LanguageSwitchProps = {
  className?: string;
};
export function LanguageSwitcher({ className }: LanguageSwitchProps) {
  const { t } = useClientTranslation();
  const { locale, changeLocale } = useLocale();

  const handleChangeLocale = (locale: string) => {
    changeLocale(locale);
    useAppStore.getState().updateConfig({ uiLanguage: locale });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          aria-label={t("global:header.language_switcher.switch_language")}
          variant="icon"
          size="roundIconSm"
          className={cn(className)}
        >
          <LanguagesIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-describedby={undefined}>
        <DropdownMenuRadioGroup
          value={locale as string}
          onValueChange={handleChangeLocale}
        >
          {APP_LANG_OPTION.map((language) => (
            <DropdownMenuRadioItem key={language.id} value={language.value}>
              {language.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
