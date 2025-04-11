import { produce } from "immer";
import { create } from "zustand";
import { storeMiddleware } from "./middleware";

export interface FormStore {
  presetStyle: {
    value: string;
    image: string;
    label: string;
  };
  characterType: string;
  size: {
    value: string;
    width: number;
    height: number;
  };
  url: string;
  tab: number;
}

interface FormActions {
  updateField: <T extends keyof FormStore>(
    field: T,
    value: FormStore[T]
  ) => void;
  updateAll: (fields: Partial<FormStore>) => void;
}

export const useAvatarFormStore = create<FormStore & FormActions>()(
  storeMiddleware<FormStore & FormActions>(
    (set) => ({
      presetStyle: {
        value: "Comic Style",
        image: "/images/Comic Style.png",
        label: "comic_style",
      },
      characterType: "a male",
      size: {
        value: "square",
        height: 1024,
        width: 1024,
      },
      url: "",
      tab: 1,
      updateField: (field, value) =>
        set(
          produce((state) => {
            state[field] = value;
          })
        ),
      updateAll: (fields) =>
        set(
          produce((state) => {
            for (const [key, value] of Object.entries(fields)) {
              if (typeof value === "object" && value !== null) {
                state[key as keyof FormStore] = {
                  ...state[key as keyof FormStore],
                  ...value,
                };
              } else {
                state[key as keyof FormStore] = value;
              }
            }
          })
        ),
    }),
    "avatar_form_store_config"
  )
);
