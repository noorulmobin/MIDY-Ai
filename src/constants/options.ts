import { languages } from "@/i18n/settings";
import ISO639 from "iso-639-1";

export type OptionProps = {
  id: number;
  label: string;
  value: string;
};

export const APP_LANG_OPTION: OptionProps[] = languages.map(
  (language, index) => {
    return {
      id: index,
      label: ISO639.getNativeName(language),
      value: language,
    };
  }
);
