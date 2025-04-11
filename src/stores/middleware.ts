import type { StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const storeMiddleware = <T>(
  f: StateCreator<T, [], [["zustand/devtools", T], ["zustand/persist", T]]>,
  name: string
) =>
  devtools(
    persist(f, {
      name,
      storage: createJSONStorage(() => sessionStorage),
    }),
    { enabled: false }
  );
