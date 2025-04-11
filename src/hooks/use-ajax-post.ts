import { ErrorResponse } from "@/api";
import { createScopedLogger } from "@/utils";
import { KyInstance, Options } from "ky";

const useAjaxPost = (apiKy: KyInstance, url: string) => {
  const doAjax = async <T extends object>(param?: Options) => {
    let result: T | null = null;
    let errorHint = true;

    const logger = createScopedLogger("Home");

    try {
      const res = await apiKy.post(url, param).json<ErrorResponse | T>();
      if ("error" in res) {
        errorHint = false;
      } else {
        result = res;
      }
    } catch (error) {
      errorHint = false;
      logger.error(error);
    }
    return {
      result: result,
      errorHint: errorHint,
    };
  };
  return {
    doAjax,
  };
};
export default useAjaxPost;
