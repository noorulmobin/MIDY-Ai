import { create } from "zustand";

import { storeMiddleware } from "./middleware/default";
import { ConfigStore, createConfigSlice } from "./slices/config-slice";

type AppStore = ConfigStore;

// Global store for the application
export const useAppStore = create<AppStore>()(
  storeMiddleware(
    (...args) => ({
      ...createConfigSlice(...args),
    }),
    // TODO: change this to the actual name of the store, such as "podcast-app-store"
    "lipsync-app-store"
  )
);
