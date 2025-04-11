import { login } from "@/services/auth";
import { useAppStore } from "@/stores";

interface InfoResult {
  success: boolean;
  errorMessage?: string;
  data?: {
    code: string;
    info: string;
    apiKey: string;
    modelName: string;
    region: string;
  };
}

export const fetchAuth = async (): Promise<InfoResult> => {
  const { shareCode } = useAppStore.getState();
  const res = await login(shareCode);
  return res;
};

export const useToolInfo = () => {
  const info = useAppStore.getState().toolInfo;

  return { info };
};
