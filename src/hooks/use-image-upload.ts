import { fileKy } from "@/api";
import { createScopedLogger } from "@/utils";
import { useState } from "react";

const useImageUpload = () => {
  const logger = createScopedLogger("Home");
  const [loading, setLoading] = useState(false);

  const upload = async (file: File) => {
    setLoading(true);
    let result: string | null = null;
    const url = "gpt/api/upload/gpt/image";
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fileKy
        .post(url, {
          body: form,
        })
        .json<{ data: { url: string } }>();
      result = res.data.url;
    } catch (error) {
      logger.error(error);
    }
    setLoading(false);
    return result;
  };

  return {
    loading,
    upload,
  };
};
export default useImageUpload;
