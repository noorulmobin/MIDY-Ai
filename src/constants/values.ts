import { TFunction } from "i18next";

export const THEME_COOKIE_NAME = "theme";
export const EMPTY_THEME = "light";
export const TRUE_STRING = "true";
export const FALSE_STRING = "false";
export const CHINA_REGION = "0";
export const OUTSIDE_DEPLOY_MODE = "OUTSIDE";
export const INTERNAL_DEPLOY_MODE = "INTERNAL";
export const SHARE_CODE_URL_PARAM = "pwd";
export const SHARE_CODE_STORE_KEY = "share_code";
export const SHARE_CODE_REMEMBER_KEY = "share_code_remember";

export const CharacterType = (t: TFunction<string, undefined>) => {
  return [
    { label: t("home:photo_tab.character_type.man"), value: "a male" },
    { label: t("home:photo_tab.character_type.woman"), value: "a female" },
    { label: t("home:photo_tab.character_type.children"), value: "a kid" },
  ];
};

export const PresetStyle = [
  {
    label: "comic_style",
    value: "Comic Style",
    image: "/images/Comic Style.png",
  },
  {
    label: "line_art_style",
    value: "Line Art Style",
    image: "/images/Line Art Style.png",
  },
  {
    label: "impressionism",
    value: "Impressionism",
    image: "/images/Impressionism.png",
  },
  { label: "clay", value: "Clay", image: "/images/Clay.png" },
  {
    label: "watercolor",
    value: "Watercolor",
    image: "/images/Watercolor.png",
  },
  { label: "cyberpunk", value: "Cyberpunk", image: "/images/Cyberpunk.png" },
  { label: "elf", value: "Elf", image: "/images/Elf.png" },
  { label: "clown", value: "Clown", image: "/images/Clown.png" },
  { label: "robot", value: "Robot", image: "/images/Robot.png" },
  { label: "vampire", value: "Vampire", image: "/images/Vampire.png" },
  { label: "zombie", value: "Zombie", image: "/images/Zombie.png" },
  {
    label: "low_poly_style",
    value: "Low Poly Style",
    image: "/images/Low Poly Style.png",
  },
];

export const Tabs = [
  { label: "tab_preset", value: 1 }, // Preset
  { label: "tab_custom", value: 2 }, // Customize
];
