import { env } from "@/env";
import { produce } from "immer";
import { StateCreator } from "zustand";
import { WithHydratedState } from "../middleware/default";

type ConfigState = {
  // Whether the store has been hydrated.
  _hasHydrated: boolean;
  // If your tool is listed in the 302 Tool Marketplace, you will receive the tool's toolInfo when a user creates a tool during login.
  toolInfo?: string;
  // The API key for your tool, which is used to authenticate your tool when making requests to the 302 API.
  apiKey?: string;
  // The name of the LLM model you want to use. If you don't specify it, the default model will be used. This parameter can also be obtained after user login.
  modelName?: string;
  // Whether the user is in China. This parameter can also be obtained after user login.
  isChina?: boolean;
  // The share code for your tool, which is used to share your tool with others.
  shareCode?: string;
  // The language of the user interface.
  uiLanguage?: string;
  // Hide 302 brand
  hideBrand?: boolean;
};

type ConfigActions = {
  updateConfig: (fields: Partial<ConfigState>) => void;
  setHasHydrated: (value: boolean) => void;
};

export type ConfigStore = ConfigState & ConfigActions;

export const createConfigSlice: StateCreator<
  ConfigStore & WithHydratedState
> = (set) => ({
  _hasHydrated: false,
  toolInfo: "",
  apiKey: env.NEXT_PUBLIC_302_API_KEY,
  modelName: env.NEXT_PUBLIC_DEFAULT_MODEL_NAME,
  isChina: env.NEXT_PUBLIC_IS_CHINA,
  hideBrand: !env.NEXT_PUBLIC_SHOW_BRAND,
  shareCode: "",
  uiLanguage: env.NEXT_PUBLIC_DEFAULT_LOCALE,
  updateConfig: (fields) => set(produce((state) => ({ ...state, ...fields }))),
  setHasHydrated: (value) =>
    set(
      produce((state) => {
        state._hasHydrated = value;
      })
    ),
});
