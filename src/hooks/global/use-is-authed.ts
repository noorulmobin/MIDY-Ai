import { useAppStore } from "@/stores";
import { isOutsideDeployMode } from "@/utils/302";

export const useIsAuthed = () => {
  const apiKey = useAppStore.getState().apiKey || isOutsideDeployMode();
  return !!apiKey;
};
