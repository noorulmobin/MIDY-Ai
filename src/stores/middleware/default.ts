import type { StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

// Ensure at least one slice uses hydrated state to avoid hydrate errors in SSR projects
export type WithHydratedState = {
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const storeMiddleware = <
  T extends WithHydratedState & { _persist?: Record<string, boolean> },
>(
  f: StateCreator<T, [], [["zustand/devtools", T], ["zustand/persist", T]]>,
  name: string
) =>
  devtools(
    persist(f, {
      name,
      // By default, the store is persisted in the browser's session storage.
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }),
    // Only enable devtools in non-production environments
    { enabled: process.env.NODE_ENV !== "production" }
  );
