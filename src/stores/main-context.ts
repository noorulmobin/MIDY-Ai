import { createContext } from "react";

interface MainContext {
  loading: boolean;
  setLoading: (newLoading: boolean) => void;
  generateVideo: boolean;
  setGenerateVideo: (newLoading: boolean) => void;
  reset: () => void;
}

const initMainContext: MainContext = {
  loading: false,
  setLoading: () => {},
  generateVideo: false,
  setGenerateVideo: () => {},
  reset: () => {},
};

const mainContext = createContext(initMainContext);

export type { MainContext };
export { mainContext };
