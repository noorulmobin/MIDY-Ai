import { useState } from "react";
import { useClientTranslation } from "./global/use-client-translation";
import { createScopedLogger } from "@/utils";
import ky from "ky";
import { emitter } from "@/utils/mitt";

const useFileDownload = () => {
  const { t } = useClientTranslation();
  const logger = createScopedLogger("Home");
  const [downloading, setDownloading] = useState(false);

  const getFileNameFromUrl = (url: string) => {
    const urlObject = new URL(url);
    const pathName = urlObject.pathname;
    return pathName.split("/").pop(); // 获取最后一部分，即文件名
  };

  const download = async (url: string) => {
    const fileName = getFileNameFromUrl(url);

    if (!fileName) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:download_error_no_filename"),
      });
      return;
    }

    setDownloading(true);

    try {
      const response = await ky.get(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      emitter.emit("ToastSuccess", {
        code: -1,
        message: t("home:download_success"),
      });
    } catch (error) {
      emitter.emit("ToastError", {
        code: -1,
        message: t("home:download_failed"),
      });
      logger.error("Error downloading:", error);
    } finally {
      setDownloading(false);
    }
  };
  return {
    downloading,
    download,
  };
};
export default useFileDownload;
