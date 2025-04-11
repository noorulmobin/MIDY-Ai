import { hedraKy } from "@/api";
import { createScopedLogger } from "@/utils";

interface SuccessData {
  url: string;
}

const useHedraUploadImage = () => {
  const logger = createScopedLogger("Home");

  const ajaxUploadImageToHedra = async (file: File, aspectRatio: string) => {
    const url = `hedra/api/v1/portrait?aspect_ratio=${aspectRatio}`;
    let result: string | null = null;

    const form = new FormData();
    form.append("file", file);
    try {
      const res = await hedraKy
        .post(url, {
          body: form,
        })
        .json<SuccessData>();
      // success
      result = res.url;
    } catch (error) {
      logger.error(error);
    }
    return result;
  };

  return {
    ajaxUploadImageToHedra,
  };
};
export default useHedraUploadImage;
